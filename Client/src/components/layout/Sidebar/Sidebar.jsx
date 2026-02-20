import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { adminNavItems, employeeNavItems } from "../../../utils/navigation";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:gap-6 lg:px-6 lg:py-8">
      <div className="panel-strong px-5 py-4">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">RPS</p>
        <p className="mt-2 text-sm text-secondary">
          {isAdmin ? "Admin command center" : "Employee workspace"}
        </p>
      </div>
      <nav className="panel flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-accent/20 text-accent"
                  : "text-secondary hover:bg-[color:rgb(var(--surface-hover))] hover:text-primary"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="panel-strong px-5 py-4 text-sm text-secondary">
        <p className="font-semibold text-primary">Need help?</p>
        <p className="mt-2">Support is active for Admin tier accounts.</p>
        <button className="mt-3 w-full rounded-xl border border-accent/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent/10">
          Contact support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
