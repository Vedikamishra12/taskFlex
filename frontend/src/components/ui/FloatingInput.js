import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FloatingInput = ({
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  disabled,
  className = "",
  autoComplete,
  showToggle = false
}) => {
  const id = useId();
  const [show, setShow] = useState(false);
  const inputType = showToggle && type === "password" ? (show ? "text" : "password") : type;

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder=" "
        className={`peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 pb-2.5 pt-6 text-sm text-white placeholder-transparent shadow-inner shadow-black/20 outline-none transition-all focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50 ${showToggle && type === "password" ? "pr-12" : ""}`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:text-slate-500 peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:text-violet-300"
      >
        {label}
      </label>
      {showToggle && type === "password" && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};

export default FloatingInput;
