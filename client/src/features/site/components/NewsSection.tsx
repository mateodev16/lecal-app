import { Reveal } from "../../../components/Reveal";
import { formatMonth } from "../../../lib/format";
import type { SiteNews } from "../useSite";

export function NewsSection({ news }: { news: SiteNews[] }) {
  if (news.length === 0) return null;

  return (
    <section className="section" id="novedades" aria-labelledby="novedades-title">
      <div className="site-container">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Novedades</span>
            <h2 id="novedades-title">Lo último de LECAL</h2>
          </Reveal>
          <Reveal delay={70}>
            <p className="lead">
              Noticias, capacitaciones y avances de nuestras operaciones en el sudeste.
            </p>
          </Reveal>
        </div>

        <div className="news-grid">
          {news.map((post, i) => (
            <Reveal as="article" key={post.id} delay={(i % 3) * 70}>
              <a className="news-card" href="#contacto">
                <div className="news-card__media">
                  <img
                    src={post.imageUrl || "/img/about.jpg"}
                    alt={post.title}
                    width={1024}
                    height={683}
                    loading="lazy"
                  />
                </div>
                <div className="news-card__body">
                  <span className="news-card__date">{formatMonth(post.date)}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="news-card__more">Leer más →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}