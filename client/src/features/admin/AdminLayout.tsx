import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLogout, useMe } from "./api";

const NAV = [
  { to: "/admin", label: "Resumen", end: true },
  { to: "/admin/cotizaciones", label: "Cotizaciones" },
  { to: "/admin/servicios", label: "Servicios" },
  { to: "/admin/novedades", label: "Novedades" },
  { to: "/admin/preguntas", label: "Preguntas" },
  { to: "/admin/ajustes", label: "Ajustes" },
];

export function AdminLayout() {
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-green-950 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/img/logo.jpg" alt="" className="h-9 w-auto rounded" />
            <span className="font-display text-lg font-bold">LECAL · Panel</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-white/70 sm:inline">{user?.email}</span>
            <Link to="/" className="text-white/80 hover:text-white hover:underline">
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/30 px-3 py-1.5 hover:bg-white/10"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <nav
          aria-label="Secciones del panel"
          className="flex gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-ink-soft hover:bg-surface-2 hover:text-green-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}