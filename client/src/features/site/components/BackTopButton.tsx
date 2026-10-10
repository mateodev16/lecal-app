import { useEffect, useState } from "react";
import { IconUp } from "../../../lib/icons";

export function BackTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`back-top${visible ? " is-visible" : ""}`}
      type="button"
      aria-label="Volver arriba"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <IconUp />
    </button>
  );
}