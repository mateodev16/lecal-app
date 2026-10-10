import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactSchema, contactStatusSchema, idParamSchema } from "@lecal/shared";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Recibimos demasiadas consultas desde esta dirección. Probá de nuevo más tarde." },
});

const router = Router();

function clientIp(req: { ip?: string; headers?: Record<string, string | string[] | undefined> }): string | null {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) return forwarded.split(",")[0].trim();
  return req.ip ?? null;
}

router.post("/", submitLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const submission = await prisma.contactSubmission.create({
      data: {
        nombre: data.nombre,
        empresa: data.empresa || null,
        email: data.email,
        telefono: data.telefono,
        servicio: data.servicio,
        mensaje: data.mensaje,
        ip: clientIp(req),
      },
    });
    res.status(201).json({ id: submission.id });
  } catch (err) {
    next(err);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const perPage = Math.min(100, Math.max(1, Number(req.query.perPage ?? 25) || 25));

    const where = status && /^(nuevo|en_seguimiento|respondido|cerrado)$/.test(status) ? { status } : {};

    const [items, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    res.json({ items, total, page, perPage });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", requireAuth, validate(idParamSchema, "params"), validate(contactStatusSchema), async (req, res, next) => {
  try {
    const updated = await prisma.contactSubmission.update({
      where: { id: String(req.params.id) },
      data: { status: req.body.status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, validate(idParamSchema, "params"), async (req, res, next) => {
  try {
    await prisma.contactSubmission.delete({ where: { id: String(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;