import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import clsx from "clsx";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import Footer from "../Footer/Footer";
import ForcePasswordChange from "../../auth/ForcePasswordChange/ForcePasswordChange";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");

    const syncCollapse = () => {
      if (desktop.matches) {
        setCollapsed(false);
        setMobileOpen(false);
      } else if (tablet.matches) {
        setCollapsed(true);
        setMobileOpen(false);
      } else {
        setCollapsed(true);
      }
    };

    syncCollapse();
    desktop.addEventListener("change", syncCollapse);
    tablet.addEventListener("change", syncCollapse);
    return () => {
      desktop.removeEventListener("change", syncCollapse);
      tablet.removeEventListener("change", syncCollapse);
    };
  }, []);

  const handleSidebarToggle = () => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width < 640) {
      setMobileOpen(true);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="app-shell">
      <ForcePasswordChange />
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main
        className={clsx(
          "flex-1 h-screen overflow-y-auto transition-[padding] duration-200 ease-out",
          collapsed ? "sm:pl-[72px] sm:peer-hover:pl-[260px]" : "sm:pl-[260px]"
        )}
      >
        <Topbar onToggleSidebar={handleSidebarToggle} />
        <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6 xl:px-8 pb-10">
          <div className="mt-6 flex flex-col gap-6 sm:mt-8">
            <Outlet />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
