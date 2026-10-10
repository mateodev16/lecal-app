import { IconCheckCircle, IconClock } from "../../../lib/icons";
import { Reveal } from "../../../components/Reveal";

export function About() {
  return (
    <section className="section section--paper" id="nosotros" aria-labelledby="nosotros-title">
      <div className="site-container">
        <div className="two-col">
          <div>
            <Reveal>
              <span className="eyebrow">Quiénes somos</span>
              <h2 id="nosotros-title">Una empresa forestal con base en el territorio</h2>
            </Reveal>
            <Reveal delay={70} style={{ marginTop: 18 }}>
              <p className="lead">
                LECAL SRL nació en Minas, Lavalleja, y creció junto al desarrollo forestal de la
                región. Somos un equipo de personas del lugar que conoce el monte, el clima y el
                ritmo de la zafra. Brindamos servicios para propietarios de plantaciones y empresas
                del sector en todo el sudeste del país.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <ul className="checklist">
                <li>
                  <IconCheckCircle />
                  <span>
                    <b>Cuadrillas propias y capacitadas.</b> Equipos estables, con formación
                    continua en seguridad, primeros auxilios y uso responsable de agroquímicos.
                  </span>
                </li>
                <li>
                  <IconCheckCircle />
                  <span>
                    <b>Cobertura regional.</b> Operamos en Lavalleja, Maldonado, Rocha, Cerro Largo
                    y Treinta y Tres, coordinando logística desde nuestra base en Minas.
                  </span>
                </li>
                <li>
                  <IconCheckCircle />
                  <span>
                    <b>Trazabilidad y reporte.</b> Registramos avance, rendimiento y novedades de
                    cada contrato para que el cliente sepa en qué estado está su monte.
                  </span>
                </li>
              </ul>
            </Reveal>
            <Reveal delay={210} style={{ marginTop: 30 }}>
              <a className="btn btn--primary" href="#contacto">
                Conocé cómo trabajamos
              </a>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="media-frame media-frame--crop">
              <img
                src="/img/about.jpg"
                alt="Maquinaria y cuadrilla realizando tareas de cosecha forestal en un rodal"
                width={1024}
                height={683}
                loading="lazy"
              />
              <div className="media-badge">
                <IconClock />
                <span>
                  <b>Operación de cosecha</b>
                  <span>Talado, procesado y extracción en una sola coordinación.</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}