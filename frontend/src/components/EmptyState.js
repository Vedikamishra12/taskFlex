import { motion } from "framer-motion";

const EmptyState = ({ title, message, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center shadow-inner shadow-black/20 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-violet-500/10">
          {Icon ? (
            <Icon className="h-9 w-9 text-violet-300" />
          ) : (
            <svg viewBox="0 0 120 120" className="h-20 w-20 text-violet-400/80" aria-hidden>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <rect x="12" y="24" width="96" height="72" rx="14" fill="url(#g)" opacity="0.25" />
              <rect x="22" y="38" width="44" height="8" rx="4" fill="currentColor" opacity="0.35" />
              <rect x="22" y="54" width="76" height="8" rx="4" fill="currentColor" opacity="0.2" />
              <circle cx="88" cy="44" r="10" fill="#22d3ee" opacity="0.6" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{message}</p>
      </div>
    </motion.div>
  );
};

export default EmptyState;
