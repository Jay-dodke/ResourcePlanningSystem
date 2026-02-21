import clsx from "clsx";
import { useAuthStore } from "../../../store/useAuthStore";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import logo from "../../../assets/react.svg";

const Icon = ({ children, className }) => (
  <svg
    viewBox="0 0 24 24"
    className={clsx("h-5 w-5", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const LayoutGridIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);

const UsersIcon = (props) => (
  <Icon {...props}>
    <path d="M9 11a4 4 0 1 0-0.01-8 4 4 0 0 0 0.01 8Z" />
    <path d="M17 13a3.5 3.5 0 1 0 0-7" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M15 20a5 5 0 0 0-3-4" />
  </Icon>
);

const HomeIcon = (props) => (
  <Icon {...props}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20h14v-9.5" />
  </Icon>
);

const FolderIcon = (props) => (
  <Icon {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </Icon>
);

const CheckSquareIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

const PieChartIcon = (props) => (
  <Icon {...props}>
    <path d="M11 3a9 9 0 1 0 9 9h-9Z" />
    <path d="M12 3v9h9" />
  </Icon>
);

const ActivityIcon = (props) => (
  <Icon {...props}>
    <path d="M3 12h4l2-5 4 10 2-5h4" />
  </Icon>
);

const BuildingIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 7h2M7 11h2M7 15h2M11 7h2M11 11h2M11 15h2M15 7h2M15 11h2M15 15h2" />
  </Icon>
);

const SparklesIcon = (props) => (
  <Icon {...props}>
    <path d="m12 2 1.8 4.6L19 8l-5.2 1.4L12 14l-1.8-4.6L5 8l5.2-1.4L12 2Z" />
  </Icon>
);

const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

const CalendarIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18" />
  </Icon>
);

const CalendarMinusIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18M9 15h6" />
  </Icon>
);

const BarChartIcon = (props) => (
  <Icon {...props}>
    <path d="M3 3v18h18" />
    <rect x="7" y="12" width="3" height="6" rx="1" />
    <rect x="12" y="8" width="3" height="10" rx="1" />
    <rect x="17" y="5" width="3" height="13" rx="1" />
  </Icon>
);

const InboxIcon = (props) => (
  <Icon {...props}>
    <path d="M4 4h16v12h-5l-2 3h-2l-2-3H4Z" />
    <path d="M4 12h4" />
  </Icon>
);

const FileTextIcon = (props) => (
  <Icon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h8M8 9h2" />
  </Icon>
);

const BellIcon = (props) => (
  <Icon {...props}>
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
    <path d="M9 17a3 3 0 0 0 6 0" />
  </Icon>
);

const ShieldCheckIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2 19 5v6c0 5-3.5 9-7 11-3.5-2-7-6-7-11V5Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

const KeyIcon = (props) => (
  <Icon {...props}>
    <circle cx="7.5" cy="10.5" r="3.5" />
    <path d="M11 10.5h10v3h-3v3h-3v3" />
  </Icon>
);

const SettingsIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

const ListChecksIcon = (props) => (
  <Icon {...props}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="m3 6 1 1 2-2" />
    <path d="m3 12 1 1 2-2" />
    <path d="m3 18 1 1 2-2" />
  </Icon>
);

const adminSections = [
  {
    title: "Main",
    items: [{ label: "Dashboard", path: "/", icon: LayoutGridIcon }],
  },
  {
    title: "Workforce",
    items: [
      { label: "Employees", path: "/employees", icon: UsersIcon },
      { label: "Departments", path: "/departments", icon: BuildingIcon },
      { label: "Skills", path: "/skills", icon: SparklesIcon },
      { label: "Availability", path: "/availability", icon: ActivityIcon },
    ],
  },
  {
    title: "Projects",
    items: [
      { label: "Projects", path: "/projects", icon: FolderIcon },
      { label: "Allocations", path: "/allocations", icon: PieChartIcon },
      { label: "Tasks", path: "/tasks", icon: CheckSquareIcon },
      { label: "Requests", path: "/requests", icon: InboxIcon },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Timesheets", path: "/timesheets", icon: ClockIcon },
      { label: "Leave", path: "/leaves", icon: CalendarMinusIcon },
      { label: "Calendar", path: "/calendar", icon: CalendarIcon },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", path: "/analytics", icon: BarChartIcon },
      { label: "Reports", path: "/reports", icon: FileTextIcon },
      { label: "Notifications", path: "/notifications", icon: BellIcon },
      { label: "Audit", path: "/audit", icon: ShieldCheckIcon },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Roles", path: "/roles", icon: KeyIcon },
      { label: "Settings", path: "/settings", icon: SettingsIcon },
    ],
  },
];

