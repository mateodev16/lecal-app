import { z } from "zod";

export const SERVICIO_SELECT = z.enum([
  "Plantación y silvicultura",
  "Poda y raleo",
  "Cosecha forestal",
  "Transporte y logística",
  "Caminería y obra civil rural",
  "Control de malezas y sanidad",
  "Prevención y combate de incendios",
  "Vivero y plantines",
  "Manejo integral de plantación",
]);
export type ServicioSelect = z.infer<typeof SERVICIO_SELECT>;

export const CONTACT_STATUS = z.enum([
  "nuevo",
  "en_seguimiento",
  "respondido",
  "cerrado",
]);
export type ContactStatus = z.infer<typeof CONTACT_STATUS>;

export const contactSchema = z.object({
  nombre: z
    .string({ error: "Ingresá tu nombre." })
    .trim()
    .min(2, "Ingresá tu nombre.")
    .max(120, "El nombre es demasiado largo."),
  empresa: z
    .string()
    .trim()
    .max(120, "El nombre de la empresa es demasiado largo.")
    .optional()
    .or(z.literal("")),
  email: z
    .string({ error: "Ingresá un correo válido, por ejemplo nombre@correo.com." })
    .trim()
    .toLowerCase()
    .min(1, "Ingresá un correo válido, por ejemplo nombre@correo.com.")
    .max(200, "El correo es demasiado largo.")
    .email("Ingresá un correo válido, por ejemplo nombre@correo.com."),
  telefono: z
    .string({ error: "Ingresá un teléfono de contacto." })
    .trim()
    .min(6, "Ingresá un teléfono de contacto.")
    .max(30, "El teléfono es demasiado largo.")
    .regex(/^[+0-9()\- .]{6,30}$/, "Ingresá un teléfono de contacto."),
  servicio: SERVICIO_SELECT,
  mensaje: z
    .string({ error: "Contanos brevemente qué necesitás." })
    .trim()
    .min(10, "Contanos brevemente qué necesitás.")
    .max(2000, "El mensaje es demasiado largo."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactOutput = ContactInput & { id: string };

export const contactStatusSchema = z.object({
  status: CONTACT_STATUS,
});
export type ContactStatusInput = z.infer<typeof contactStatusSchema>;