import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "@lecal/shared";
import { ApiError } from "../../lib/api";
import { useLogin, useMe } from "./api";
import { ErrorText, FormField } from "./ui";

export function LoginPage() {
  const { data: user } = useMe();
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as Resolver<LoginInput>,
    defaultValues: { email: "", password: "" },
  });

  if (user) return <Navigate to={from} replace />;

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values);
    navigate(from, { replace: true });
  });

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-800 hover:underline"
        >
          ← Volver al sitio
        </Link>
        <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <img src="/img/logo.jpg" alt="" className="h-11 w-auto rounded" />
            <div>
              <h1 className="font-display text-xl font-bold text-green-950">Panel LECAL</h1>
              <p className="text-sm text-ink-mute">Ingresá con tu cuenta de administrador</p>
            </div>
          </div>

          <ErrorText>
            {login.error instanceof ApiError ? login.error.message : login.error ? "No se pudo iniciar sesión." : ""}
          </ErrorText>

          <form onSubmit={onSubmit} noValidate>
            <FormField id="email" label="Correo electrónico" error={errors.email?.message}>
              <input
                className="field-control"
                id="email"
                type="email"
                autoComplete="username"
                {...register("email")}
              />
            </FormField>
            <FormField id="password" label="Contraseña" error={errors.password?.message}>
              <input
                className="field-control"
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
            </FormField>
            <button
              className="btn btn--primary"
              type="submit"
              style={{ width: "100%" }}
              disabled={login.isPending}
            >
              {login.isPending ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}