import {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import DataTable from "../../../shared/components/DataTable";
import Badge from "../../../shared/ui/Badge";
import Alert from "../../../shared/ui/Alert";
import Modal from "../../../shared/ui/Modal";
import Avatar from "../../../shared/ui/Avatar";
import {getUser, resetUserPassword, uploadUserAvatar} from "../../employees/employees.service";
import {listAllocationsByEmployee, createAllocation} from "../../allocations/allocations.service";
import {listTasks, createTask} from "../../tasks/tasks.service";
import {listAvailability, upsertAvailability} from "../../availability/availability.service";
import {listLeaves} from "../../leaves/leaves.service";
import {listAuditLogs} from "../../audit/audit.service";
import {listProjects} from "../../projects/projects.service";
import {useUiStore} from "../../../store/useUiStore";
import {useAuthStore} from "../../../store/useAuthStore";
import {useAvatarStore} from "../../../store/useAvatarStore";
import {getErrorMessage} from "../../../shared/utils/errors";

const EmployeeProfile = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const pushToast = useUiStore((state) => state.pushToast);
  const currentUser = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const avatarOverrides = useAvatarStore((state) => state.overrides);
  const setAvatarOverride = useAvatarStore((state) => state.setAvatarOverride);
  const currentRole = currentUser?.role || currentUser?.roleId?.name || currentUser?.roleId;
  const isAdmin = currentRole?.toLowerCase() === "admin";

  const [user, setUser] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [allocationForm, setAllocationForm] = useState({
    projectId: "",
    role: "Contributor",
    allocationPercent: 25,
    billable: true,
    startDate: "",
    endDate: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    projectId: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });
  const [capacity, setCapacity] = useState(100);
  const [savingCapacity, setSavingCapacity] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetResult, setResetResult] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const fetchProfile = useCallback(() => {
    setLoading(true);
    Promise.all([
      getUser(id),
      listAllocationsByEmployee(id),
      listTasks({assigneeId: id, limit: 20}),
      listAvailability({employeeId: id}),
      listLeaves({employeeId: id, limit: 10}),
      listAuditLogs({actorId: id, limit: 10}),
      listProjects({limit: 200}),
    ])
      .then((responses) => {
        setUser(responses[0].data.data);
        setAllocations(responses[1].data.items || []);
        setTasks(responses[2].data.items || []);
        setAvailability(responses[3].data.items?.[0] || null);
        setLeaves(responses[4].data.items || []);
        setAuditLogs(responses[5].data.items || []);
        setProjects(responses[6].data.items || []);
        setError("");
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Unable to load employee profile"));
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (availability?.capacityPercent != null) {
      setCapacity(availability.capacityPercent);
    }
  }, [availability]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setAvatarUploading(true);
      const response = await uploadUserAvatar(id, file);
      const updated = response.data.data;
      if (updated?.avatar) {
        setAvatarOverride(id, updated.avatar);
      }
      if (currentUser && String(currentUser.id || currentUser._id) === String(id)) {
        setAuth({
          user: {...currentUser, avatar: updated?.avatar || currentUser.avatar},
          accessToken,
          refreshToken,
        });
      }
      pushToast({type: "success", message: "Profile photo updated"});
      fetchProfile();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to upload photo"));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAssignProject = async (event) => {
    event.preventDefault();
    if (!allocationForm.projectId || !allocationForm.startDate || !allocationForm.endDate) return;
    try {
      setError("");
      await createAllocation({
        employeeId: id,
        projectId: allocationForm.projectId,
        role: allocationForm.role,
        allocationPercent: Number(allocationForm.allocationPercent),
        billable: allocationForm.billable,
        startDate: new Date(allocationForm.startDate).toISOString(),
        endDate: new Date(allocationForm.endDate).toISOString(),
      });
      pushToast({type: "success", message: "Employee assigned to project"});
      setAllocationForm({
        projectId: "",
        role: "Contributor",
        allocationPercent: 25,
        billable: true,
        startDate: "",
        endDate: "",
      });
      fetchProfile();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to assign project"));
    }
  };

  const handleAssignTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title || !taskForm.projectId) {
      setError("Task title and project are required");
      return;
    }
    try {
      setError("");
      await createTask({
        title: taskForm.title,
        projectId: taskForm.projectId,
        priority: taskForm.priority,
        status: taskForm.status,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined,
        assigneeId: id,
      });
      pushToast({type: "success", message: "Task assigned"});
      setTaskForm({title: "", projectId: "", priority: "medium", status: "todo", dueDate: ""});
      fetchProfile();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to assign task"));
    }
  };

  const handleCapacityUpdate = async () => {
    try {
      setSavingCapacity(true);
      const used = availability ? availability.capacityPercent - availability.availablePercent : 0;
      const nextAvailable = Math.max(0, Number(capacity) - used);
      await upsertAvailability({
        employeeId: id,
        capacityPercent: Number(capacity),
        availablePercent: nextAvailable,
      });
      pushToast({type: "success", message: "Capacity updated"});
      fetchProfile();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update capacity"));
    } finally {
      setSavingCapacity(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResetLoading(true);
      const payload = resetPasswordValue ? {password: resetPasswordValue} : {};
      const response = await resetUserPassword(id, payload);
      setResetResult(response.data.data?.temporaryPassword || "");
      pushToast({type: "success", message: "Password reset"});
    } catch (err) {
      setError(getErrorMessage(err, "Unable to reset password"));
    } finally {
      setResetLoading(false);
    }
  };

  const activeLeave = useMemo(() => {
    const today = new Date();
    return (leaves || []).find((leave) => {
      if (leave.status !== "approved") return false;
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return start <= today && end >= today;
    });
  }, [leaves]);

  const allocationColumns = [
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {key: "role", label: "Role", render: (row) => row.role},
    {key: "allocation", label: "Allocation", render: (row) => `${row.allocationPercent}%`},
    {
      key: "dates",
      label: "Dates",
      render: (row) =>
        row.startDate && row.endDate
          ? `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`
          : "-",
    },
  ];

  const taskColumns = [
    {key: "title", label: "Task"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "done" ? "success" : row.status === "blocked" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "due",
      label: "Due",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"),
    },
  ];

  const leaveColumns = [
    {key: "type", label: "Type"},
    {
      key: "range",
      label: "Dates",
      render: (row) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "approved" ? "success" : row.status === "rejected" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const auditColumns = [
    {key: "action", label: "Action"},
    {
      key: "date",
      label: "Date",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"),
    },
  ];

  if (loading && !user) {
    return <div className="panel p-6 text-sm text-secondary">Loading profile...</div>;
  }

  if (!user) {
    return <Alert tone="error">Employee not found.</Alert>;
  }

  const avatarSrc = avatarOverrides[user?._id] || user?.avatar;

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        eyebrow="People"
        title="Employee 360°"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => navigate("/employees")}>Back to list</Button>
            <Button variant="outline" onClick={() => navigate(`/employees/${id}/edit`)}>Edit profile</Button>
          </div>
        }
      />

      <div className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={avatarSrc} name={user.name} size="xl" />
            <div>
              <h3 className="text-xl font-semibold text-primary">{user.name}</h3>
              <p className="text-sm text-secondary">{user.email}</p>
              <p className="text-xs text-secondary">
                {user.designation || "No designation"} • Manager: {user.managerId?.name || "Unassigned"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="neutral">{user.roleId?.name || user.role || "Employee"}</Badge>
                <Badge tone="neutral">{user.departmentId?.name || "No department"}</Badge>
                <Badge tone={user.status === "active" ? "success" : user.status === "inactive" ? "warning" : "danger"}>
                  {user.status}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.skills || []).length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill.name || skill} tone="neutral">
                      {typeof skill === "string" ? skill : `${skill.name} • ${skill.level || 3}`}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-secondary">No skills recorded</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Upload new photo</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={avatarUploading} />
            {isAdmin ? (
              <Button variant="outline" onClick={() => setResetModalOpen(true)}>Reset password</Button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Availability</p>
            <p className="mt-3 text-2xl font-semibold">
              {availability ? `${availability.availablePercent}%` : "--"}
            </p>
            <Badge
              className="mt-3"
              tone={
                availability?.workloadStatus === "available"
                  ? "success"
                  : availability?.workloadStatus === "overloaded"
                    ? "danger"
                    : "warning"
              }
            >
              {availability?.workloadStatus || "unknown"}
            </Badge>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Capacity</p>
            <p className="mt-3 text-2xl font-semibold">
              {availability?.capacityPercent ?? "--"}%
            </p>
            <p className="mt-2 text-xs text-secondary">Weekly capacity</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Active projects</p>
            <p className="mt-3 text-2xl font-semibold">{allocations.length}</p>
            <p className="mt-2 text-xs text-secondary">Current assignments</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Leave status</p>
            <p className="mt-3 text-2xl font-semibold">{activeLeave ? "On leave" : "Available"}</p>
            <p className="mt-2 text-xs text-secondary">
              {activeLeave ? `${activeLeave.type} leave` : "No active leave"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Projects & allocations</h3>
            <DataTable columns={allocationColumns} rows={allocations} emptyState="No allocations found." />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Tasks</h3>
            <DataTable columns={taskColumns} rows={tasks} emptyState="No tasks assigned." />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Leave history</h3>
            <DataTable columns={leaveColumns} rows={leaves} emptyState="No leave history." />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Activity history</h3>
            <DataTable columns={auditColumns} rows={auditLogs} emptyState="No recent activity." />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {isAdmin ? (
            <>
              <div className="panel p-5">
                <h4 className="text-sm font-semibold">Assign to project</h4>
                <form className="mt-4 grid gap-3" onSubmit={handleAssignProject}>
                  <select
                    className="ghost-input"
                    value={allocationForm.projectId}
                    onChange={(event) => setAllocationForm((prev) => ({...prev, projectId: event.target.value}))}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="ghost-input"
                    placeholder="Role"
                    value={allocationForm.role}
                    onChange={(event) => setAllocationForm((prev) => ({...prev, role: event.target.value}))}
                  />
                  <input
                    className="ghost-input"
                    type="number"
                    min="1"
                    max="100"
                    value={allocationForm.allocationPercent}
                    onChange={(event) => setAllocationForm((prev) => ({...prev, allocationPercent: event.target.value}))}
                  />
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <input
                      type="checkbox"
                      checked={allocationForm.billable}
                      onChange={(event) => setAllocationForm((prev) => ({...prev, billable: event.target.checked}))}
                    />
                    Billable
                  </div>
                  <input
                    className="ghost-input"
                    type="date"
                    value={allocationForm.startDate}
                    onChange={(event) => setAllocationForm((prev) => ({...prev, startDate: event.target.value}))}
                  />
                  <input
                    className="ghost-input"
                    type="date"
                    value={allocationForm.endDate}
                    onChange={(event) => setAllocationForm((prev) => ({...prev, endDate: event.target.value}))}
                  />
                  <Button type="submit" variant="primary">Assign project</Button>
                </form>
              </div>

              <div className="panel p-5">
                <h4 className="text-sm font-semibold">Assign task</h4>
                <form className="mt-4 grid gap-3" onSubmit={handleAssignTask}>
                  <input
                    className="ghost-input"
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={(event) => setTaskForm((prev) => ({...prev, title: event.target.value}))}
                  />
                  <select
                    className="ghost-input"
                    value={taskForm.projectId}
                    onChange={(event) => setTaskForm((prev) => ({...prev, projectId: event.target.value}))}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="ghost-input"
                    value={taskForm.priority}
                    onChange={(event) => setTaskForm((prev) => ({...prev, priority: event.target.value}))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select
                    className="ghost-input"
                    value={taskForm.status}
                    onChange={(event) => setTaskForm((prev) => ({...prev, status: event.target.value}))}
                  >
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                  <input
                    className="ghost-input"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm((prev) => ({...prev, dueDate: event.target.value}))}
                  />
                  <Button type="submit" variant="primary">Assign task</Button>
                </form>
              </div>

              <div className="panel p-5">
                <h4 className="text-sm font-semibold">Update capacity</h4>
                <div className="mt-4 grid gap-3">
                  <input
                    className="ghost-input"
                    type="number"
                    min="0"
                    max="100"
                    value={capacity}
                    onChange={(event) => setCapacity(event.target.value)}
                  />
                  <Button variant="outline" disabled={savingCapacity} onClick={handleCapacityUpdate}>
                    {savingCapacity ? "Saving..." : "Save capacity"}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}

      <Modal
        open={resetModalOpen}
        title="Reset password"
        onClose={() => {
          setResetModalOpen(false);
          setResetPasswordValue("");
          setResetResult("");
        }}
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetModalOpen(false)} disabled={resetLoading}>
              Close
            </Button>
            <Button variant="primary" onClick={handleResetPassword} disabled={resetLoading}>
              {resetLoading ? "Resetting..." : "Reset password"}
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <p className="text-sm text-secondary">
            Provide a new password or leave blank to generate a temporary password.
          </p>
          <input
            className="ghost-input"
            placeholder="New password (optional)"
            type="text"
            value={resetPasswordValue}
            onChange={(event) => setResetPasswordValue(event.target.value)}
          />
          {resetResult ? (
            <Alert tone="success">Temporary password: {resetResult}</Alert>
          ) : null}
        </div>
      </Modal>
    </section>
  );
};

export default EmployeeProfile;





