import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useAvatarStore } from "../../../store/useAvatarStore";
import { useTheme } from "../../../hooks/useTheme";
import { adminNavItems, employeeNavItems } from "../../../utils/navigation";
import { listNotifications, updateNotification } from "../../../services/notifications.service";
import { useUiStore } from "../../../store/useUiStore";
import Avatar from "../../ui/Avatar/Avatar";

const Icon = ({ children, className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
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

const MenuIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icon>
);

const SearchIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

const BellIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
    <path d="M9 17a3 3 0 0 0 6 0" />
  </Icon>
);

const SunIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </Icon>
);

const MoonIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M21 12.8A8 8 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
  </Icon>
);

const LogOutIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </Icon>
);

const ChevronDownIcon = ({ className }) => (
  <Icon className={className}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

const UserIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M12 12a4 4 0 1 0-0.01-8 4 4 0 0 0 0.01 8Z" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </Icon>
);

const SettingsIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

const sectionByPrefix = {
  "/": "Overview",
  "/employees": "Workforce",
  "/departments": "Workforce",
  "/skills": "Workforce",
  "/availability": "Workforce",
  "/projects": "Projects",
  "/allocations": "Projects",
  "/tasks": "Projects",
  "/requests": "Projects",
  "/timesheets": "Operations",
  "/leaves": "Operations",
  "/calendar": "Operations",
  "/analytics": "Insights",
  "/reports": "Insights",
  "/notifications": "Insights",
  "/audit": "Insights",
  "/roles": "System",
  "/settings": "System",
  "/me": "Workspace",
  "/my-planning": "Workspace",
  "/my-tasks": "Workspace",
  "/my-team": "Workspace",
  "/search": "Insights",
};

const singularByPrefix = {
  "/employees": "Employee",
  "/projects": "Project",
  "/tasks": "Task",
  "/allocations": "Allocation",
  "/requests": "Request",
  "/departments": "Department",
  "/skills": "Skill",
  "/timesheets": "Timesheet",
  "/leaves": "Leave",
};

const resolvePageContext = (pathname, navItems, isAdmin) => {
  if (pathname === "/") {
    return { section: "MAIN", title: "Dashboard" };
  }

  const parts = pathname.split("/").filter(Boolean);
  const basePath = parts.length ? `/${parts[0]}` : "/";
  const titleLookup = navItems.reduce((acc, item) => {
    acc[item.path] = item.label;
    return acc;
  }, {});

  let title = titleLookup[basePath] || "Overview";
  const section = sectionByPrefix[basePath] || (isAdmin ? "Overview" : "Workspace");

  if (basePath === "/search") {
    title = "Search";
  }

  if (parts[1] === "new" && singularByPrefix[basePath]) {
    title = `New ${singularByPrefix[basePath]}`;
  } else if (parts.includes("edit") && singularByPrefix[basePath]) {
    title = `Edit ${singularByPrefix[basePath]}`;
  }

  return { section, title };
};

