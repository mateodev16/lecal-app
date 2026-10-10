import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { env, isProd } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import contentRoutes from "./routes/content.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
              fontSrc: ["'self'", "data:"],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
              frameAncestors: ["'none'"],
            },
          }
        : false,
    }),
  );

  app.use(
    cors({
      origin: isProd ? false : env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", publicRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api", contentRoutes);

  app.use("/api", notFound);

  if (isProd) {
    const clientDist = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(clientDist, { index: false }));
    app.get("*splat", (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}