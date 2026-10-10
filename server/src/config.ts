import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const envPath = path.resolve(process.cwd(), ".env");
if (existsSync(envPath)) process.loadEnvFile(envPath);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16, "JWT_SECRET debe tener al menos 16 caracteres."),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[config] Variables de entorno inválidas:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";