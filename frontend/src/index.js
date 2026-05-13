import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3200,
              className: "!bg-slate-900/95 !text-slate-100 !border !border-white/10 !rounded-2xl !shadow-2xl !backdrop-blur-xl",
              success: { iconTheme: { primary: "#34d399", secondary: "#0f172a" } },
              error: { iconTheme: { primary: "#f87171", secondary: "#0f172a" } }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
