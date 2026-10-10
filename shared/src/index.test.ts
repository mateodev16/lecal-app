import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  contactSchema,
  contactStatusSchema,
  faqSchema,
  loginSchema,
  newsSchema,
  serviceSchema,
  settingsMapSchema,
} from "./index.js";

describe("contactSchema", () => {
  it("acepta un envío válido y normaliza el email", () => {
    const res = contactSchema.safeParse({
      nombre: "  María García ",
      empresa: "Campo San Juan",
      email: "  MARIA@GMAIL.COM ",
      telefono: "+598 99 000 000",
      servicio: "Cosecha forestal",
      mensaje: "Necesito presupuesto para 40 hectáreas en Minas.",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.nombre).toBe("María García");
      expect(res.data.email).toBe("maria@gmail.com");
    }
  });

  it("rechaza email inválido", () => {
    const res = contactSchema.safeParse({
      nombre: "María",
      email: "no-es-un-email",
      telefono: "+598999999",
      servicio: "Poda y raleo",
      mensaje: "Quiero una cotización de poda.",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const field = res.error.issues.find((i) => i.path[0] === "email");
      expect(field).toBeDefined();
    }
  });

  it("rechaza teléfono muy corto", () => {
    const res = contactSchema.safeParse({
      nombre: "María",
      email: "maria@mail.com",
      telefono: "12",
      servicio: "Poda y raleo",
      mensaje: "Quiero una cotización de poda.",
    });
    expect(res.success).toBe(false);
  });

  it("rechaza servicio fuera de la lista", () => {
    const res = contactSchema.safeParse({
      nombre: "María",
      email: "maria@mail.com",
      telefono: "+598999999",
      servicio: "Cortar todo",
      mensaje: "Quiero una cotización de poda.",
    });
    expect(res.success).toBe(false);
  });

  it("rechaza mensaje muy corto y campos vacíos", () => {
    const res = contactSchema.safeParse({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "hola",
    });
    expect(res.success).toBe(false);
  });
});

describe("contactStatusSchema", () => {
  it("acepta estados válidos", () => {
    expect(contactStatusSchema.safeParse({ status: "en_seguimiento" }).success).toBe(true);
    expect(contactStatusSchema.safeParse({ status: "cerrado" }).success).toBe(true);
  });
  it("rechaza estados inválidos", () => {
    expect(contactStatusSchema.safeParse({ status: "borrado" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    expect(loginSchema.safeParse({ email: "admin@lecal.com.uy", password: "Secret123!" }).success).toBe(true);
  });
  it("rechaza password corta", () => {
    expect(loginSchema.safeParse({ email: "admin@lecal.com.uy", password: "corta" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("valida contraseñas", () => {
    expect(
      changePasswordSchema.safeParse({ currentPassword: "Secret123!", newPassword: "Nueva123!" }).success,
    ).toBe(true);
    expect(
      changePasswordSchema.safeParse({ currentPassword: "Secret123!", newPassword: "corta" }).success,
    ).toBe(false);
  });
});

describe("content schemas", () => {
  it("serviceSchema valida y rechaza iconos desconocidos", () => {
    const base = { title: "Poda y raleo", description: "Manejo silvicultural para mejorar crecimiento.", order: 1, active: true };
    expect(serviceSchema.safeParse({ ...base, icon: "scissor" }).success).toBe(true);
    expect(serviceSchema.safeParse({ ...base, icon: "wizard" }).success).toBe(false);
  });

  it("newsSchema rechaza fechas futuras y URLs inválidas", () => {
    const base = {
      title: "Nueva cuadrilla",
      excerpt: "Incorporamos personal para la zafra de cosecha en la región sudeste.",
      date: "2026-03-01T00:00:00.000Z",
      order: 0,
      active: true,
    };
    expect(newsSchema.safeParse({ ...base, imageUrl: "" }).success).toBe(true);
    expect(newsSchema.safeParse({ ...base, imageUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(
      newsSchema
        .safeParse({ ...base, date: "2099-01-01T00:00:00.000Z" })
    ).toMatchObject({ success: false });
  });

  it("faqSchema valida pregunta y respuesta", () => {
    expect(
      faqSchema.safeParse({ question: "¿En qué zonas trabajan?", answer: "Trabajamos en todo el sudeste del país.", order: 0, active: true })
        .success,
    ).toBe(true);
  });

  it("settingsMapSchema solo acepta claves conocidas", () => {
    const ok = settingsMapSchema.safeParse({ heroTitle: "Título", statHa: "4000" });
    expect(ok.success).toBe(true);
    const bad = settingsMapSchema.safeParse({ heroTitle: "Título", claveHackeada: "x" });
    expect(bad.success).toBe(false);
  });
});