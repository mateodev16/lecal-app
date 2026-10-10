import type { SettingKey } from "@lecal/shared";
import { CountUp } from "../../../components/CountUp";
import { Reveal } from "../../../components/Reveal";

type Stat = {
  value: string;
  label: string;
  prefix?: string;
  unit?: string;
};

function parse(value: string): number {
  const n = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function Stats({ settings }: { settings: Record<SettingKey, string> }) {
  const stats: Stat[] = [
    { value: settings.statYears, label: settings.statYearsLabel, unit: "años" },
    { value: settings.statHa, label: settings.statHaLabel, prefix: "+", unit: "ha" },
    { value: settings.statJobs, label: settings.statJobsLabel, prefix: "+" },
    { value: settings.statDepts, label: settings.statDeptsLabel, unit: "deptos." },
  ];

  return (
    <section className="stats" aria-label="LECAL SRL en números">
      <div className="site-container">
        <div className="stats__grid">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} className="stat" delay={i * 70}>
              <span className="stat__num">
                {stat.prefix ? <span className="u">{stat.prefix}</span> : null}
                <CountUp value={parse(stat.value)} />
                {stat.unit ? <span className="u">{stat.unit}</span> : null}
              </span>
              <span className="stat__label">{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}