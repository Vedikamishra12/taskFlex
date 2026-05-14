import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Menu, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../lib/initials";

const Navbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 px-3 pb-3 backdrop-blur-xl pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
      <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              readOnly
              placeholder="Search projects, tasks, people…"
              className="w-full cursor-default rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-slate-300 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl"
                >
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">You&apos;re all caught up. Task updates and mentions will land here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:bg-white/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-xs font-bold text-white">
                {getInitials(user?.name)}
              </span>
              <span className="hidden max-w-[120px] truncate text-left text-sm font-semibold text-slate-100 sm:block">{user?.name}</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 z-50 mt-2 w-[min(13rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200/10 bg-white py-2 text-slate-950 shadow-2xl backdrop-blur-xl"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm !text-slate-950 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-4 w-4 text-slate-700" />
                    Profile
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-2 min-w-0 px-3 sm:px-6 md:hidden">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            readOnly
            placeholder="Search projects, tasks, people…"
            className="w-full cursor-default rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-slate-300 placeholder:text-slate-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
