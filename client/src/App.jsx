import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
          <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
