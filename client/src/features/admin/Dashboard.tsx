import { Link } from "react-router-dom";
import { formatDateTime } from "../../lib/format";
import { useContacts, useFaqAdmin, useNewsAdmin, useServices, useSettings } from "./api";
import { Card, PageHeader, StatusBadge } from "./ui";

export function Dashboard() {
  const contacts = useContacts({ perPage: 5 });
  const services = useServices();
  const news = useNewsAdmin();
  const faqs = useFaqAdmin();
  const settings = useSettings();

  const stats = [
    { label: "Cotizaciones", value: contacts.data?.total, to: "/admin/cotizaciones" },
    { label: "Servicios", value: services.data?.length, to: "/admin/servicios" },
    { label: "Novedades", value: news.data?.length, to: "/admin/novedades" },
    { label: "Preguntas", value: faqs.data?.length, to: "/admin/preguntas" },
  ];

  return (
    <>
      <PageHeader
        title="Resumen"
        description="Estado general del contenido y las consultas recibidas."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-sm text-ink-mute">{stat.label}</span>
              <span className="mt-2 block font-display text-3xl font-extrabold text-green-900">
                {stat.value ?? "—"}
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-green-950">Últimas cotizaciones</h2>
            <Link
              to="/admin/cotizaciones"
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Ver todas →
            </Link>
          </div>

          {contacts.isLoading ? (
            <p className="text-sm text-ink-mute">Cargando…</p>
          ) : contacts.data && contacts.data.items.length > 0 ? (
            <ul className="divide-y divide-line">
              {contacts.data.items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-green-950">
                      {item.nombre}
                      {item.empresa ? <span className="text-ink-mute"> · {item.empresa}</span> : null}
                    </p>
                    <p className="truncate text-sm text-ink-mute">{item.servicio}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-mute">{formatDateTime(item.createdAt)}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-mute">Todavía no hay consultas.</p>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="mb-2 font-display text-lg font-bold text-green-950">Contenido editable</h2>
          <p className="text-sm text-ink-soft">
            {settings.data
              ? `${Object.keys(settings.data).length} ajustes con valor personalizado.`
              : "Cargando ajustes…"}{" "}
            Podés editar servicios, novedades, preguntas y los textos generales del sitio desde el
            menú.
          </p>
        </Card>
      </div>
    </>
  );
}