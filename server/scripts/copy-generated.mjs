import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(here, "..", "src", "generated");
const distRoot = path.resolve(here, "..", "dist", "generated");

const assetExtensions = new Set([".node", ".wasm", ".so", ".dll", ".dylib"]);

function copyAssets(src, dest) {
  if (!existsSync(src)) return 0;
  mkdirSync(dest, { recursive: true });
  let copied = 0;
  for (const entry of readdirSync(src)) {
    const from = path.join(src, entry);
    const to = path.join(dest, entry);
    const stat = statSync(from);
    if (stat.isDirectory()) {
      copied += copyAssets(from, to);
    } else if (assetExtensions.has(path.extname(entry))) {
      cpSync(from, to);
      copied += 1;
    }
  }
  return copied;
}

if (!existsSync(srcRoot)) {
  console.error("No se encontró src/generated. Corré `prisma generate` primero.");
  process.exit(1);
}

const count = copyAssets(srcRoot, distRoot);
console.log(`Prisma: ${count} archivo(s) binario(s) copiado(s) a dist/generated.`);
