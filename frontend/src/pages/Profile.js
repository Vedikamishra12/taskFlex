import { motion } from "framer-motion";
import { Calendar, Mail, Shield, Sparkles } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../lib/initials";

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" description="Your session details from the authenticated workspace." />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-cyan-500/10" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-2xl font-black text-white shadow-2xl">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-extrabold text-white">{user?.name}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  {user?.email}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-200">
                  <Shield className="h-3.5 w-3.5" />
                  {user?.role}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <GlassCard>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Account snapshot
          </div>
          <p className="mt-1 text-xs text-slate-500">Read-only fields mirror your signed-in session.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="form-label">Display name</label>
              <input className="form-input opacity-90" value={user?.name || ""} readOnly />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input opacity-90" value={user?.email || ""} readOnly />
            </div>
            <div>
              <label className="form-label">Role</label>
              <input className="form-input opacity-90" value={user?.role || ""} readOnly />
            </div>
            <div>
              <label className="form-label flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Member since
              </label>
              <input
                className="form-input opacity-90"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                readOnly
              />
            </div>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Profile changes are managed by your account administrator. Authentication and user records remain on the existing backend.
          </p>
        </GlassCard>
      </div>
    </>
  );
};

export default Profile;
