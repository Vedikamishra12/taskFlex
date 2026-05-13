import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Shield, UserCog } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import Button from "../components/ui/Button";
import FloatingInput from "../components/ui/FloatingInput";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.35),_transparent_55%),radial-gradient(circle_at_10%_80%,_rgba(34,211,238,0.15),_transparent_45%)]" />
      <div className="grid min-h-screen lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(109,40,217,0.5), rgba(34,211,238,0.3)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')"
            }}
          />
          <div className="relative z-10 max-w-lg">
            <BrandLogo />
            <h2 className="mt-12 text-4xl font-extrabold leading-tight">Start your workspace in minutes</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Choose how you collaborate — members focus on delivery while admins orchestrate projects and assignments.
            </p>
            <div className="mt-10 grid gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <UserCog className="h-8 w-8 text-cyan-300" />
                  <div>
                    <p className="font-semibold">Member</p>
                    <p className="text-xs text-white/70">Own assigned tasks and update status as work moves.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-violet-300" />
                  <div>
                    <p className="font-semibold">Admin</p>
                    <p className="text-xs text-white/70">Create projects, invite people, and shape the portfolio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="relative z-10 text-xs text-white/55">Secure auth · Same APIs as production</p>
        </motion.section>

        <section className="flex items-center justify-center px-4 py-12 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl sm:p-10"
          >
            <div className="lg:hidden">
              <BrandLogo />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">Create account</h1>
            <p className="mt-2 text-sm text-slate-400">Join your team&apos;s command center.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FloatingInput label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <FloatingInput label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <FloatingInput
                label="Password (min 6 characters)"
                type="password"
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                showToggle
              />
              <div>
                <span className="form-label">Role</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "member", label: "Member", hint: "Execute tasks" },
                    { id: "admin", label: "Admin", hint: "Manage workspace" }
                  ].map((r) => (
                    <label
                      key={r.id}
                      className={`cursor-pointer rounded-2xl border px-4 py-3 transition-all ${
                        form.role === r.id
                          ? "border-violet-400/50 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 ring-2 ring-violet-500/30"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        className="sr-only"
                        value={r.id}
                        checked={form.role === r.id}
                        onChange={() => setForm({ ...form, role: r.id })}
                      />
                      <p className="text-sm font-bold text-white">{r.label}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{r.hint}</p>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating…" : "Sign up"}
              </Button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-violet-300 hover:text-white">
                Log in
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
