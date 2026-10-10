import { useState } from "react";
import { formatDateTime } from "../../lib/format";
import { useContacts, useDeleteContact, useUpdateContactStatus } from "./api";
import { Card, EmptyState, PageHeader, StatusBadge } from "./ui";

const FILTER_OPTIONS = [
  { value: "todos", label: "Todas" },
  { value: "nuevo", label: "Nuevas" },
  { value: "en_seguimiento", label: "En seguimiento" },
  { value: "respondido", label: "Respondidas" },
  { value: "cerrado", label: "Cerradas" },
];

const STATUS_OPTIONS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "en_seguimiento", label: "En seguimiento" },
  { value: "respondido", label: "Respondido" },
  { value: "cerrado", label: "Cerrado" },
];

export function ContactsPage() {
  const [status, setStatus] = useState("todos");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const contacts = useContacts({ status: status === "todos" ? undefined : status, page, perPage: 20 });
  const updateStatus = useUpdateContactStatus();
  const remove = useDeleteContact();

  const totalPages = contacts.data
    ? Math.max(1, Math.ceil(contacts.data.total / contacts.data.perPage))
    : 1;

  return (
    <>
      <PageHeader
        title="Cotizaciones"
        description="Consultas recibidas desde el formulario del sitio."
        action={
          <select
            className="field-control"
            style={{ width: "auto", minWidth: 190 }}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        }
      />

      {contacts.isError ? (
        <p className="text-sm text-[#8e2a1e]">No se pudieron cargar las cotizaciones.</p>
      ) : null}

      {contacts.isLoading ? (
        <p className="text-sm text-ink-mute">Cargando…</p>
      ) : contacts.data && contacts.data.items.length === 0 ? (
        <EmptyState>No hay consultas para este filtro.</EmptyState>
      ) : (
        <div className="space-y-3">
          {contacts.data?.items.map((item) => (
            <Card key={item.id} className="!p-0">
              <button
                type="button"
                className="flex w-full flex-wrap items-start justify-between gap-3 p-4 text-left"
                onClick={() => setExpanded((cur) => (cur === item.id ? null : item.id))}
                aria-expanded={expanded === item.id}
              >
                <div className="min-w-0">
                  <p className="font-medium text-green-950">
                    {item.nombre}
                    {item.empresa ? <span className="text-ink-mute"> · {item.empresa}</span> : null}
                  </p>
                  <p className="text-sm text-ink-soft">{item.servicio}</p>
                  <p className="text-xs text-ink-mute">{item.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-mute">{formatDateTime(item.createdAt)}</span>
                  <StatusBadge status={item.status} />
                </div>
              </button>

              {expanded === item.id ? (
                <div className="border-t border-line p-4">
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-ink-mute">Teléfono</dt>
                      <dd>
                        <a className="text-green-700 hover:underline" href={`tel:${item.telefono}`}>
                          {item.telefono}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-mute">Correo</dt>
                      <dd>
                        <a className="text-green-700 hover:underline" href={`mailto:${item.email}`}>
                          {item.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 whitespace-pre-wrap rounded-lg bg-surface-2/70 p-3 text-sm text-ink-soft">
                    {item.mensaje}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-ink-mute">Estado</span>
                      <select
                        className="field-control"
                        style={{ width: "auto" }}
                        value={item.status}
                        disabled={updateStatus.isPending}
                        onChange={(e) => updateStatus.mutate({ id: item.id, status: e.target.value })}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="ml-auto rounded-lg border border-[#e6b3aa] px-3 py-2 text-sm font-semibold text-[#8e2a1e] hover:bg-[#fbeae7]"
                      disabled={remove.isPending}
                      onClick={() => {
                        if (window.confirm("¿Eliminar esta consulta? No se puede deshacer.")) {
                          remove.mutate(item.id);
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      {contacts.data && contacts.data.total > contacts.data.perPage ? (
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-ink-mute">
            Página {contacts.data.page} de {totalPages} · {contacts.data.total} en total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn--ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}