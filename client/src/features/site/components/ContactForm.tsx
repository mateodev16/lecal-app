import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, SERVICIO_SELECT, type ContactInput } from "@lecal/shared";
import { api, ApiError } from "../../../lib/api";
import { IconAlert, IconArrowR, IconCheckCircle } from "../../../lib/icons";

type FormValues = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
};

type Status = "idle" | "success" | "error";

const servicioOptions = SERVICIO_SELECT.options;

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field" data-invalid={error ? "true" : "false"}>
      <label className="field-label" htmlFor={id}>
        {label} {required ? <span className="req">*</span> : null}
      </label>
      {children}
      <p className="field-error" id={`error-${id}`}>
        {error}
      </p>
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema) as Resolver<FormValues>,
    defaultValues: {
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      servicio: "",
      mensaje: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError("");
    try {
      await api<{ id: string }>("/contact", {
        method: "POST",
        body: values as ContactInput,
      });
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        const issues = (err.details as { issues?: { field: string; message: string }[] } | undefined)
          ?.issues;
        if (issues?.length) {
          for (const issue of issues) {
            if (issue.field in values) {
              setError(issue.field as keyof FormValues, { message: issue.message });
            }
          }
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError("No pudimos enviar la consulta. Probá de nuevo en unos minutos.");
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="contact-card">
      <div
        className={`form-alert form-alert--success${status === "success" ? " is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <IconCheckCircle />
        <span>
          <b>¡Gracias!</b> Recibimos tu consulta y te vamos a contactar a la brevedad.
        </span>
      </div>

      <div
        className={`form-alert form-alert--error${status === "error" ? " is-visible" : ""}`}
        role="alert"
        aria-live="assertive"
      >
        <IconAlert />
        <span>{serverError || "Revisá los campos marcados y volvé a intentar."}</span>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <Field id="nombre" label="Nombre" required error={errors.nombre?.message}>
            <input
              className="field-control"
              id="nombre"
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.nombre ? "true" : "false"}
              aria-describedby="error-nombre"
              {...register("nombre")}
            />
          </Field>
          <Field id="empresa" label="Empresa / predio" error={errors.empresa?.message}>
            <input
              className="field-control"
              id="empresa"
              autoComplete="organization"
              {...register("empresa")}
            />
          </Field>
        </div>

        <div className="form-row">
          <Field id="email" label="Correo electrónico" required error={errors.email?.message}>
            <input
              className="field-control"
              id="email"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="error-email"
              {...register("email")}
            />
          </Field>
          <Field id="telefono" label="Teléfono" required error={errors.telefono?.message}>
            <input
              className="field-control"
              id="telefono"
              type="tel"
              autoComplete="tel"
              aria-required="true"
              aria-invalid={errors.telefono ? "true" : "false"}
              aria-describedby="error-telefono"
              {...register("telefono")}
            />
          </Field>
        </div>

        <Field id="servicio" label="Servicio de interés" required error={errors.servicio?.message}>
          <select
            className="field-control"
            id="servicio"
            aria-required="true"
            aria-invalid={errors.servicio ? "true" : "false"}
            aria-describedby="error-servicio"
            {...register("servicio")}
          >
            <option value="">Elegí el servicio que te interesa</option>
            {servicioOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field id="mensaje" label="Mensaje" required error={errors.mensaje?.message}>
          <textarea
            className="field-control"
            id="mensaje"
            placeholder="Contanos la ubicación y superficie aproximada del predio, y qué necesitás."
            aria-required="true"
            aria-invalid={errors.mensaje ? "true" : "false"}
            aria-describedby="error-mensaje"
            {...register("mensaje")}
          />
        </Field>

        <button
          className="btn btn--primary"
          type="submit"
          style={{ width: "100%" }}
          disabled={submitting}
        >
          {submitting ? "Enviando…" : "Enviar consulta"}
          <IconArrowR />
        </button>
        <p className="form-note">Los datos se usan únicamente para responder tu consulta.</p>
      </form>
    </div>
  );
}