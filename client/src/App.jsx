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
import CookbooksPage from "./pages/CookbooksPage";
import CookbookDetailPage from "./pages/CookbookDetailPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import InvitationsPage from "./pages/InvitationsPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import EmailVerifiedPage from "./pages/EmailVerifiedPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
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
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/recipes" element={<ProtectedLayout><RecipesPage /></ProtectedLayout>} />
          <Route path="/recipes/new" element={<ProtectedLayout><NewRecipePage /></ProtectedLayout>} />
          <Route path="/recipes/:id" element={<ProtectedLayout><RecipeDetailPage /></ProtectedLayout>} />
          <Route path="/recipes/:id/edit" element={<ProtectedLayout><EditRecipePage /></ProtectedLayout>} />
          <Route path="/cookbooks" element={<ProtectedLayout><CookbooksPage /></ProtectedLayout>} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/cookbooks/:id" element={<ProtectedLayout><CookbookDetailPage /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
          <Route path="/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
          <Route path="/favorites" element={<ProtectedLayout><FavoritesPage /></ProtectedLayout>} />
          <Route path="/invitations" element={<ProtectedLayout><InvitationsPage /></ProtectedLayout>} />
          <Route path="/profile/:userId" element={<ProtectedLayout><PublicProfilePage /></ProtectedLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
