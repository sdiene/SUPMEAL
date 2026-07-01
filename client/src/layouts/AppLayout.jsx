import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const navItems = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/recipes", label: "Mes recettes", icon: "🍽️" },
  { to: "/cookbooks", label: "Cookbooks", icon: "📚" },
  { to: "/search", label: "Rechercher", icon: "🔍" },
  { to: "/settings", label: "Paramètres", icon: "⚙️" },
];
export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">�� SUPMEAL</h1>
          <p className="text-xs text-gray-400 mt-1">Gestion de recettes</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        {/* User + Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-500 hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors text-left"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="ml-64 flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
