import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuthStore} from "../../../store/useAuthStore";
import {useTheme} from "../../../hooks/useTheme";
import {adminNavItems, employeeNavItems} from "../../../utils/navigation";
import {listNotifications, updateNotification} from "../../../services/notifications.service";
import {useUiStore} from "../../../store/useUiStore";
import Avatar from "../../ui/Avatar/Avatar";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 12.8A8 8 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
    <path d="M9 17a3 3 0 0 0 6 0" />
  </svg>
);

const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const {theme, toggleTheme} = useTheme();
  const pushToast = useUiStore((state) => state.pushToast);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const panelRef = useRef(null);

  const navItems = isAdmin ? adminNavItems : employeeNavItems;
  const userId = user?.id || user?._id;
  const canReadNotifications =
    isAdmin || (user?.permissions || []).includes("notifications:read");

  const fetchNotifications = () => {
    if (!userId || !canReadNotifications) return;
    setLoadingNotifications(true);
    listNotifications({limit: 6, userId})
      .then((res) => setNotifications(res.data.items || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifications(false));
  };

  useEffect(() => {
    fetchNotifications();
    if (!canReadNotifications) return undefined;
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, canReadNotifications]);

  useEffect(() => {
    if (!openNotifications) return;
    const handleClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpenNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openNotifications]);

  const unreadCount = notifications.filter((note) => !note.read).length;

  const markRead = async (note) => {
    if (note.read) return;
    try {
      await updateNotification(note._id, {read: true});
      setNotifications((prev) =>
        prev.map((item) => (item._id === note._id ? {...item, read: true} : item))
      );
    } catch (err) {
      pushToast({type: "error", message: "Unable to mark notification"});
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((note) => !note.read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((note) => updateNotification(note._id, {read: true})));
      setNotifications((prev) => prev.map((note) => ({...note, read: true})));
      pushToast({type: "success", message: "Notifications cleared"});
    } catch (err) {
      pushToast({type: "error", message: "Unable to clear notifications"});
    }
  };

  return (
    <header className="flex flex-col gap-4 border-b border-default pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Overview</p>
        <h2 className="text-2xl font-semibold">Operations Command</h2>
      </div>
      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
        <div className="lg:hidden">
          <select
            className="ghost-input"
            value={location.pathname}
            onChange={(event) => navigate(event.target.value)}
          >
            {navItems.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <input
          className="ghost-input max-w-xs"
          placeholder={isAdmin ? "Search people, projects, tasks" : "Search tasks, projects"}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigate(`/search?q=${encodeURIComponent(search)}`);
            }
          }}
        />
        <div className="relative" ref={panelRef}>
          <button
            className="panel-strong flex h-10 w-10 items-center justify-center text-primary"
            onClick={() => {
              setOpenNotifications((prev) => !prev);
              fetchNotifications();
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <BellIcon />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
          {openNotifications ? (
            <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-default surface-card shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <button className="text-xs text-accent" onClick={markAllRead}>
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
                      className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-[color:rgb(var(--surface-hover))]"
                      onClick={() => markRead(note)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">{note.title}</p>
                        {!note.read ? <span className="text-[10px] text-accent">NEW</span> : null}
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
          className="panel-strong flex h-10 w-10 items-center justify-center text-primary"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="panel-strong flex items-center gap-3 px-4 py-2">
          <Avatar src={user?.avatar} name={user?.name} size="md" />
          <div>
            <p className="text-sm font-semibold">{user?.name || "Admin"}</p>
            <p className="text-xs text-secondary">{roleName || "Administrator"}</p>
          </div>
        </div>
        <button
          className="hidden rounded-xl border border-default px-4 py-2 text-xs uppercase tracking-[0.2em] text-secondary transition hover:border-accent/40 hover:text-primary lg:inline-flex"
          onClick={() => {
            clearAuth();
            navigate("/login");
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
