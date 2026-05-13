const variants = {
  primary:
    "bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "border border-white/10 bg-white/5 text-slate-100 backdrop-blur-sm hover:bg-white/10 hover:border-white/15",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  danger:
    "bg-red-500/20 text-red-200 ring-1 ring-red-500/40 hover:bg-red-500/30 hover:ring-red-400/50"
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-xl",
  md: "px-4 py-2.5 text-sm rounded-2xl",
  lg: "px-5 py-3 text-sm rounded-2xl"
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
