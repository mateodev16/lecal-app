import { useEffect, useState } from "react";
import { IconArrowR, IconClose, IconMenu } from "../../../lib/icons";

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "sostenibilidad", label: "Sostenibilidad" },
  { id: "novedades", label: "Novedades" },
  { id: "contacto", label: "Contacto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!("IntersectionObserver" in window) || targets.length === 0) return;

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((t) => spy.observe(t));
    return () => spy.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="site-container">
        <a className="brand" href="#inicio" aria-label="LECAL SRL — Inicio">
          <img
            className="brand__logo"
            src="/img/logo.jpg"
            alt="Logotipo de LECAL SRL"
            width={1600}
            height={1132}
          />
          <span className="brand__text">
            <b>LECAL SRL</b>
            <span>Servicios forestales</span>
          </span>
        </a>

        <nav className={`nav${open ? " open" : ""}`} id="primary-nav" aria-label="Navegación principal">
          <ul className="nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current === item.id ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a className="btn btn--primary" href="#contacto">
            Pedir presupuesto
            <IconArrowR />
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <IconMenu className="icon-menu" />
            <IconClose className="icon-close" />
          </button>
        </div>
      </div>
    </header>
  );
}