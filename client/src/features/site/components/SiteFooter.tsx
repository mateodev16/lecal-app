import type { SettingKey } from "@lecal/shared";

export function SiteFooter({ settings }: { settings: Record<SettingKey, string> }) {
  const year = new Date().getFullYear();
  const telHref = `tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div>
            <span className="brand-plate">
              <img src="/img/logo.jpg" alt="LECAL SRL" width={1600} height={1132} />
            </span>
            <p>{settings.footerBlurb}</p>
          </div>
          <div>
            <h4>Servicios</h4>
            <nav className="footer-links" aria-label="Servicios">
              <a href="#servicios">Plantación y silvicultura</a>
              <a href="#servicios">Poda y raleo</a>
              <a href="#servicios">Cosecha forestal</a>
              <a href="#servicios">Transporte y logística</a>
              <a href="#servicios">Caminería rural</a>
            </nav>
          </div>
          <div>
            <h4>Empresa</h4>
            <nav className="footer-links" aria-label="Empresa">
              <a href="#nosotros">Nosotros</a>
              <a href="#sostenibilidad">Sostenibilidad</a>
              <a href="#novedades">Novedades</a>
              <a href="#faq">Preguntas frecuentes</a>
              <a href="#contacto">Contacto</a>
            </nav>
          </div>
          <div>
            <h4>Contacto</h4>
            <nav className="footer-links" aria-label="Contacto">
              <a href={telHref}>{settings.contactPhone}</a>
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              <a href="#contacto">{settings.contactAddress}</a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} LECAL SRL. Todos los derechos reservados.</span>
          <span>Sitio de demostración — contenido de ejemplo editable.</span>
          <span className="footer-credit">
            Desarrollado por{" "}
            <a
              className="footer-credit__name"
              href="https://www.linkedin.com/in/mateo-goñi-10ab54294"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mateo Goñi
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}