/**
 * Minimal TypeScript client for the Ollama HTTP API.
 *
 * Docs: https://github.com/ollama/ollama/blob/main/docs/api.md
 *
 * Zero dependencies — uses the global `fetch` (available in Node 18+, Bun,
 * Deno, and modern browsers). Streaming endpoints return an async iterator
 * over decoded JSON chunks.
 */

export interface OllamaClientOptions {
  /** Base URL of the Ollama server. Defaults to `http://127.0.0.1:11434`. */
  host?: string;
  /** Optional custom fetch implementation (e.g. for testing). */
  fetch?: typeof fetch;
  /** Default headers attached to every request. */
  headers?: Record<string, string>;
}

export interface GenerateOptions {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  images?: string[];
  format?: "json" | Record<string, unknown>;
  keep_alive?: string | number;
  options?: Record<string, unknown>;
  signal?: AbortSignal;
}

export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  images?: string[];
}

export interface ChatOptions {
  model: string;
  messages: ChatMessage[];
  format?: "json" | Record<string, unknown>;
  keep_alive?: string | number;
  options?: Record<string, unknown>;
  tools?: Record<string, unknown>[];
  signal?: AbortSignal;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: ChatMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface EmbeddingsOptions {
  model: string;
  input: string | string[];
  options?: Record<string, unknown>;
  signal?: AbortSignal;
}

export interface EmbeddingsResponse {
  model: string;
  embeddings: number[][];
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: Record<string, unknown>;
}

export class OllamaError extends Error {
  readonly status: number;
  readonly body: string;
  constructor(status: number, body: string, message?: string) {
    super(message ?? `Ollama request failed (${status}): ${body}`);
    this.name = "OllamaError";
    this.status = status;
    this.body = body;
  }
}

export class OllamaClient {
  private readonly host: string;
  private readonly fetchImpl: typeof fetch;
  private readonly headers: Record<string, string>;

  constructor(options: OllamaClientOptions = {}) {
    this.host = (options.host ?? "http://127.0.0.1:11434").replace(/\/+$/, "");
    this.fetchImpl = options.fetch ?? fetch;
    this.headers = { "Content-Type": "application/json", ...options.headers };
  }

  /** Non-streaming text generation. */
  async generate(opts: GenerateOptions): Promise<GenerateResponse> {
    const { signal, ...body } = opts;
    return this.postJson<GenerateResponse>("/api/generate", { ...body, stream: false }, signal);
  }

  /** Streaming text generation. Yields partial `GenerateResponse` chunks. */
  generateStream(opts: GenerateOptions): AsyncIterable<GenerateResponse> {
    const { signal, ...body } = opts;
    return this.postStream<GenerateResponse>("/api/generate", { ...body, stream: true }, signal);
  }

  /** Non-streaming chat completion. */
  async chat(opts: ChatOptions): Promise<ChatResponse> {
    const { signal, ...body } = opts;
    return this.postJson<ChatResponse>("/api/chat", { ...body, stream: false }, signal);
  }

  /** Streaming chat completion. Yields partial `ChatResponse` chunks. */
  chatStream(opts: ChatOptions): AsyncIterable<ChatResponse> {
    const { signal, ...body } = opts;
    return this.postStream<ChatResponse>("/api/chat", { ...body, stream: true }, signal);
  }

  /** Compute embeddings for one or more inputs. */
  async embed(opts: EmbeddingsOptions): Promise<EmbeddingsResponse> {
    const { signal, ...body } = opts;
    return this.postJson<EmbeddingsResponse>("/api/embed", body, signal);
  }

  /** List locally available models. */
  async listModels(signal?: AbortSignal): Promise<OllamaModel[]> {
    const res = await this.request("/api/tags", { method: "GET", signal });
    const data = (await res.json()) as { models?: OllamaModel[] };
    return data.models ?? [];
  }

  /** Pull a model from the registry. Streams progress events. */
  pullModel(model: string, signal?: AbortSignal): AsyncIterable<Record<string, unknown>> {
    return this.postStream("/api/pull", { model, stream: true }, signal);
  }

  /** Convenience helper: collect a streamed generate into one string. */
  async generateText(opts: GenerateOptions): Promise<string> {
    let out = "";
    for await (const chunk of this.generateStream(opts)) out += chunk.response ?? "";
    return out;
  }

  // ---- internals --------------------------------------------------------

  private async request(path: string, init: RequestInit): Promise<Response> {
    const res = await this.fetchImpl(`${this.host}${path}`, {
      ...init,
      headers: { ...this.headers, ...(init.headers as Record<string, string> | undefined) },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new OllamaError(res.status, body);
    }
    return res;
  }

  private async postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const res = await this.request(path, { method: "POST", body: JSON.stringify(body), signal });
    return (await res.json()) as T;
  }

  private async *postStream<T>(
    path: string,
    body: unknown,
    signal?: AbortSignal,
  ): AsyncGenerator<T> {
    const res = await this.request(path, { method: "POST", body: JSON.stringify(body), signal });
    if (!res.body) throw new OllamaError(res.status, "", "Response has no body to stream");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // Ollama streams newline-delimited JSON objects.
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (line) yield JSON.parse(line) as T;
        }
      }
      const tail = buffer.trim();
      if (tail) yield JSON.parse(tail) as T;
    } finally {
      reader.releaseLock();
    }
  }
}

/** Default singleton pointing at `http://127.0.0.1:11434`. */
export const ollama = new OllamaClient();
