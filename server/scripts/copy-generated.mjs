import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, "..");
const from = path.join(serverDir, "src", "generated");
const to = path.join(serverDir, "dist", "generated");

if (existsSync(from)) {
  cpSync(from, to, { recursive: true });
  console.log("[build] Prisma client generado copiado a dist/generated");
} else {
  console.error("[build] No se encontró src/generated; ejecutá prisma generate");
  process.exit(1);
}
