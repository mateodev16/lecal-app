import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsDraft } from "@lecal/shared";
import { ApiError } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useCreateNews, useDeleteNews, useNewsAdmin, useUpdateNews, type NewsPost } from "./api";
import { Card, EmptyState, ErrorText, FormField, PageHeader } from "./ui";

type NewsValues = {
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  order: number;
  active: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

export function NewsPage() {
  const news = useNewsAdmin();
  const create = useCreateNews();
  const update = useUpdateNews();
  const remove = useDeleteNews();
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [open, setOpen] = useState(false);

  const nextOrder = news.data ? news.data.length : 0;

  const form = useForm<NewsValues>({
    resolver: zodResolver(newsSchema) as unknown as Resolver<NewsValues>,
    defaultValues: {
      title: "",
      date: today(),
      excerpt: "",
      imageUrl: "",
      order: nextOrder,
      active: true,
    },
  });

  const openNew = () => {
    setEditing(null);
    form.reset({ title: "", date: today(), excerpt: "", imageUrl: "", order: nextOrder, active: true });
    setOpen(true);
  };

  const openEdit = (post: NewsPost) => {
    setEditing(post);
    form.reset({
      title: post.title,
      date: post.date.slice(0, 10),
      excerpt: post.excerpt,
      imageUrl: post.imageUrl ?? "",
      order: post.order,
      active: post.active,
    });
    setOpen(true);
  };

  const mutationError = create.error ?? update.error ?? remove.error;

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = { ...values, date: new Date(values.date) } as unknown as NewsDraft;
    if (editing) {
      await update.mutateAsync({ id: editing.id, data: payload });
    } else {
      await create.mutateAsync(payload);
    }
    setOpen(false);
    setEditing(null);
  });

  return (
    <>
      <PageHeader
        title="Novedades"
        description="Publicá noticias y avances de la empresa."
        action={
          <button type="button" className="btn btn--primary" onClick={openNew}>
            Nueva novedad
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
              <FormField id="news-title" label="Título" error={form.formState.errors.title?.message}>
                <input className="field-control" id="news-title" {...form.register("title")} />
              </FormField>
              <FormField id="news-date" label="Fecha" error={form.formState.errors.date?.message}>
                <input className="field-control" id="news-date" type="date" {...form.register("date")} />
              </FormField>
            </div>
            <FormField id="news-excerpt" label="Resumen" error={form.formState.errors.excerpt?.message}>
              <textarea className="field-control" id="news-excerpt" {...form.register("excerpt")} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="news-image"
                label="URL de imagen (opcional)"
                hint="Imagen alojada en un servidor externo (http/https) o vacío."
                error={form.formState.errors.imageUrl?.message}
              >
                <input className="field-control" id="news-image" {...form.register("imageUrl")} />
              </FormField>
              <FormField id="news-order" label="Orden" error={form.formState.errors.order?.message}>
                <input
                  className="field-control"
                  id="news-order"
                  type="number"
                  min={0}
                  max={999}
                  {...form.register("order", { valueAsNumber: true })}
                />
              </FormField>
            </div>
            <label className="mb-4 flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("active")} />
              Visible en el sitio
            </label>
            <div className="flex gap-3">
              <button className="btn btn--primary" type="submit" disabled={form.formState.isSubmitting}>
                {editing ? "Guardar cambios" : "Crear novedad"}
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

      {news.isLoading ? (
        <p className="text-sm text-ink-mute">Cargando…</p>
      ) : news.data && news.data.length === 0 ? (
        <EmptyState>Todavía no hay novedades.</EmptyState>
      ) : (
        <div className="space-y-3">
          {news.data?.map((post) => (
            <Card key={post.id} className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-green-950">
                  {post.title}
                  {!post.active ? (
                    <span className="ml-2 rounded-full border border-line-strong bg-surface-2 px-2 py-0.5 text-xs text-ink-mute">
                      Oculto
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-ink-mute">{formatDate(post.date)}</p>
                <p className="line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn btn--ghost" onClick={() => openEdit(post)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#e6b3aa] px-3 py-2 text-sm font-semibold text-[#8e2a1e] hover:bg-[#fbeae7]"
                  onClick={() => {
                    if (window.confirm(`¿Eliminar "${post.title}"?`)) remove.mutate(post.id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}