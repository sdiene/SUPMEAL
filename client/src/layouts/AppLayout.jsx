import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getPendingCount } from "../api/invitations";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [invitationCount, setInvitationCount] = useState(0);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    function fetchCount() {
      getPendingCount()
        .then((res) => setInvitationCount(res.data.count))
        .catch(() => {});
    }
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navItems = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/recipes", label: "Mes recettes", icon: "🍽️" },
    { to: "/favorites", label: "Favoris", icon: "⭐" },
    { to: "/mealplan", label: "Planning", icon: "📅" },
    { to: "/cookbooks", label: "Cookbooks", icon: "📚" },
    { to: "/invitations", label: "Invitations", icon: "🔔", badge: invitationCount },
    { to: "/feed", label: "Fil d'actualité", icon: "📡" },
    { to: "/search", label: "Découverte", icon: "🌍" },
    { to: "/settings", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-red-600 flex flex-col fixed h-full">
        <div className="p-6 border-b border-red-500">
          <h1 className="text-xl font-bold text-white">🍴 SUPMEAL</h1>
          <p className="text-xs text-red-200 mt-1">Gestion de recettes</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "text-red-100 hover:bg-red-500 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-2 border-t border-red-500">
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-100 hover:bg-red-500 hover:text-white transition-colors text-sm"
          >
            {dark ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
        </div>

        <div className="p-4 border-t border-red-500">
          <NavLink
            to={`/profile/${user?.id}`}
            className="flex items-center gap-3 mb-3 hover:bg-red-500 rounded-lg p-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-red-200 truncate">👤 Mon profil</p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-100 hover:text-white hover:bg-red-500 py-2 px-3 rounded-lg transition-colors text-left"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  );
}
