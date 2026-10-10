import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faqSchema, type FaqDraft } from "@lecal/shared";
import { ApiError } from "../../lib/api";
import { useCreateFaq, useDeleteFaq, useFaqAdmin, useUpdateFaq, type FaqItem } from "./api";
import { Card, EmptyState, ErrorText, FormField, PageHeader } from "./ui";

export function FaqPage() {
  const faqs = useFaqAdmin();
  const create = useCreateFaq();
  const update = useUpdateFaq();
  const remove = useDeleteFaq();
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [open, setOpen] = useState(false);

  const nextOrder = faqs.data ? faqs.data.length : 0;

  const form = useForm<FaqDraft>({
    resolver: zodResolver(faqSchema) as Resolver<FaqDraft>,
    defaultValues: { question: "", answer: "", order: nextOrder, active: true },
  });

  const openNew = () => {
    setEditing(null);
    form.reset({ question: "", answer: "", order: nextOrder, active: true });
    setOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditing(item);
    form.reset({
      question: item.question,
      answer: item.answer,
      order: item.order,
      active: item.active,
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
        title="Preguntas frecuentes"
        description="Administrá las preguntas que se muestran en el sitio."
        action={
          <button type="button" className="btn btn--primary" onClick={openNew}>
            Nueva pregunta
          </button>
        }
      />

      <ErrorText>
        {mutationError instanceof ApiError ? mutationError.message : mutationError ? "No se pudo guardar." : ""}
      </ErrorText>

      {open ? (
        <Card className="mb-6">
          <form onSubmit={onSubmit} noValidate>
            <FormField
              id="faq-question"
              label="Pregunta"
              error={form.formState.errors.question?.message}
            >
              <input className="field-control" id="faq-question" {...form.register("question")} />
            </FormField>
            <FormField id="faq-answer" label="Respuesta" error={form.formState.errors.answer?.message}>
              <textarea className="field-control" id="faq-answer" {...form.register("answer")} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="faq-order" label="Orden" error={form.formState.errors.order?.message}>
                <input
                  className="field-control"
                  id="faq-order"
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
                {editing ? "Guardar cambios" : "Crear pregunta"}
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

      {faqs.isLoading ? (
        <p className="text-sm text-ink-mute">Cargando…</p>
      ) : faqs.data && faqs.data.length === 0 ? (
        <EmptyState>Todavía no hay preguntas cargadas.</EmptyState>
      ) : (
        <div className="space-y-3">
          {faqs.data?.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-green-950">
                    {item.question}
                    {!item.active ? (
                      <span className="ml-2 rounded-full border border-line-strong bg-surface-2 px-2 py-0.5 text-xs text-ink-mute">
                        Oculto
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{item.answer}</p>
                </div>
                <div className="flex flex-none gap-2">
                  <button type="button" className="btn btn--ghost" onClick={() => openEdit(item)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[#e6b3aa] px-3 py-2 text-sm font-semibold text-[#8e2a1e] hover:bg-[#fbeae7]"
                    onClick={() => {
                      if (window.confirm("¿Eliminar esta pregunta?")) remove.mutate(item.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}