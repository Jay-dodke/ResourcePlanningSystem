import {useCallback, useEffect, useState} from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import NotificationForm from "../components/NotificationForm";
import {listNotifications, createNotification, updateNotification} from "../../notifications/notifications.service";
import {useAuthStore} from "../../../store/useAuthStore";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const userId = user?.id || user?._id;
  const pushToast = useUiStore((state) => state.pushToast);

  const fetchNotifications = useCallback(() => {
    setLoading(true);
    listNotifications({limit: 20, userId: isAdmin ? undefined : userId})
      .then((res) => {
        setNotifications(res.data.items || []);
      })
      .catch((err) => {
        setNotifications([]);
        setError(getErrorMessage(err, "Unable to load notifications"));
      })
      .finally(() => setLoading(false));
  }, [isAdmin, userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      setError("");
      await createNotification(payload);
      pushToast({type: "success", message: "Notification sent"});
      fetchNotifications();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to send notification"));
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      setError("");
      await updateNotification(id, {read: true});
      fetchNotifications();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update notification"));
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Comms"
        title="Notifications"
        action={<Button variant="primary" onClick={fetchNotifications}>Refresh</Button>}
      />
      {isAdmin ? <NotificationForm onSubmit={handleCreate} loading={loading} /> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div className="grid gap-4">
        {notifications.map((note) => (
          <div key={note._id} className="panel px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{note.title}</p>
                <p className="text-sm text-secondary">{note.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-secondary">
                  {note.read ? "Read" : "New"}
                </span>
                {!note.read ? (
                  <Button variant="ghost" onClick={() => markRead(note._id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="panel px-5 py-6 text-center text-sm text-secondary">
            No notifications yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default NotificationsPage;







