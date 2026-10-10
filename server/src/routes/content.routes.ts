import { Router } from "express";
import {
  faqPatchSchema,
  faqSchema,
  idParamSchema,
  newsPatchSchema,
  newsSchema,
  servicePatchSchema,
  serviceSchema,
  settingsPatchSchema,
} from "@lecal/shared";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/errors.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// ---- Services ----
router.get("/services", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.service.findMany({ orderBy: { order: "asc" }, where: {} });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/services", requireAuth, validate(serviceSchema), async (req, res, next) => {
  try {
    const item = await prisma.service.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/services/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  validate(servicePatchSchema),
  async (req, res, next) => {
    try {
      const item = await prisma.service.update({ where: { id: String(req.params.id) }, data: req.body });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/services/:id", requireAuth, validate(idParamSchema, "params"), async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: String(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ---- News ----
router.get("/news", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.newsPost.findMany({ orderBy: [{ date: "desc" }, { order: "asc" }] });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/news", requireAuth, validate(newsSchema), async (req, res, next) => {
  try {
    const item = await prisma.newsPost.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/news/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  validate(newsPatchSchema),
  async (req, res, next) => {
    try {
      const item = await prisma.newsPost.update({ where: { id: String(req.params.id) }, data: req.body });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/news/:id", requireAuth, validate(idParamSchema, "params"), async (req, res, next) => {
  try {
    await prisma.newsPost.delete({ where: { id: String(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ---- FAQ ----
router.get("/faq", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/faq", requireAuth, validate(faqSchema), async (req, res, next) => {
  try {
    const item = await prisma.faqItem.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/faq/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  validate(faqPatchSchema),
  async (req, res, next) => {
    try {
      const item = await prisma.faqItem.update({ where: { id: String(req.params.id) }, data: req.body });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/faq/:id", requireAuth, validate(idParamSchema, "params"), async (req, res, next) => {
  try {
    await prisma.faqItem.delete({ where: { id: String(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ---- Settings ----
router.get("/settings", requireAuth, async (_req, res, next) => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    res.json(map);
  } catch (err) {
    next(err);
  }
});

router.patch("/settings", requireAuth, validate(settingsPatchSchema), async (req, res, next) => {
  try {
    const entries = Object.entries(req.body as Record<string, string>);
    if (entries.length === 0) throw new HttpError(400, "Sin datos para actualizar.");
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
