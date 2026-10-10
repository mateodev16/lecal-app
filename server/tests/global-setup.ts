import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, "..");
const dbPath = path.join(serverDir, "prisma", "test.db");
const dbFiles = [
  dbPath,
  `${dbPath}-journal`,
  `${dbPath}-wal`,
  `${dbPath}-shm`,
];

function removeDbFiles() {
  for (const file of dbFiles) {
    for (let attempt = 0; file && existsSync(file) && attempt < 5; attempt++) {
      try {
        rmSync(file, { force: true });
      } catch {
        // Windows puede retener el handle de SQLite; se reintenta.
      }
    }
  }
}

export default function setup() {
  removeDbFiles();

  process.env.DATABASE_URL = "file:./test.db";
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-at-least-sixteen-chars";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.CLIENT_ORIGIN = "http://localhost:5173";

  execSync("npx prisma migrate deploy", {
    cwd: serverDir,
    env: process.env,
    stdio: "pipe",
  });

  return () => {
    removeDbFiles();
  };
}