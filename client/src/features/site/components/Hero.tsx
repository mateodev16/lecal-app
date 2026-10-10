import { IconArrowR, IconLeaf, IconShieldCheck, IconTruck } from "../../../lib/icons";

type HeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
};

export function Hero({ eyebrow, title, lead }: HeroProps) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <img src="/img/hero.jpg" alt="" width={1920} height={1440} fetchPriority="high" />
        <div className="hero__overlay" />
      </div>
      <div className="site-container">
        <div className="hero__inner">
          <span className="eyebrow">{eyebrow}</span>
          <h1 id="hero-title">{title}</h1>
          <p className="hero__lead">{lead}</p>
          <div className="hero__cta">
            <a className="btn btn--onDark" href="#servicios">
              Ver servicios
              <IconArrowR />
            </a>
            <a className="btn btn--outlineDark" href="#contacto">
              Hablar con el equipo
            </a>
          </div>
          <div className="hero__chips">
            <span className="chip">
              <IconShieldCheck />
              Seguridad y salud ocupacional
            </span>
            <span className="chip">
              <IconLeaf />
              Gestión forestal responsable
            </span>
            <span className="chip">
              <IconTruck />
              Cuadrillas y equipos propios
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}