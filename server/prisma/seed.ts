import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_SETTINGS } from "@lecal/shared";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { hashPassword } from "../src/lib/password.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
try {
  const envPath = path.resolve(__dirname, "../.env");
  if (existsSync(envPath)) process.loadEnvFile(envPath);
} catch {
  /* sin .env: se usa el entorno del proceso */
}

const prisma = new PrismaClient();

const services = [
  {
    title: "Plantación y silvicultura",
    description:
      "Preparación de suelo, marcado, plantación y replante, con control de calidad en cada etapa y registros de supervivencia.",
    icon: "sprout",
  },
  {
    title: "Poda y raleo",
    description:
      "Manejo silvicultural para mejorar la calidad de la madera y el crecimiento: poda de formación, poda alta y raleos programados.",
    icon: "scissor",
  },
  {
    title: "Cosecha forestal",
    description:
      "Tala dirigida, procesado y extracción de rollizos con equipos y cuadrillas especializadas, cuidando la regeneración del sitio.",
    icon: "axe",
  },
  {
    title: "Transporte y logística",
    description:
      "Carga, transporte y coordinación de madera desde el monte hasta planta, aserradero o puerto, con seguimiento de cada viaje.",
    icon: "truck",
  },
  {
    title: "Caminería y obra civil rural",
    description:
      "Apertura y mantenimiento de caminos, alcantarillas, badenes y obras de drenaje para garantizar el acceso en toda la zafra.",
    icon: "road",
  },
  {
    title: "Control de malezas y sanidad",
    description:
      "Aplicación responsable de herbicidas, control de plagas y monitoreo fitosanitario, cumpliendo la normativa vigente.",
    icon: "droplet",
  },
  {
    title: "Prevención y combate de incendios",
    description:
      "Cuadrillas, equipamiento y planes de prevención y respuesta ante incendios forestales, en coordinación con el sistema nacional.",
    icon: "fire",
  },
  {
    title: "Vivero y producción de plantines",
    description:
      "Producción de plantines de eucalipto y pino con trazabilidad genética y entrega en el sitio de plantación.",
    icon: "plant",
  },
];

const news = [
  {
    title: "Sumamos una cuadrilla para la zafra de cosecha",
    date: new Date("2026-03-01T00:00:00.000Z"),
    excerpt:
      "Incorporamos personal y equipamiento para responder al aumento de superficie de cosecha en Lavalleja y Rocha.",
    imageUrl: "/img/about.jpg",
  },
  {
    title: "Capacitación en seguridad y primeros auxilios",
    date: new Date("2026-02-01T00:00:00.000Z"),
    excerpt:
      "Todo el personal de campo completó una nueva jornada de formación en prevención de riesgos y respuesta ante emergencias.",
    imageUrl: "/img/cta.jpg",
  },
  {
    title: "Reforestación junto a escuelas rurales",
    date: new Date("2025-12-01T00:00:00.000Z"),
    excerpt: "Acompañamos una jornada de plantación con estudiantes de escuelas rurales de la zona, compartiendo el valor del monte.",
    imageUrl: "/img/sustain.jpg",
  },
];

const faqs = [
  {
    question: "¿En qué zonas de Uruguay trabajan?",
    answer:
      "Nuestra base está en Minas, Lavalleja, y operamos en todo el sudeste: Lavalleja, Maldonado, Rocha, Cerro Largo y Treinta y Tres. Para proyectos puntuales evaluamos otras zonas del país.",
  },
  {
    question: "¿Puedo contratar un servicio aislado o solo el paquete completo?",
    answer:
      "Ambas cosas. Podés contratar una tarea concreta —una poda, una cosecha, un tramo de caminería— o delegar el manejo integral de la plantación, que incluye planificación, ejecución y reporte.",
  },
  {
    question: "¿Cómo garantizan la seguridad de los trabajadores?",
    answer:
      "Trabajamos con elementos de protección personal, capacitación continua, análisis de riesgo por tarea y planes de emergencia. La seguridad es una condición para operar, no un agregado.",
  },
  {
    question: "¿Cómo pido un presupuesto?",
    answer:
      "Completá el formulario de contacto con la ubicación y superficie aproximada del predio y el servicio que necesitás. Coordinamos una visita y te enviamos la propuesta.",
  },
];

async function main() {
  // Usuario admin de arranque
  const adminEmail = process.env.ADMIN_EMAIL || "admin@lecal.com.uy";
  const adminPassword = process.env.ADMIN_PASSWORD || "CambiaMe123!";
  const adminName = process.env.ADMIN_NAME || "Administrador";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: { email: adminEmail, name: adminName, passwordHash: await hashPassword(adminPassword), role: "admin" },
    });
    console.log(`[seed] Admin creado: ${adminEmail}`);
  } else {
    console.log(`[seed] Admin ya existía: ${adminEmail}`);
  }

  // Contenido inicial (solo si la tabla está vacía para no pisar ediciones)
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: services.map((s, i) => ({ ...s, order: i, active: true })),
    });
    console.log(`[seed] ${services.length} servicios creados.`);
  }

  const newsCount = await prisma.newsPost.count();
  if (newsCount === 0) {
    await prisma.newsPost.createMany({
      data: news.map((n, i) => ({ ...n, order: i, active: true })),
    });
    console.log(`[seed] ${news.length} novedades creadas.`);
  }

  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    await prisma.faqItem.createMany({
      data: faqs.map((f, i) => ({ ...f, order: i, active: true })),
    });
    console.log(`[seed] ${faqs.length} FAQs creadas.`);
  }

  // Settings por defecto (rellena las que falten, no pisa lo editado)
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log(`[seed] Settings por defecto aseguradas (${Object.keys(DEFAULT_SETTINGS).length}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });