import { z } from "zod";

export const SERVICE_ICON = z.enum([
  "sprout",
  "scissor",
  "axe",
  "truck",
  "road",
  "droplet",
  "fire",
  "plant",
]);
export type ServiceIcon = z.infer<typeof SERVICE_ICON>;

export const serviceSchema = z.object({
  title: z.string().trim().min(3, "El título es muy corto.").max(120, "Título demasiado largo."),
  description: z
    .string()
    .trim()
    .min(10, "La descripción es muy corta.")
    .max(600, "Descripción demasiado larga."),
  icon: SERVICE_ICON,
  order: z.number().int().min(0).max(999),
  active: z.boolean(),
});
export type ServiceDraft = z.infer<typeof serviceSchema>;

export const servicePatchSchema = serviceSchema.partial();

export const newsSchema = z.object({
  title: z.string().trim().min(3, "El título es muy corto.").max(160, "Título demasiado largo."),
  date: z.coerce.date().refine((d) => d.getTime() <= Date.now() + 86_400_000, {
    message: "La fecha no puede ser futura.",
  }),
  excerpt: z.string().trim().min(10, "El resumen es muy corto.").max(500, "Resumen demasiado largo."),
  imageUrl: z
    .string()
    .trim()
    .max(500, "URL demasiado larga.")
    .refine((v) => v === "" || /^https?:\/\/.*\.(png|jpe?g|webp|svg)$/i.test(v), {
      message: "Ingresá una URL de imagen válida (http) o déjala vacía.",
    })
    .optional()
    .or(z.literal("")),
  order: z.number().int().min(0).max(999),
  active: z.boolean(),
});
export type NewsDraft = z.infer<typeof newsSchema>;

export const newsPatchSchema = newsSchema.partial();

export const faqSchema = z.object({
  question: z.string().trim().min(5, "Escribí la pregunta completa.").max(240, "Pregunta demasiado larga."),
  answer: z.string().trim().min(10, "La respuesta es muy corta.").max(1200, "Respuesta demasiado larga."),
  order: z.number().int().min(0).max(999),
  active: z.boolean(),
});
export type FaqDraft = z.infer<typeof faqSchema>;

export const faqPatchSchema = faqSchema.partial();

export const SETTING_KEYS = [
  "heroEyebrow",
  "heroTitle",
  "heroLead",
  "statYears",
  "statYearsLabel",
  "statHa",
  "statHaLabel",
  "statJobs",
  "statJobsLabel",
  "statDepts",
  "statDeptsLabel",
  "contactAddress",
  "contactPhone",
  "contactEmail",
  "contactHours",
  "footerBlurb",
] as const;

export const settingKeySchema = z.enum(SETTING_KEYS);
export type SettingKey = z.infer<typeof settingKeySchema>;

export const settingsMapSchema = z.record(
  settingKeySchema,
  z.string().trim().max(1000, "Valor demasiado largo.").optional(),
);
export type SettingsMap = z.infer<typeof settingsMapSchema>;

export const settingsPatchSchema = z.record(
  settingKeySchema,
  z.string().trim().max(1000, "Valor demasiado largo."),
);
export type SettingsPatch = z.infer<typeof settingsPatchSchema>;

export const DEFAULT_SETTINGS: Record<SettingKey, string> = {
  heroEyebrow: "Servicios forestales integrales",
  heroTitle: "Trabajo de campo serio para el sector forestal del sudeste",
  heroLead:
    "De la plantación a la entrega en planta. LECAL SRL es una empresa de servicios forestales radicada en Minas, Lavalleja, con cuadrillas propias, equipamiento propio y foco permanente en seguridad y calidad.",
  statYears: "15",
  statYearsLabel: "de experiencia en el rubro",
  statHa: "4000",
  statHaLabel: "trabajadas por año",
  statJobs: "120",
  statJobsLabel: "puestos de trabajo directos",
  statDepts: "5",
  statDeptsLabel: "de operación en el sudeste",
  contactAddress: "Ruta 8 km 118, Minas, Lavalleja, Uruguay",
  contactPhone: "+598 4442 0000",
  contactEmail: "info@lecal.com.uy",
  contactHours: "Lunes a viernes, 8:00 a 18:00",
  footerBlurb:
    "Empresa uruguaya de servicios forestales con base en Minas, Lavalleja. Plantación, silvicultura, cosecha, transporte y caminería para el sector forestal del sudeste.",
};

export const publicSiteSchema = z.object({
  settings: settingsMapSchema,
  services: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        icon: SERVICE_ICON,
        order: z.number(),
      }),
    )
    .optional(),
  news: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        date: z.coerce.date(),
        excerpt: z.string(),
        imageUrl: z.string().nullable().optional(),
      }),
    )
    .optional(),
  faqs: z
    .array(
      z.object({
        id: z.string(),
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
});
export type PublicSite = z.infer<typeof publicSiteSchema>;

export const idParamSchema = z.object({
  id: z.string().min(1, "Id inválido."),
});
export type IdParam = z.infer<typeof idParamSchema>;