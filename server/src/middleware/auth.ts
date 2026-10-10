import type { RequestHandler } from "express";
import { AUTH_COOKIE, verifyAuthToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "./errors.js";

/** Requiere una sesión válida (cookie httpOnly). Adhiere req.user. */
export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE] as string | undefined;
    if (!token) throw new HttpError(401, "No autenticado.");

    const payload = verifyAuthToken(token);
    if (!payload) throw new HttpError(401, "Sesión inválida o expirada.");

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new HttpError(401, "Usuario inexistente.");

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (err) {
    next(err);
  }
};