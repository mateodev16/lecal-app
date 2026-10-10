import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Ingresá tu correo." })
    .trim()
    .toLowerCase()
    .min(1, "Ingresá tu correo.")
    .max(200, "Correo muy largo.")
    .email("Ingresá un correo válido."),
  password: z
    .string({ error: "Ingresá tu contraseña." })
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(128, "La contraseña es demasiado larga."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Ingresá tu contraseña actual.").max(128),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres.")
    .max(128, "La contraseña es demasiado larga."),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const publicUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
});
export type PublicUser = z.infer<typeof publicUserSchema>;