const Topbar = ({ onToggleSidebar }) => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const avatarOverrides = useAvatarStore((state) => state.overrides);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pushToast = useUiStore((state) => state.pushToast);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const panelRef = useRef(null);
  const profileRef = useRef(null);

  const navItems = isAdmin ? adminNavItems : employeeNavItems;
  const userId = user?.id || user?._id;
  const avatarSrc = userId ? avatarOverrides[String(userId)] || user?.avatar : user?.avatar;
  const canReadNotifications = isAdmin || (user?.permissions || []).includes("notifications:read");

  const pageContext = useMemo(
    () => resolvePageContext(location.pathname, navItems, isAdmin),
    [location.pathname, navItems, isAdmin]
  );

  const fetchNotifications = useCallback(() => {
    if (!userId || !canReadNotifications) return;
    setLoadingNotifications(true);
    listNotifications({ limit: 6, userId })
      .then((res) => setNotifications(res.data.items || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifications(false));
  }, [userId, canReadNotifications]);

  useEffect(() => {
    fetchNotifications();
    if (!canReadNotifications) return undefined;
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, canReadNotifications]);

  useEffect(() => {
    if (!openNotifications && !profileOpen) return;
    const handleClick = (event) => {
      if (panelRef.current && panelRef.current.contains(event.target)) return;
      if (profileRef.current && profileRef.current.contains(event.target)) return;
      setOpenNotifications(false);
      setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openNotifications, profileOpen]);

  const unreadCount = notifications.filter((note) => !note.read).length;

  const handleSignOut = () => {
    clearAuth();
    navigate("/login");
  };

  const handleSearchSubmit = (value) => {
    const query = value.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setMobileSearchOpen(false);
  };

  const markRead = async (note) => {
    if (note.read) return;
    try {
      await updateNotification(note._id, { read: true });
      setNotifications((prev) =>
        prev.map((item) => (item._id === note._id ? { ...item, read: true } : item))
      );
    } catch {
      pushToast({ type: "error", message: "Unable to mark notification" });
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((note) => !note.read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((note) => updateNotification(note._id, { read: true })));
      setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
      pushToast({ type: "success", message: "Notifications cleared" });
    } catch {
      pushToast({ type: "error", message: "Unable to clear notifications" });
    }
  };

  const iconButtonClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-default bg-secondary text-secondary transition hover:bg-[color:rgb(var(--surface-hover))] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:h-9 sm:w-9";

  const menuItemBase =
    "flex w-full items-center gap-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";
  const menuItemActive = "bg-[color:rgb(var(--surface-hover))] text-primary";
  const menuItemInactive =
    "text-secondary hover:bg-[color:rgb(var(--surface-hover))] hover:text-primary";

  const isProfileActive = location.pathname === "/me" || location.pathname.startsWith("/me/");
  const isSettingsActive = location.pathname.startsWith("/settings");

  const layoutContainer = "mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6 xl:px-8";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-default bg-secondary shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className={`flex h-16 w-full items-center justify-between gap-4 ${layoutContainer}`}>
        <div className="flex min-w-0 items-center gap-3">
          <button
            className={`${iconButtonClass} lg:hidden`}
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
            type="button"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary">
              {pageContext.section}
            </p>
            <h1 className="truncate text-lg font-semibold text-primary sm:text-xl lg:text-2xl">
              {pageContext.title}
            </h1>
          </div>
        </div>

        <div className="hidden flex-1 justify-center px-4 sm:flex">
          <div className="relative w-full max-w-[280px] lg:max-w-[420px]">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              className="w-full rounded-full border border-default bg-[color:rgb(var(--surface-hover))] py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Search people, projects, tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit(search);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`${iconButtonClass} sm:hidden`}
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
            type="button"
          >
            <SearchIcon className="h-4 w-4" />
          </button>

          <div className="relative" ref={panelRef}>
            <button
              className={iconButtonClass}
              onClick={() => {
                setOpenNotifications((prev) => !prev);
                setProfileOpen(false);
                fetchNotifications();
              }}
              title="Notifications"
              aria-label="Notifications"
              type="button"
            >
              <BellIcon className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>
            {openNotifications ? (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-default bg-secondary shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-sm font-semibold text-primary">Notifications</p>
                  <button
                    className="text-xs font-semibold text-secondary transition hover:text-primary"
                    onClick={markAllRead}
                    type="button"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-[color:rgb(var(--border-default))]">
                  {loadingNotifications ? (
                    <div className="px-4 py-4 text-sm text-secondary">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-secondary">No notifications yet.</div>
                  ) : (
                    notifications.map((note) => (
                      <button
                        key={note._id}
                        className="flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-[color:rgb(var(--surface-hover))]"
                        onClick={() => markRead(note)}
                        type="button"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-primary">{note.title}</p>
                          {!note.read ? (
                            <span className="text-[10px] font-semibold text-accent">NEW</span>
                          ) : null}
                        </div>
                        <p className="text-xs text-secondary">{note.message}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <button
            className={iconButtonClass}
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
            type="button"
          >
            {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              className="flex min-h-[44px] items-center gap-2 rounded-full border border-default bg-secondary px-3 py-2 text-left text-primary transition hover:bg-[color:rgb(var(--surface-hover))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:min-h-0 sm:px-2.5 sm:py-1.5"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setOpenNotifications(false);
              }}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              type="button"
            >
              <Avatar src={avatarSrc} name={user?.name} size="sm" />
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-semibold">{user?.name || "Admin User"}</span>
                <span className="text-xs text-secondary">{roleName || "Administrator"}</span>
              </div>
              <ChevronDownIcon className="hidden h-4 w-4 text-secondary sm:block" />
            </button>

            {profileOpen ? (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-default bg-secondary shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
                role="menu"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-primary">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-secondary">{user?.email || "admin@rps.local"}</p>
                </div>
                <div className="border-t border-default py-2">
                  <button
                    className={`${menuItemBase} ${isProfileActive ? menuItemActive : menuItemInactive}`}
                    onClick={() => {
                      navigate("/me");
                      setProfileOpen(false);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </button>
                  <button
                    className={`${menuItemBase} ${isSettingsActive ? menuItemActive : menuItemInactive}`}
                    onClick={() => {
                      navigate("/settings");
                      setProfileOpen(false);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    Account Settings
                  </button>
                  <button
                    className={`${menuItemBase} ${menuItemInactive}`}
                    onClick={handleSignOut}
                    role="menuitem"
                    type="button"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobileSearchOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={() => setMobileSearchOpen(false)}
          />
          <div className="absolute left-0 right-0 top-3 px-4">
            <div className="rounded-2xl border border-default bg-secondary p-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                <input
                  className="w-full rounded-full border border-default bg-[color:rgb(var(--surface-hover))] py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Search people, projects, tasks..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearchSubmit(search);
                    }
                  }}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Topbar;
