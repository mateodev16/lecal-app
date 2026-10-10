import { IconShieldCheck, IconSprout, IconTree, IconUsers } from "../../../lib/icons";
import type { ReactNode } from "react";
import { Reveal } from "../../../components/Reveal";

const pillars: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <IconShieldCheck />,
    title: "Gestión forestal responsable",
    text: "Buenas prácticas silviculturales alineadas a estándares de certificación forestal, con foco en la conservación del suelo y el agua.",
  },
  {
    icon: <IconTree />,
    title: "Seguridad y salud ocupacional",
    text: "Elementos de protección personal, capacitación continua y planes de emergencia para cada tipo de tarea.",
  },
  {
    icon: <IconSprout />,
    title: "Cuidado del ambiente",
    text: "Uso responsable de agroquímicos, protección de cursos de agua, áreas de conservación y manejo de residuos.",
  },
  {
    icon: <IconUsers />,
    title: "Vínculo con las comunidades",
    text: "Trabajo local, compras a proveedores de la zona y acompañamiento a iniciativas de las localidades donde operamos.",
  },
];

export function Sustainability() {
  return (
    <section className="section section--dark" id="sostenibilidad" aria-labelledby="sost-title">
      <div className="site-container">
        <div className="sustain-grid">
          <div>
            <Reveal>
              <span className="eyebrow">Sostenibilidad</span>
              <h2 id="sost-title">Producir cuidando el monte y la gente</h2>
            </Reveal>
            <Reveal delay={70} style={{ marginTop: 16 }}>
              <p className="lead">
                Entendemos la actividad forestal como una actividad de largo plazo. Por eso trabajamos
                con criterios de manejo responsable y ponemos a las personas y el ambiente en el
                centro de cada operación.
              </p>
            </Reveal>
            <div className="pillar-list">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} className="pillar" delay={(i % 4) * 70}>
                  <div className="pillar__icon" aria-hidden="true">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={70}>
            <div className="sustain-media">
              <img
                src="/img/sustain.jpg"
                alt="Vista aérea de una plantación de eucalipto con bosque nativo cercano"
                width={1024}
                height={768}
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}