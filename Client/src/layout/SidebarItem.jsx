import {NavLink} from "react-router-dom";
import clsx from "clsx";

const SidebarItem = ({to, label, icon: Icon, collapsed}) => {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      title={label}
      className={({isActive}) =>
        clsx(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          collapsed ? "justify-center" : "justify-start",
          isActive
            ? "bg-[color:rgb(var(--surface-hover))] text-primary shadow-sm"
            : "text-secondary hover:bg-[color:rgb(var(--surface-hover))] hover:text-primary"
        )
      }
    >
      {({isActive}) => (
        <>
          <span
            className={clsx(
              "absolute left-0 top-2 h-[calc(100%-16px)] w-1 rounded-r-full bg-[color:rgb(var(--accent-strong))] transition-opacity",
              isActive ? "opacity-100" : "opacity-0"
            )}
          />
          {Icon ? (
            <Icon
              className={clsx(
                "h-5 w-5",
                isActive ? "text-[color:rgb(var(--accent-strong))]" : "text-secondary group-hover:text-primary"
              )}
            />
          ) : null}
          <span
            className={clsx(
              "truncate transition-all",
              collapsed
                ? "sm:opacity-0 sm:w-0 sm:translate-x-2 sm:group-hover/sidebar:opacity-100 sm:group-hover/sidebar:w-auto sm:group-hover/sidebar:translate-x-0"
                : ""
            )}
          >
            {label}
          </span>
          {collapsed ? (
            <span
              className={clsx(
                "pointer-events-none absolute left-full ml-3 rounded-md border border-default bg-secondary px-2.5 py-1 text-xs text-primary opacity-0 shadow-sm transition-opacity",
                "group-hover:opacity-100 sm:group-hover/sidebar:opacity-0"
              )}
            >
              {label}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;



