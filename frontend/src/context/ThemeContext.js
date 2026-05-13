import { createContext, useContext, useEffect, useMemo, useState } from "react";

const themes = [
  { id: "aurora", label: "Aurora", swatch: "bg-gradient-to-br from-indigo-400 to-cyan-400" },
  { id: "ember", label: "Ember", swatch: "bg-gradient-to-br from-orange-400 to-rose-500" },
  { id: "forest", label: "Forest", swatch: "bg-gradient-to-br from-emerald-400 to-teal-400" },
  { id: "violet", label: "Violet", swatch: "bg-gradient-to-br from-violet-500 to-fuchsia-500" }
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "aurora");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, themes }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
