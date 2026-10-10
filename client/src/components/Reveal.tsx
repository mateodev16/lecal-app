import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealTag = "div" | "article" | "section" | "li" | "span";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  as?: RevealTag;
};

export function Reveal({ children, className = "", delay = 0, style, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const styleWithDelay = { "--d": `${delay}ms`, ...style } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`.trim()}
      style={styleWithDelay}
    >
      {children}
    </Tag>
  );
}