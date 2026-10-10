import type { SiteService } from "../useSite";
import { IconArrowR, SERVICE_ICONS, IconSprout } from "../../../lib/icons";
import { Reveal } from "../../../components/Reveal";

export function Services({ services }: { services: SiteService[] }) {
  return (
    <section className="section" id="servicios" aria-labelledby="servicios-title">
      <div className="site-container">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Qué hacemos</span>
            <h2 id="servicios-title">Servicios forestales de principio a fin</h2>
          </Reveal>
          <Reveal delay={70}>
            <p className="lead">
              Cubrimos las etapas clave del ciclo productivo. Podés contratar un servicio puntual o
              delegar el manejo integral de tu plantación.
            </p>
          </Reveal>
        </div>

        <div className="services-grid">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon] ?? IconSprout;
            return (
              <Reveal as="article" key={service.id} className="service-card" delay={(i % 4) * 70}>
                <div className="service-card__icon" aria-hidden="true">
                  <Icon />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-card__more">
                  Ver detalle
                  <IconArrowR />
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}