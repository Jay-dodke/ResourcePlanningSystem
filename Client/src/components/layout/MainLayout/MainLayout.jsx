import {Outlet} from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import Footer from "../Footer/Footer";
import ForcePasswordChange from "../../auth/ForcePasswordChange/ForcePasswordChange";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <ForcePasswordChange />
      <Sidebar />
      <main className="flex-1 px-6 py-8 lg:px-10">
        <Topbar />
        <div className="mt-8 flex flex-col gap-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;



