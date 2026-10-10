import { IconMail, IconPhone, IconPin } from "../../../lib/icons";

type TopBarProps = {
  phone: string;
};

export function TopBar({ phone }: TopBarProps) {
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="topbar">
      <div className="site-container">
        <div className="topbar__group">
          <span className="topbar__tag">
            <IconPin />
            Minas, Lavalleja · Uruguay
          </span>
          <a className="topbar__tag" href={telHref}>
            <IconPhone />
            {phone}
          </a>
        </div>
        <a className="topbar__tag" href="#contacto">
          <IconMail />
          Solicitar presupuesto
        </a>
      </div>
    </div>
  );
}