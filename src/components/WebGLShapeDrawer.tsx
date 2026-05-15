"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type Vec2 = { x: number; y: number };

export type WebGLShapeDrawerHandle = {
  clear: () => void;
  hasDrawing: () => boolean;
};

export type WebGLShapeDrawerProps = {
  className?: string;
  strokeWidthPx?: number;
  /** Fired when strokes change (after pointer up or clear). */
  onDrawingChange?: (detail: { strokeCount: number; pointCount: number }) => void;
};

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/** Pixel-space polyline → triangle vertices in clip space (x,y pairs). */
function extrudeLineToClipTriangles(
  points: Vec2[],
  widthPx: number,
  width: number,
  height: number,
): Float32Array {
  const half = widthPx * 0.5;
  const out: number[] = [];
  const toClip = (x: number, y: number) => {
    const cx = (x / width) * 2 - 1;
    const cy = 1 - (y / height) * 2;
    return [cx, cy] as const;
  };
  for (let i = 0; i < points.length - 1; i++) {
    const p = points[i];
    const q = points[i + 1];
    let dx = q.x - p.x;
    let dy = q.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const nx = -dy * half;
    const ny = dx * half;

    const p0 = toClip(p.x + nx, p.y + ny);
    const p1 = toClip(p.x - nx, p.y - ny);
    const p2 = toClip(q.x + nx, q.y + ny);
    const p3 = toClip(q.x - nx, q.y - ny);

    out.push(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]);
    out.push(p1[0], p1[1], p3[0], p3[1], p2[0], p2[1]);
  }
  return new Float32Array(out);
}

const VS = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec4 u_color;
void main() {
  fragColor = u_color;
}`;

const WebGLShapeDrawer = forwardRef<WebGLShapeDrawerHandle, WebGLShapeDrawerProps>(
  function WebGLShapeDrawer(
    { className, strokeWidthPx = 4, onDrawingChange }: WebGLShapeDrawerProps,
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const strokesRef = useRef<Vec2[][]>([]);
    const currentStrokeRef = useRef<Vec2[] | null>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const bufferRef = useRef<WebGLBuffer | null>(null);
    const attrsRef = useRef<{ a_position: number } | null>(null);
    const uniformColorRef = useRef<WebGLUniformLocation | null>(null);

    const notifyChange = useCallback(
      (strokes: Vec2[][]) => {
        const strokeCount = strokes.length;
        const pointCount = strokes.reduce((n, s) => n + s.length, 0);
        onDrawingChange?.({ strokeCount, pointCount });
      },
      [onDrawingChange],
    );

    const redraw = useCallback(() => {
      const gl = glRef.current;
      const program = programRef.current;
      const buffer = bufferRef.current;
      const loc = attrsRef.current;
      const uColor = uniformColorRef.current;
      const canvas = canvasRef.current;
      if (!gl || !program || !buffer || !loc || uColor === null || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0.07, 0.09, 0.15, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const committed = strokesRef.current;
      const live = currentStrokeRef.current;
      const toDraw =
        live && live.length >= 2 ? [...committed, live] : committed;
      if (toDraw.length === 0) return;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      const color = new Float32Array([0.72, 0.45, 1, 1]);
      gl.uniform4fv(uColor, color);

      for (const pts of toDraw) {
        if (pts.length < 2) continue;
        const verts = extrudeLineToClipTriangles(pts, strokeWidthPx, w, h);
        if (verts.length === 0) continue;
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STREAM_DRAW);
        gl.enableVertexAttribArray(loc.a_position);
        gl.vertexAttribPointer(loc.a_position, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
      }
    }, [strokeWidthPx]);

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          strokesRef.current = [];
          currentStrokeRef.current = null;
          notifyChange(strokesRef.current);
          redraw();
        },
        hasDrawing: () =>
          strokesRef.current.some((s) => s.length >= 2) ||
          (currentStrokeRef.current?.length ?? 0) >= 2,
      }),
      [notifyChange, redraw],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext("webgl2", {
        antialias: true,
        alpha: false,
      });
      if (!gl) return;
      glRef.current = gl;

      const program = linkProgram(gl, VS, FS);
      if (!program) return;
      programRef.current = program;
      const a_position = gl.getAttribLocation(program, "a_position");
      attrsRef.current = { a_position };
      uniformColorRef.current = gl.getUniformLocation(program, "u_color");

      const buffer = gl.createBuffer();
      if (!buffer) return;
      bufferRef.current = buffer;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
        const nextW = Math.max(1, Math.floor(rect.width * dpr));
        const nextH = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== nextW || canvas.height !== nextH) {
          canvas.width = nextW;
          canvas.height = nextH;
        }
        redraw();
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      return () => {
        ro.disconnect();
        if (bufferRef.current) gl.deleteBuffer(bufferRef.current);
        if (programRef.current) gl.deleteProgram(programRef.current);
        glRef.current = null;
        programRef.current = null;
        bufferRef.current = null;
        attrsRef.current = null;
        uniformColorRef.current = null;
      };
    }, [redraw]);

    const clientToCanvas = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
      return { x, y };
    }, []);

    const pushPoint = useCallback(
      (pt: Vec2) => {
        const cur = currentStrokeRef.current;
        if (!cur) return;
        const last = cur[cur.length - 1];
        const minDist = 2;
        if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < minDist) return;
        cur.push(pt);
        redraw();
      },
      [redraw],
    );

    const onPointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const pt = clientToCanvas(e);
        if (!pt) return;
        currentStrokeRef.current = [pt];
        redraw();
      },
      [clientToCanvas, redraw],
    );

    const onPointerMove = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!currentStrokeRef.current) return;
        if ((e.buttons & 1) === 0) return;
        const pt = clientToCanvas(e);
        if (pt) pushPoint(pt);
      },
      [clientToCanvas, pushPoint],
    );

    const finalizeStroke = useCallback(() => {
      const cur = currentStrokeRef.current;
      currentStrokeRef.current = null;
      if (!cur || cur.length < 2) {
        redraw();
        return;
      }
      strokesRef.current = [...strokesRef.current, cur];
      notifyChange(strokesRef.current);
      redraw();
    }, [notifyChange, redraw]);

    const onPointerUp = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        finalizeStroke();
      },
      [finalizeStroke],
    );

    const onPointerLeave = useCallback(() => {
      if (currentStrokeRef.current) finalizeStroke();
    }, [finalizeStroke]);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
        role="img"
        aria-label="Draw your shape with the pointer"
        style={{ touchAction: "none" }}
      />
    );
  },
);

WebGLShapeDrawer.displayName = "WebGLShapeDrawer";

export default WebGLShapeDrawer;
