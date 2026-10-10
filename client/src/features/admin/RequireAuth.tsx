import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useMe } from "./api";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useMe();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-ink-mute">Cargando…</div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}