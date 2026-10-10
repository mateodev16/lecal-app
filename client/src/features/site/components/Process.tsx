import { Reveal } from "../../../components/Reveal";

const steps = [
  {
    n: "PASO 01",
    title: "Relevamiento y planificación",
    text: "Visitamos el predio, medimos superficies y acordamos alcance, plazos y estándares de calidad antes de mover una máquina.",
  },
  {
    n: "PASO 02",
    title: "Ejecución en el campo",
    text: "Cuadrillas propias y maquinaria ejecutan las tareas de plantación, poda o cosecha con protocolos de seguridad activos.",
  },
  {
    n: "PASO 03",
    title: "Control de calidad",
    text: "Monitoreamos indicadores de rendimiento y calidad, y coordinamos los ajustes necesarios con el cliente.",
  },
  {
    n: "PASO 04",
    title: "Informe y cierre",
    text: "Recibís reportes de avance, superficie trabajada y novedades, y cerramos el contrato con la documentación en orden.",
  },
];

export function Process() {
  return (
    <section className="section section--paper" id="proceso" aria-labelledby="proceso-title">
      <div className="site-container">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Cómo trabajamos</span>
            <h2 id="proceso-title">Un proceso ordenado, medible y seguro</h2>
          </Reveal>
          <Reveal delay={70}>
            <p className="lead">
              Trabajamos con un método claro que nos permite planificar, ejecutar y controlar cada
              contrato, con foco en la seguridad de las personas y el cuidado del monte.
            </p>
          </Reveal>
        </div>

        <div className="process-grid">
          {steps.map((step, i) => (
            <Reveal key={step.n} className="step" delay={(i % 4) * 70}>
              <span className="step__n">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}