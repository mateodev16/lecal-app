import type { SettingKey } from "@lecal/shared";
import { Reveal } from "../../../components/Reveal";
import { IconClock, IconMail, IconPhone, IconPin } from "../../../lib/icons";
import { ContactForm } from "./ContactForm";

export function ContactSection({ settings }: { settings: Record<SettingKey, string> }) {
  const telHref = `tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="section" id="contacto" aria-labelledby="contacto-title">
      <div className="site-container">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Contacto</span>
            <h2 id="contacto-title">Hablemos de tu próximo trabajo</h2>
          </Reveal>
          <Reveal delay={70}>
            <p className="lead">
              Completá el formulario o escribinos directamente. Te contestamos dentro del horario de
              oficina.
            </p>
          </Reveal>
        </div>

        <div className="contact-grid">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal className="contact-info" delay={70}>
            <div className="info-item">
              <div className="info-item__icon" aria-hidden="true">
                <IconPin />
              </div>
              <div>
                <b>Dirección</b>
                <span>{settings.contactAddress}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-item__icon" aria-hidden="true">
                <IconPhone />
              </div>
              <div>
                <b>Teléfono</b>
                <a href={telHref}>{settings.contactPhone}</a>
              </div>
            </div>
            <div className="info-item">
              <div className="info-item__icon" aria-hidden="true">
                <IconMail />
              </div>
              <div>
                <b>Correo</b>
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </div>
            </div>
            <div className="info-item">
              <div className="info-item__icon" aria-hidden="true">
                <IconClock />
              </div>
              <div>
                <b>Horario</b>
                <span>{settings.contactHours}</span>
              </div>
            </div>
            <div
              className="map-embed"
              role="img"
              aria-label="Mapa de ubicación de LECAL SRL en Minas, Lavalleja"
            >
              <span>
                Minas, Lavalleja · Uruguay
                <br />
                Base operativa LECAL SRL
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}