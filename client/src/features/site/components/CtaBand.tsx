import { IconArrowR } from "../../../lib/icons";

export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="cta-band__media" aria-hidden="true">
        <img src="/img/cta.jpg" alt="" width={1024} height={681} loading="lazy" />
        <div className="cta-band__overlay" />
      </div>
      <div className="site-container">
        <div className="cta-band__inner">
          <div>
            <h2 id="cta-title">¿Tenés un monte para trabajar esta zafra?</h2>
            <p>
              Contanos qué necesitás y te preparamos una propuesta con alcance, plazos y equipos
              claros.
            </p>
          </div>
          <a className="btn btn--onDark" href="#contacto">
            Pedir presupuesto
            <IconArrowR />
          </a>
        </div>
      </div>
    </section>
  );
}