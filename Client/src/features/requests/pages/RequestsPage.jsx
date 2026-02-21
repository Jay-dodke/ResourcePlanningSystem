import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import Button from "../../../shared/ui/Button";
import Badge from "../../../shared/ui/Badge";
import Alert from "../../../shared/ui/Alert";
import Modal from "../../../shared/ui/Modal";
import {useUiStore} from "../../../store/useUiStore";
import {useAuthStore} from "../../../store/useAuthStore";
import Avatar from "../../../shared/ui/Avatar";
import {useAvatarStore} from "../../../store/useAvatarStore";
import {getErrorMessage} from "../../../shared/utils/errors";
import {
  approveProjectRequest,
  listProjectRequests,
  rejectProjectRequest,
} from "../../requests/requests.service";
import {listProjects} from "../../projects/projects.service";
import {createAllocation} from "../../allocations/allocations.service";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({status: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignForm, setAssignForm] = useState({
    projectId: "",
    role: "",
    allocationPercent: 50,
    startDate: "",
    endDate: "",
    billable: true,
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [projects, setProjects] = useState([]);
  const pushToast = useUiStore((state) => state.pushToast);
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const avatarOverrides = useAvatarStore((state) => state.overrides);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchRequests = useCallback((overrideFilters) => {
    const active = overrideFilters || filtersRef.current;
    setLoading(true);
    listProjectRequests({
      limit: 30,
      status: active.status || undefined,
    })
      .then((res) => {
        setRequests(res.data.items || []);
        setError("");
      })
      .catch((err) => {
        setRequests([]);
        setError(getErrorMessage(err, "Unable to load requests"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchRequests();
    listProjects({limit: 500})
      .then((res) => setProjects(res.data.items || []))
      .catch(() => setProjects([]));
  }, [fetchRequests, isAdmin]);

  const updateFilter = (event) => {
    setFilters((prev) => ({...prev, status: event.target.value}));
  };

  const toDateTimeInput = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "";
    const pad = (num) => String(num).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const openAssignModal = (request) => {
    setAssignTarget(request);
    setAssignForm({
      projectId: "",
      role: "",
      allocationPercent: 50,
      startDate: toDateTimeInput(new Date()),
      endDate: toDateTimeInput(addDays(30)),
      billable: true,
    });
    setAssignError("");
    setAssignOpen(true);
  };

  const closeAssignModal = () => {
    setAssignOpen(false);
    setAssignTarget(null);
    setAssignError("");
  };

  const handleDecision = async (request, decision) => {
    try {
      setActionId(request._id);
      setError("");
      if (decision === "approve") {
        await approveProjectRequest(request._id);
        pushToast({type: "success", message: "Exit request approved"});
        fetchRequests();
        openAssignModal(request);
      } else {
        await rejectProjectRequest(request._id);
        pushToast({type: "success", message: "Exit request rejected"});
        fetchRequests();
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update request"));
    } finally {
      setActionId(null);
    }
  };

  const assignEmployee = async (event) => {
    event.preventDefault();
    if (!assignTarget) return;
    if (!assignForm.projectId || !assignForm.role || !assignForm.startDate || !assignForm.endDate) {
      setAssignError("Please complete all required fields.");
      return;
    }
    try {
      setAssignLoading(true);
      setAssignError("");
      await createAllocation({
        employeeId: assignTarget.employeeId?._id || assignTarget.employeeId,
        projectId: assignForm.projectId,
        role: assignForm.role,
        allocationPercent: Number(assignForm.allocationPercent || 0),
        billable: Boolean(assignForm.billable),
        startDate: assignForm.startDate,
        endDate: assignForm.endDate,
      });
      pushToast({type: "success", message: "Employee reassigned"});
      closeAssignModal();
      fetchRequests();
    } catch (err) {
      setAssignError(getErrorMessage(err, "Unable to assign project"));
    } finally {
      setAssignLoading(false);
    }
  };

  const assignTitle = useMemo(() => {
    if (!assignTarget) return "Assign new project";
    return `Assign ${assignTarget.employeeId?.name || "employee"}`;
  }, [assignTarget]);

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={avatarOverrides[row.employeeId?._id] || row.employeeId?.avatar}
            name={row.employeeId?.name}
            size="sm"
          />
          <span>{row.employeeId?.name || "-"}</span>
        </div>
      ),
    },
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {key: "reason", label: "Reason", render: (row) => row.reason || "-"},
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          tone={
            row.status === "approved"
              ? "success"
              : row.status === "rejected"
                ? "danger"
                : "warning"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "submitted",
      label: "Submitted",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        row.status === "pending" ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={actionId === row._id}
              onClick={() => handleDecision(row, "approve")}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              disabled={actionId === row._id}
              onClick={() => handleDecision(row, "reject")}
            >
              Reject
            </Button>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  if (!isAdmin) {
    return (
      <section className="flex flex-col gap-4">
        <PageHeader eyebrow="Operations" title="Project exit requests" />
        <Alert tone="warning">You do not have access to this page.</Alert>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Operations" title="Project exit requests" />
      <div className="panel p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select className="ghost-input" value={filters.status} onChange={updateFilter}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => fetchRequests(filters)}>
              Apply filters
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const cleared = {status: ""};
                setFilters(cleared);
                fetchRequests(cleared);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={requests}
        emptyState={loading ? "Loading requests..." : "No requests found."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Modal
        open={assignOpen}
        title={assignTitle}
        onClose={closeAssignModal}
        footer={
          <>
            <Button variant="ghost" onClick={closeAssignModal} disabled={assignLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={assignEmployee} disabled={assignLoading}>
              {assignLoading ? "Assigning..." : "Assign project"}
            </Button>
          </>
        }
      >
        <form className="grid gap-3" onSubmit={assignEmployee}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Employee</p>
            <p className="text-sm font-semibold text-primary">
              {assignTarget?.employeeId?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Project</label>
            <select
              className="ghost-input mt-2"
              value={assignForm.projectId}
              onChange={(event) =>
                setAssignForm((prev) => ({...prev, projectId: event.target.value}))
              }
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-secondary">Role</label>
              <input
                className="ghost-input mt-2"
                value={assignForm.role}
                onChange={(event) =>
                  setAssignForm((prev) => ({...prev, role: event.target.value}))
                }
                placeholder="e.g. Frontend Engineer"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-secondary">
                Allocation %
              </label>
              <input
                className="ghost-input mt-2"
                type="number"
                min="0"
                max="100"
                value={assignForm.allocationPercent}
                onChange={(event) =>
                  setAssignForm((prev) => ({...prev, allocationPercent: event.target.value}))
                }
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-secondary">
                Start date
              </label>
              <input
                className="ghost-input mt-2"
                type="datetime-local"
                value={assignForm.startDate}
                onChange={(event) =>
                  setAssignForm((prev) => ({...prev, startDate: event.target.value}))
                }
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-secondary">
                End date
              </label>
              <input
                className="ghost-input mt-2"
                type="datetime-local"
                value={assignForm.endDate}
                onChange={(event) =>
                  setAssignForm((prev) => ({...prev, endDate: event.target.value}))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              checked={assignForm.billable}
              onChange={(event) =>
                setAssignForm((prev) => ({...prev, billable: event.target.checked}))
              }
            />
            Billable assignment
          </label>
          {assignError ? <Alert tone="error">{assignError}</Alert> : null}
        </form>
      </Modal>
    </section>
  );
};

export default RequestsPage;




