import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SERVICE_ICON, serviceSchema, type ServiceDraft } from "@lecal/shared";
import { ApiError } from "../../lib/api";
import { SERVICE_ICONS } from "../../lib/icons";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
  type Service,
} from "./api";
import { Card, EmptyState, ErrorText, FormField, PageHeader } from "./ui";

const iconOptions = SERVICE_ICON.options;

export function ServicesPage() {
  const services = useServices();
  const create = useCreateService();
  const update = useUpdateService();
  const remove = useDeleteService();
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);

  const nextOrder = services.data ? services.data.length : 0;

  const form = useForm<ServiceDraft>({
    resolver: zodResolver(serviceSchema) as Resolver<ServiceDraft>,
    defaultValues: { title: "", description: "", icon: "sprout", order: nextOrder, active: true },
  });

  const openNew = () => {
    setEditing(null);
    form.reset({ title: "", description: "", icon: "sprout", order: nextOrder, active: true });
    setOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    form.reset({
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: service.order,
      active: service.active,
    });
    setOpen(true);
  };

  const mutationError = create.error ?? update.error ?? remove.error;

  const onSubmit = form.handleSubmit(async (values) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, data: values });
    } else {
      await create.mutateAsync(values);
    }
    setOpen(false);
    setEditing(null);
  });

  return (
    <>
      <PageHeader
        title="Servicios"
        description="Editá los servicios que se muestran en el sitio."
        action={
          <button type="button" className="btn btn--primary" onClick={openNew}>
            Nuevo servicio
          </button>
        }
      />

      <ErrorText>
        {mutationError instanceof ApiError ? mutationError.message : mutationError ? "No se pudo guardar." : ""}
      </ErrorText>

      {open ? (
        <Card className="mb-6">
          <form onSubmit={onSubmit} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="svc-title" label="Título" error={form.formState.errors.title?.message}>
                <input className="field-control" id="svc-title" {...form.register("title")} />
              </FormField>
              <FormField id="svc-icon" label="Ícono" error={form.formState.errors.icon?.message}>
                <select className="field-control" id="svc-icon" {...form.register("icon")}>
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField
              id="svc-description"
              label="Descripción"
              error={form.formState.errors.description?.message}
            >
              <textarea
                className="field-control"
                id="svc-description"
                {...form.register("description")}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="svc-order" label="Orden" error={form.formState.errors.order?.message}>
                <input
                  className="field-control"
                  id="svc-order"
                  type="number"
                  min={0}
                  max={999}
                  {...form.register("order", { valueAsNumber: true })}
                />
              </FormField>
              <label className="flex items-center gap-2 pt-7 text-sm">
                <input type="checkbox" {...form.register("active")} />
                Visible en el sitio
              </label>
            </div>
            <div className="flex gap-3">
              <button className="btn btn--primary" type="submit" disabled={form.formState.isSubmitting}>
                {editing ? "Guardar cambios" : "Crear servicio"}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      ) : null}

      {services.isLoading ? (
        <p className="text-sm text-ink-mute">Cargando…</p>
      ) : services.data && services.data.length === 0 ? (
        <EmptyState>Todavía no hay servicios cargados.</EmptyState>
      ) : (
        <div className="space-y-3">
          {services.data?.map((service) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <Card key={service.id} className="flex flex-wrap items-center gap-4">
                <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-line bg-surface-2 text-green-700">
                  {Icon ? <Icon /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-green-950">
                    {service.title}
                    {!service.active ? (
                      <span className="ml-2 rounded-full border border-line-strong bg-surface-2 px-2 py-0.5 text-xs text-ink-mute">
                        Oculto
                      </span>
                    ) : null}
                  </p>
                  <p className="line-clamp-2 text-sm text-ink-soft">{service.description}</p>
                </div>
                <span className="text-xs text-ink-mute">#{service.order}</span>
                <div className="flex gap-2">
                  <button type="button" className="btn btn--ghost" onClick={() => openEdit(service)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[#e6b3aa] px-3 py-2 text-sm font-semibold text-[#8e2a1e] hover:bg-[#fbeae7]"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${service.title}"?`)) remove.mutate(service.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}