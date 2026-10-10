import type { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { HttpError } from "./errors.js";

type Target = "body" | "query" | "params";

export function validate<T>(schema: ZodSchema<T>, target: Target = "body"): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const issues = result.error.issues.map((i) => ({
        field: i.path.join(".") || target,
        message: i.message,
      }));
      next(new HttpError(400, `Validación fallida en ${target}.`, { issues }));
      return;
    }
    req[target] = result.data;
    next();
  };
}