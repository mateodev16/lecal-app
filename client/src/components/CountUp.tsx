import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../lib/format";

type CountUpProps = {
  value: number;
  className?: string;
};

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          obs.unobserve(entry.target);
          const duration = 1100;
          let start: number | null = null;
          const tick = (ts: number) => {
            if (start === null) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(display)}
    </span>
  );
}