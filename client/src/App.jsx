import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import RecipesPage from "./pages/RecipesPage";
import NewRecipePage from "./pages/NewRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import EditRecipePage from "./pages/EditRecipePage";
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
          <Route path="/recipes" element={<ProtectedLayout><RecipesPage /></ProtectedLayout>} />
          <Route path="/recipes/new" element={<ProtectedLayout><NewRecipePage /></ProtectedLayout>} />
          <Route path="/recipes/:id" element={<ProtectedLayout><RecipeDetailPage /></ProtectedLayout>} />
          <Route path="/recipes/:id/edit" element={<ProtectedLayout><EditRecipePage /></ProtectedLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
