import { Router } from "express";
import { DEFAULT_SETTINGS, type SettingKey } from "@lecal/shared";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/public/site", async (_req, res, next) => {
  try {
    const [settingsRows, services, news, faqs] = await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.newsPost.findMany({
        where: { active: true },
        orderBy: [{ date: "desc" }, { order: "asc" }],
        take: 6,
      }),
      prisma.faqItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    ]);

    const settings = { ...DEFAULT_SETTINGS } as Record<string, string>;
    for (const row of settingsRows) settings[row.key] = row.value;

    res.json({
      settings,
      services: services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        order: s.order,
      })),
      news: news.map((n) => ({
        id: n.id,
        title: n.title,
        date: n.date.toISOString(),
        excerpt: n.excerpt,
        imageUrl: n.imageUrl,
      })),
      faqs: faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;