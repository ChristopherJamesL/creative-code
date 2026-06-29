import { Routes, Route } from "react-router";

import HomeRedirect from "./pages/HomeRedirect";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentPage from "./pages/DocumentPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RequireRole from "./components/auth/RequireRole";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/set-password" element={<SetPasswordPage />} />

      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"       element={<DashboardPage />} />
          <Route path="/documents"       element={<DocumentsPage />} />
          <Route path="/documents/:id"   element={<DocumentPage />} />

          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
