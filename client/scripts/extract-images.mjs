import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../public/img");

const mockupArg = process.argv[2];
const mockupPath = mockupArg
  ? resolve(mockupArg)
  : "C:\\Users\\Mateo\\Documents\\Default Project\\who-said-this\\mockup\\lecal.html";

const names = ["logo", "hero", "about", "logo", "sustain", "cta", "news-1", "news-2", "news-3"];

const html = readFileSync(mockupPath, "utf8");
const re = /src="data:image\/jpeg;base64,([^"]+)"/g;

mkdirSync(outDir, { recursive: true });

let i = 0;
const seen = new Set();
const written = [];

for (const match of html.matchAll(re)) {
  const b64 = match[1];
  if (seen.has(b64)) {
    i += 1;
    continue;
  }
  seen.add(b64);
  const name = names[i] ?? `img-${i}`;
  const file = `${name}.jpg`;
  writeFileSync(resolve(outDir, file), Buffer.from(b64, "base64"));
  written.push(file);
  i += 1;
}

console.log(`Imágenes extraídas (${written.length}) en ${outDir}:`);
for (const f of written) console.log(`  - ${f}`);