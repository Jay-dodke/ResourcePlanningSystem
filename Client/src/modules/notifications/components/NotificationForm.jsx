import {useEffect, useState} from "react";
import Button from "../../../components/ui/Button/Button";
import {listRoles} from "../../../services/roles.service";
import {listUsers} from "../../../services/users.service";

const NotificationForm = ({onSubmit, loading}) => {
  const [targetType, setTargetType] = useState("all");
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [form, setForm] = useState({title: "", message: "", type: "info", roleId: ""});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    listRoles({limit: 100}).then((res) => setRoles(res.data.items || [])).catch(() => setRoles([]));
    listUsers({limit: 200}).then((res) => setUsers(res.data.items || [])).catch(() => setUsers([]));
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title) nextErrors.title = "Title is required";
    if (!form.message) nextErrors.message = "Message is required";
    if (targetType === "role" && !form.roleId) nextErrors.roleId = "Select a role";
    if (targetType === "users" && selectedUsers.length === 0) {
      nextErrors.users = "Select at least one employee";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      title: form.title,
      message: form.message,
      type: form.type,
      targetType,
      roleId: targetType === "role" ? form.roleId : undefined,
      userIds: targetType === "users" ? selectedUsers : undefined,
    });
  };

  return (
    <form className="panel p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Title</label>
          <input className="ghost-input mt-2" value={form.title} onChange={updateField("title")} />
          {errors.title ? <p className="mt-1 text-xs text-danger">{errors.title}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Type</label>
          <select className="ghost-input mt-2" value={form.type} onChange={updateField("type")}>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Message</label>
          <textarea
            className="ghost-input mt-2 min-h-[120px]"
            value={form.message}
            onChange={updateField("message")}
          />
          {errors.message ? <p className="mt-1 text-xs text-danger">{errors.message}</p> : null}
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Target</p>
        <div className="flex flex-wrap gap-3">
          {["all", "role", "users"].map((type) => (
            <button
              key={type}
              type="button"
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                targetType === type
                  ? "border-accent/70 text-accent"
                  : "border-default text-secondary"
              }`}
              onClick={() => setTargetType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {targetType === "role" && (
          <div>
            <select className="ghost-input" value={form.roleId} onChange={updateField("roleId")}
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId ? <p className="mt-1 text-xs text-danger">{errors.roleId}</p> : null}
          </div>
        )}
        {targetType === "users" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-2 text-sm text-secondary">
                <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => toggleUser(user._id)} />
                {user.name} ({user.email})
              </label>
            ))}
            {errors.users ? <p className="text-xs text-danger">{errors.users}</p> : null}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Sending..." : "Send notification"}
        </Button>
      </div>
    </form>
  );
};

export default NotificationForm;



