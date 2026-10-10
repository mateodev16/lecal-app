import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./features/admin/AdminLayout";
import { ContactsPage } from "./features/admin/ContactsPage";
import { Dashboard } from "./features/admin/Dashboard";
import { FaqPage } from "./features/admin/FaqPage";
import { LoginPage } from "./features/admin/LoginPage";
import { NewsPage } from "./features/admin/NewsPage";
import { RequireAuth } from "./features/admin/RequireAuth";
import { ServicesPage } from "./features/admin/ServicesPage";
import { SettingsPage } from "./features/admin/SettingsPage";
import { HomePage } from "./features/site/HomePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="cotizaciones" element={<ContactsPage />} />
        <Route path="servicios" element={<ServicesPage />} />
        <Route path="novedades" element={<NewsPage />} />
        <Route path="preguntas" element={<FaqPage />} />
        <Route path="ajustes" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}