const employeeSections = [
  {
    title: "Workspace",
    items: [
      { label: "My Overview", path: "/me", icon: HomeIcon },
      { label: "My Planning", path: "/my-planning", icon: PieChartIcon },
      { label: "My Tasks", path: "/my-tasks", icon: ListChecksIcon },
      { label: "My Team", path: "/my-team", icon: UsersIcon },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Timesheets", path: "/timesheets", icon: ClockIcon },
      { label: "Leave", path: "/leaves", icon: CalendarMinusIcon },
      { label: "Calendar", path: "/calendar", icon: CalendarIcon },
    ],
  },
  {
    title: "Insights",
    items: [{ label: "Notifications", path: "/notifications", icon: BellIcon }],
  },
];

const SidebarContent = ({
  collapsed,
  sections,
  subtitle,
  onToggleCollapse,
  showToggle,
  showSupport = true,
  fixLayout = false,
  onClose,
}) => {
  return (
    <div className={clsx("flex h-full flex-col", fixLayout && "min-h-0")}>
      <div
        className={clsx(
          "flex items-center justify-between gap-3 px-4 pb-5 pt-6",
          fixLayout && "shrink-0"
        )}
      >
        <div className={clsx("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-default bg-secondary">
            <img src={logo} alt="RPS logo" className="h-6 w-6" />
          </div>
          <div className={clsx("min-w-0", collapsed && "sr-only")}>
            <p className="text-sm font-semibold text-primary">EXI</p>
            <p className="text-xs text-secondary">{subtitle}</p>
          </div>
        </div>
        {showToggle ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-default text-secondary transition hover:text-primary sm:flex lg:hidden"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon className={clsx("transition-transform", collapsed ? "rotate-180" : "rotate-0")}>
              <path d="m15 18-6-6 6-6" />
            </Icon>
          </button>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 items-center justify-center rounded-full border border-default text-secondary transition hover:text-primary sm:hidden"
            aria-label="Close sidebar"
          >
            <Icon>
              <path d="M6 6l12 12M18 6l-12 12" />
            </Icon>
          </button>
        ) : null}
      </div>

      <div
        className={clsx(
          "flex-1 space-y-6 overflow-y-auto px-3 pb-6",
          fixLayout && "min-h-0 scrollbar-hidden"
        )}
      >
        {sections.map((section) => (
          <SidebarSection key={section.title} title={section.title} collapsed={collapsed}>
            {section.items.map((item) => (
              <SidebarItem
                key={item.path}
                to={item.path}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed}
              />
            ))}
          </SidebarSection>
        ))}
      </div>

      {showSupport ? (
        <div className={clsx("mt-auto border-t border-default px-4 py-4", fixLayout && "shrink-0")}>
          <p className={clsx("text-sm font-semibold text-primary", collapsed && "sr-only")}>
            Need help?
          </p>
          <p className={clsx("mt-2 text-xs text-secondary", collapsed && "sr-only")}>
            Support is active for Admin tier accounts.
          </p>
          <button
            onClick={() => {
              window.location.href = "mailto:jaydodke74@gmail.com";
            }}
            className={clsx(
              "mt-3 w-full rounded-xl border border-default px-4 py-2 text-xs uppercase tracking-[0.2em] text-secondary transition hover:border-[color:rgb(var(--accent-strong))] hover:text-primary",
              collapsed && "sr-only"
            )}
          >
            Contact support
          </button>
        </div>
      ) : null}
    </div>
  );
};

const Sidebar = ({ collapsed = false, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const sections = isAdmin ? adminSections : employeeSections;
  const subtitle = isAdmin ? "Admin Center" : "Employee Workspace";

  return (
    <>
      <aside
        className={clsx(
          "fixed left-0 top-0 z-40 hidden h-screen border-r border-default bg-secondary shadow-sm sm:flex peer group/sidebar",
          "transition-[width] duration-200 ease-out",
          collapsed ? "sm:w-[72px] sm:hover:w-[260px]" : "sm:w-[260px]"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          sections={sections}
          subtitle={subtitle}
          onToggleCollapse={onToggleCollapse}
          showToggle
          showSupport={!isAdmin}
          fixLayout={isAdmin}
        />
      </aside>

      <div
        className={clsx(
          "fixed inset-0 z-40 sm:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-slate-900/35 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-[260px] border-r border-default bg-secondary transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent
            collapsed={false}
            sections={sections}
            subtitle={subtitle}
            onToggleCollapse={onToggleCollapse}
            showToggle={false}
            onClose={onCloseMobile}
            showSupport={!isAdmin}
            fixLayout={isAdmin}
          />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
