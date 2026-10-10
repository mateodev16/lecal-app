import { Router } from "express";
import rateLimit from "express-rate-limit";
import { changePasswordSchema, loginSchema } from "@lecal/shared";
import { isProd } from "../config.js";
import { AUTH_COOKIE, signAuthToken } from "../lib/jwt.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/errors.js";
import { validate } from "../middleware/validate.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de login. Probá de nuevo en 15 minutos." },
});

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/login", loginLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new HttpError(401, "Correo o contraseña incorrectos.");
    }

    const token = signAuthToken({ sub: user.id, email: user.email });
    res.cookie(AUTH_COOKIE, token, cookieOptions);
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions, maxAge: undefined });
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

router.post(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) throw new HttpError(404, "Usuario inexistente.");

      const { currentPassword, newPassword } = req.body;
      if (!(await verifyPassword(currentPassword, user.passwordHash))) {
        throw new HttpError(401, "La contraseña actual es incorrecta.");
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await hashPassword(newPassword) },
      });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
);

export default router;