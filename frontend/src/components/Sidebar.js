import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Palette,
  UserCircle,
  Users,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/team", label: "Team", icon: Users },
  { to: "/profile", label: "Profile", icon: UserCircle }
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? "bg-gradient-to-r from-[var(--accent-from)]/25 to-[var(--accent-to)]/15 text-white shadow-lg shadow-violet-500/10 ring-1 ring-white/10"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  const asideContent = (
    <div className="flex h-full flex-col px-4 py-6">
      <div className="mb-8 flex items-start justify-between gap-2">
        <BrandLogo />
        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in as</p>
        <p className="mt-1 truncate text-sm font-bold text-white">{user?.name}</p>
        <p className="truncate text-xs text-slate-400">{user?.email}</p>
        <span className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-200 ring-1 ring-white/10">
          {user?.role}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setMobileOpen(false)}>
            <Icon className="h-5 w-5 shrink-0 opacity-80 group-hover:opacity-100" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Palette className="h-4 w-4" />
          Accent
        </div>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded-xl border border-white/10 bg-slate-900/50 p-1.5 transition hover:scale-105 ${theme === item.id ? "theme-active" : ""}`}
              onClick={() => setTheme(item.id)}
              title={item.label}
              aria-label={`Use ${item.label} accent`}
            >
              <span className={`block h-7 w-full rounded-lg ${item.swatch}`} />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-red-500/15 hover:text-red-100 hover:ring-1 hover:ring-red-500/30"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {asideContent}
      </aside>
    </>
  );
};

export default Sidebar;
