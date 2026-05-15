import { promises as fs } from "node:fs";
import path from "node:path";
import type { UserProfile } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "profiles.json");

type ProfileMap = Record<string, UserProfile>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readAll(): Promise<ProfileMap> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as ProfileMap;
    }
    return {};
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: string }).code === "ENOENT"
    ) {
      return {};
    }
    throw err;
  }
}

async function writeAll(map: ProfileMap): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmpFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(map, null, 2), "utf8");
  await fs.rename(tmpFile, DATA_FILE);
}

export async function getProfileByEmail(
  email: string,
): Promise<UserProfile | null> {
  const key = normalizeEmail(email);
  if (!key) return null;
  const all = await readAll();
  return all[key] ?? null;
}

export async function saveProfile(profile: UserProfile): Promise<UserProfile> {
  const key = normalizeEmail(profile.email);
  if (!key) {
    throw new Error("Cannot save profile without an email");
  }
  const all = await readAll();
  const next: UserProfile = { ...profile, email: key };
  all[key] = next;
  await writeAll(all);
  return next;
}
