import { Reveal } from "../../../components/Reveal";
import { IconPlus } from "../../../lib/icons";
import type { SiteFaq } from "../useSite";

export function Faq({ faqs }: { faqs: SiteFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="section section--paper" id="faq" aria-labelledby="faq-title">
      <div className="site-container">
        <div className="section-head" style={{ marginInline: "auto", textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              Preguntas frecuentes
            </span>
            <h2 id="faq-title">Resolvemos las dudas más comunes</h2>
          </Reveal>
        </div>
        <Reveal>
          <div className="faq">
            {faqs.map((item, i) => (
              <details key={item.id} open={i === 0}>
                <summary>
                  {item.question}
                  <span className="faq__sign" aria-hidden="true">
                    <IconPlus />
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}