import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { ROLE } from "./utils/enums";
import { useUserStore } from "./store/userStore";
import InvoicesPage from "./pages/InvoicesPage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import InvoiceViewPage from "./pages/InvoiceViewPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const { accessToken } = useUserStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            accessToken ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            accessToken ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={[ROLE.USER, ROLE.ACCOUNTANT, ROLE.ADMIN]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLE.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute roles={[ROLE.USER, ROLE.ACCOUNTANT, ROLE.ADMIN]}>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-invoice"
          element={
            <ProtectedRoute roles={[ROLE.ACCOUNTANT, ROLE.ADMIN]}>
              <CreateInvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices/:id"
          element={
            <ProtectedRoute roles={[ROLE.USER, ROLE.ACCOUNTANT, ROLE.ADMIN]}>
              <InvoiceViewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={accessToken ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
