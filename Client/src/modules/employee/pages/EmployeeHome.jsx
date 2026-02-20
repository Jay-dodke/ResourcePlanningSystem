import {useEffect, useMemo, useState} from "react";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";
import Modal from "../../../components/ui/Modal/Modal";
import Alert from "../../../components/ui/Alert/Alert";
import Avatar from "../../../components/ui/Avatar/Avatar";
import {getMe} from "../../../services/auth.service";
import {listAllocationsByEmployee, listAllocationsByProject} from "../../../services/allocations.service";
import {listNotifications} from "../../../services/notifications.service";
import {listAvailability} from "../../../services/availability.service";
import {listMyTasks} from "../../../services/tasks.service";
import {createProjectRequest, listMyProjectRequests} from "../../../services/projectRequests.service";
import {useUiStore} from "../../../store/useUiStore";
import {getErrorMessage} from "../../../utils/errors";

const EmployeeHome = () => {
  const [user, setUser] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestError, setRequestError] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [targetAllocation, setTargetAllocation] = useState(null);
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  const userId = user?.id || user?._id;

  const fetchRequests = () => {
    if (!userId) return;
    listMyProjectRequests({limit: 50})
      .then((res) => setRequests(res.data.items || []))
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    if (!userId) return;
    listAllocationsByEmployee(userId)
      .then((res) => {
        setAllocations(res.data.items || []);
      })
      .catch(() => setAllocations([]));

    listNotifications({limit: 6, userId})
      .then((res) => setNotifications(res.data.items || []))
      .catch(() => setNotifications([]));

    listAvailability({employeeId: userId})
      .then((res) => setAvailability(res.data.items?.[0] || null))
      .catch(() => setAvailability(null));

    listMyTasks({limit: 5})
      .then((res) => setTasks(res.data.items || []))
      .catch(() => setTasks([]));

    fetchRequests();
  }, [userId]);

  useEffect(() => {
    const projectIds = Array.from(
      new Set(
        allocations
          .map((allocation) => allocation.projectId?._id)
          .filter(Boolean)
      )
    );

    if (projectIds.length === 0) {
      setTeamMembers([]);
      return;
    }

    Promise.all(projectIds.map((projectId) => listAllocationsByProject(projectId)))
      .then((responses) => {
        const merged = new Map();
        responses.forEach((res) => {
          (res.data.items || []).forEach((item) => {
            const key = `${item.employeeId?._id || item.employeeId}-${item.projectId?._id || item.projectId}`;
            merged.set(key, item);
          });
        });
        setTeamMembers(Array.from(merged.values()));
      })
      .catch(() => setTeamMembers([]));
  }, [allocations]);

  const requestByAllocationId = useMemo(() => {
    const map = new Map();
    requests.forEach((request) => {
      const key = request.allocationId?._id || request.allocationId;
      if (!key) return;
      const id = String(key);
      if (!map.has(id)) {
        map.set(id, request);
      }
    });
    return map;
  }, [requests]);

  const deadlineRows = useMemo(() => {
    return allocations.map((allocation) => ({
      id: allocation._id,
      project: allocation.projectId?.name || "-",
      role: allocation.role,
      deadline: allocation.endDate,
    }));
  }, [allocations]);

  const openRequestModal = (allocation) => {
    setTargetAllocation(allocation);
    setReason("");
    setRequestError("");
    setIsModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setTargetAllocation(null);
    setReason("");
  };

  const submitRequest = async (event) => {
    event?.preventDefault();
    if (!targetAllocation) return;
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 5) {
      setRequestError("Please provide a short reason (min 5 characters).");
      return;
    }
    try {
      setRequestLoading(true);
      setRequestError("");
      await createProjectRequest({
        projectId: targetAllocation.projectId?._id || targetAllocation.projectId,
        allocationId: targetAllocation._id,
        reason: trimmedReason,
      });
      pushToast({type: "success", message: "Leave request submitted"});
      closeRequestModal();
      fetchRequests();
    } catch (err) {
      setRequestError(getErrorMessage(err, "Unable to submit request"));
    } finally {
      setRequestLoading(false);
    }
  };

  const projectColumns = [
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {key: "role", label: "Role"},
    {key: "allocation", label: "Allocation", render: (row) => `${row.allocationPercent}%`},
    {
      key: "request",
      label: "Leave status",
      render: (row) => {
        const request = requestByAllocationId.get(String(row._id));
        if (!request) {
          return <Badge tone="neutral">Active</Badge>;
        }
        const tone =
          request.status === "approved"
            ? "success"
            : request.status === "rejected"
              ? "danger"
              : "warning";
        return <Badge tone={tone}>{request.status}</Badge>;
      },
    },
    {
      key: "action",
      label: "Action",
      render: (row) => {
        const request = requestByAllocationId.get(String(row._id));
        if (request?.status === "pending") {
          return (
            <Button variant="outline" disabled>
              Pending
            </Button>
          );
        }
        if (request?.status === "rejected") {
          return (
            <Button variant="outline" onClick={() => openRequestModal(row)}>
              Request again
            </Button>
          );
        }
        return (
          <Button variant="primary" onClick={() => openRequestModal(row)}>
            Request leave
          </Button>
        );
      },
    },
  ];

  const teamColumns = [
    {
      key: "member",
      label: "Team member",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.employeeId?.avatar} name={row.employeeId?.name} size="sm" />
          <span>{row.employeeId?.name || "-"}</span>
        </div>
      ),
    },
    {key: "role", label: "Role", render: (row) => row.role || "-"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
  ];

  const deadlineColumns = [
    {key: "project", label: "Project"},
    {key: "role", label: "Role"},
    {
      key: "deadline",
      label: "Deadline",
      render: (row) => (row.deadline ? new Date(row.deadline).toLocaleDateString() : "-")
    },
  ];

  const taskColumns = [
    {key: "title", label: "Task"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {key: "status", label: "Status"},
    {
      key: "due",
      label: "Due",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <PageHeader eyebrow="My workspace" title="My Projects & Assignments" />
      <div className="grid gap-4 md:grid-cols-3">
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
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Active projects</p>
          <p className="mt-3 text-2xl font-semibold">{allocations.length}</p>
          <p className="mt-2 text-xs text-secondary">Assignments in progress</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Notifications</p>
          <p className="mt-3 text-2xl font-semibold">{notifications.length}</p>
          <p className="mt-2 text-xs text-secondary">Unread updates</p>
        </div>
      </div>

      <div id="projects">
        <h3 className="mb-3 text-lg font-semibold">My Projects</h3>
        <DataTable columns={projectColumns} rows={allocations} emptyState="No projects assigned." />
      </div>

      <div id="team">
        <h3 className="mb-3 text-lg font-semibold">My Team</h3>
        <DataTable columns={teamColumns} rows={teamMembers} emptyState="No team data yet." />
      </div>

      <div id="deadlines">
        <h3 className="mb-3 text-lg font-semibold">Deadlines</h3>
        <DataTable columns={deadlineColumns} rows={deadlineRows} emptyState="No deadlines available." />
      </div>

      <div id="tasks">
        <h3 className="mb-3 text-lg font-semibold">My Tasks</h3>
        <DataTable columns={taskColumns} rows={tasks} emptyState="No tasks assigned." />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Notifications</h3>
        <div className="grid gap-4">
          {notifications.map((note) => (
            <div key={note._id} className="panel px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="text-sm text-secondary">{note.message}</p>
                </div>
                <span className="text-xs text-secondary">
                  {note.read ? "Read" : "New"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title="Request leave from project"
        onClose={closeRequestModal}
        footer={
          <>
            <Button variant="ghost" onClick={closeRequestModal} disabled={requestLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitRequest} disabled={requestLoading}>
              {requestLoading ? "Submitting..." : "Submit request"}
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Project</p>
            <p className="text-sm font-semibold">{targetAllocation?.projectId?.name || "-"}</p>
          </div>
          <textarea
            className="ghost-input min-h-[120px]"
            placeholder="Reason for leaving this project"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          {requestError ? <Alert tone="error">{requestError}</Alert> : null}
        </div>
      </Modal>
    </section>
  );
};

export default EmployeeHome;



