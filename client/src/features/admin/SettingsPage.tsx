import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DEFAULT_SETTINGS,
  SETTING_KEYS,
  settingsPatchSchema,
  type SettingKey,
  type SettingsPatch,
} from "@lecal/shared";
import { ApiError } from "../../lib/api";
import { useSettings, useUpdateSettings } from "./api";
import { Card, ErrorText, FormField, PageHeader } from "./ui";

type SettingsForm = Record<SettingKey, string>;

const LABELS: Record<SettingKey, string> = {
  heroEyebrow: "Hero · Antetítulo",
  heroTitle: "Hero · Título principal",
  heroLead: "Hero · Texto de presentación",
  statYears: "Indicador · Años",
  statYearsLabel: "Indicador · Etiqueta de años",
  statHa: "Indicador · Hectáreas",
  statHaLabel: "Indicador · Etiqueta de hectáreas",
  statJobs: "Indicador · Puestos de trabajo",
  statJobsLabel: "Indicador · Etiqueta de puestos",
  statDepts: "Indicador · Departamentos",
  statDeptsLabel: "Indicador · Etiqueta de departamentos",
  contactAddress: "Contacto · Dirección",
  contactPhone: "Contacto · Teléfono",
  contactEmail: "Contacto · Correo",
  contactHours: "Contacto · Horario",
  footerBlurb: "Pie de página · Descripción",
};

const LONG: SettingKey[] = ["heroLead", "footerBlurb"];

export function SettingsPage() {
  const settings = useSettings();
  const update = useUpdateSettings();

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsPatchSchema) as Resolver<SettingsForm>,
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    if (settings.data) {
      form.reset({ ...DEFAULT_SETTINGS, ...settings.data });
    }
  }, [settings.data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    await update.mutateAsync(values as SettingsPatch);
  });

  return (
    <>
      <PageHeader
        title="Ajustes del sitio"
        description="Textos generales editables de la página de inicio y el contacto."
      />

      <ErrorText>
        {update.error instanceof ApiError ? update.error.message : update.error ? "No se pudo guardar." : ""}
      </ErrorText>
      {update.isSuccess ? (
        <p className="mb-4 rounded-lg border border-[#a9d4b8] bg-[#e8f5ec] px-3 py-2 text-sm text-[#0e5b2e]">
          Cambios guardados.
        </p>
      ) : null}

      {settings.isLoading ? (
        <p className="text-sm text-ink-mute">Cargando…</p>
      ) : (
        <Card>
          <form onSubmit={onSubmit} noValidate>
            <div className="grid gap-x-6 sm:grid-cols-2">
              {SETTING_KEYS.map((key) => (
                <div key={key} className={LONG.includes(key) ? "sm:col-span-2" : ""}>
                  <FormField id={`setting-${key}`} label={LABELS[key]}>
                    {LONG.includes(key) ? (
                      <textarea
                        className="field-control"
                        id={`setting-${key}`}
                        {...form.register(key)}
                      />
                    ) : (
                      <input
                        className="field-control"
                        id={`setting-${key}`}
                        {...form.register(key)}
                      />
                    )}
                  </FormField>
                </div>
              ))}
            </div>
            <button className="btn btn--primary" type="submit" disabled={update.isPending}>
              {update.isPending ? "Guardando…" : "Guardar ajustes"}
            </button>
          </form>
        </Card>
      )}
    </>
  );
}