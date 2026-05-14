import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import Button from "../components/ui/Button";
import FloatingInput from "../components/ui/FloatingInput";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.35),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(34,211,238,0.2),_transparent_40%)]" />
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
                "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(79,70,229,0.55), rgba(6,182,212,0.35)), url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80')"
            }}
          />
          <div className="relative z-10">
            <BrandLogo />
            <div className="mt-12 max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Premium team operations
              </div>
              <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight">Ship work with clarity, speed, and calm.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                A focused surface for projects, priorities, and accountability — inspired by the best productivity suites.
              </p>
            </div>
          </div>
          <p className="relative z-10 text-xs text-white/55">TaskFlow Pro · Team Task Manager</p>
        </motion.section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl sm:rounded-3xl sm:p-10"
          >
            <div className="lg:hidden">
              <BrandLogo />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">Sign in</h1>
            <p className="mt-2 text-sm text-slate-400">Welcome back — pick up where your team left off.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FloatingInput label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <FloatingInput
                label="Password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                showToggle
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in…" : "Continue"}
              </Button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-400">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-violet-300 hover:text-white">
                Create an account
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default Login;
