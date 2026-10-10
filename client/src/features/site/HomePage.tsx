import { BackTopButton } from "./components/BackTopButton";
import { About } from "./components/About";
import { ContactSection } from "./components/ContactSection";
import { CtaBand } from "./components/CtaBand";
import { Faq } from "./components/Faq";
import { Hero } from "./components/Hero";
import { NewsSection } from "./components/NewsSection";
import { Process } from "./components/Process";
import { Services } from "./components/Services";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { Stats } from "./components/Stats";
import { Sustainability } from "./components/Sustainability";
import { TopBar } from "./components/TopBar";
import { resolveSettings, useSite } from "./useSite";
import "./site.css";

export function HomePage() {
  const { data } = useSite();
  const settings = resolveSettings(data?.settings);

  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <TopBar phone={settings.contactPhone} />
      <SiteHeader />
      <main id="main">
        <Hero
          eyebrow={settings.heroEyebrow}
          title={settings.heroTitle}
          lead={settings.heroLead}
        />
        <Stats settings={settings} />
        <About />
        <Services services={data?.services ?? []} />
        <Process />
        <Sustainability />
        <CtaBand />
        <NewsSection news={data?.news ?? []} />
        <Faq faqs={data?.faqs ?? []} />
        <ContactSection settings={settings} />
      </main>
      <SiteFooter settings={settings} />
      <BackTopButton />
    </>
  );
}