import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell flex min-h-screen min-w-0">
      <Sidebar mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-72">
        <Navbar onOpenSidebar={() => setMobileNavOpen(true)} />
        <main className="relative min-w-0 flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
