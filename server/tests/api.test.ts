import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";

const app = createApp();

const testUser = {
  email: "test@lecal.com.uy",
  password: "TestPass123!",
  name: "Test Admin",
};

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email: testUser.email },
    update: {},
    create: {
      email: testUser.email,
      name: testUser.name,
      passwordHash: await hashPassword(testUser.password),
      role: "admin",
    },
  });
});

describe("GET /api/health", () => {
  it("responde ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

describe("GET /api/public/site", () => {
  it("devuelve settings, servicios, novedades y FAQs", async () => {
    const res = await request(app).get("/api/public/site");
    expect(res.status).toBe(200);
    expect(res.body.settings.heroTitle).toBeTruthy();
    expect(res.body.contactPhone).toBeUndefined(); // no fuga de settings fuera del mapa
    expect(Array.isArray(res.body.services)).toBe(true);
    expect(Array.isArray(res.body.news)).toBe(true);
    expect(Array.isArray(res.body.faqs)).toBe(true);
    for (const service of res.body.services) {
      expect(service.active).toBeUndefined();
      expect(service.title).toBeTruthy();
    }
  });
});

describe("POST /api/contact", () => {
  const validPayload = {
    nombre: "María García",
    empresa: "Campo San Juan",
    email: "maria@mail.com",
    telefono: "+598 99 000 000",
    servicio: "Cosecha forestal",
    mensaje: "Necesito un presupuesto para 40 hectáreas en Minas.",
  };

  it("rechaza payload inválido con 400 y lista de errores", async () => {
    const res = await request(app).post("/api/contact").send({
      nombre: "",
      email: "no-es-email",
      telefono: "12",
      servicio: "Hackeame",
      mensaje: "corto",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
    expect(res.body.details.issues.length).toBeGreaterThanOrEqual(1);
    const fields = res.body.details.issues.map((i: { field: string }) => i.field);
    expect(fields).toContain("email");
    expect(fields).toContain("servicio");
  });

  it("acepta un envío válido y guarda la cotización", async () => {
    const res = await request(app).post("/api/contact").send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();

    const stored = await prisma.contactSubmission.findUnique({ where: { id: res.body.id } });
    expect(stored).not.toBeNull();
    expect(stored?.email).toBe("maria@mail.com");
    expect(stored?.status).toBe("nuevo");
  });

  it("la ruta de listado exige autenticación", async () => {
    const res = await request(app).get("/api/contact");
    expect(res.status).toBe(401);
  });
});

describe("flujo de autenticación admin", () => {
  it("login, me, listado, actualiza estado y elimina cotización", async () => {
    const agent = request.agent(app);

    const login = await agent.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(login.status).toBe(200);
    expect(login.headers["set-cookie"]).toBeDefined();
    expect(login.body.email).toBe(testUser.email);

    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body).toMatchObject({ email: testUser.email, name: testUser.name });

    const list = await agent.get("/api/contact");
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBeGreaterThanOrEqual(1);
    const quoteId = list.body.items[0].id;

    const updated = await agent.patch(`/api/contact/${quoteId}`).send({ status: "en_seguimiento" });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("en_seguimiento");

    const deleted = await agent.delete(`/api/contact/${quoteId}`);
    expect(deleted.status).toBe(204);
  });

  it("rechaza login incorrecto", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "contraseña-mal",
    });
    expect(res.status).toBe(401);
  });

  it("el listado de una ruta protegida falla sin cookie", async () => {
    const res = await request(app).get("/api/contact");
    expect(res.status).toBe(401);
  });
});