import {useEffect, useState} from "react";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";
import Alert from "../../../components/ui/Alert/Alert";
import {useUiStore} from "../../../store/useUiStore";
import {useAuthStore} from "../../../store/useAuthStore";
import Avatar from "../../../components/ui/Avatar/Avatar";
import {getErrorMessage} from "../../../utils/errors";
import {
  approveProjectRequest,
  listProjectRequests,
  rejectProjectRequest,
} from "../../../services/projectRequests.service";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({status: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const pushToast = useUiStore((state) => state.pushToast);
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";

  const fetchRequests = (overrideFilters) => {
    const active = overrideFilters || filters;
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
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchRequests();
  }, [isAdmin]);

  const updateFilter = (event) => {
    setFilters((prev) => ({...prev, status: event.target.value}));
  };

  const handleDecision = async (id, decision) => {
    try {
      setActionId(id);
      setError("");
      if (decision === "approve") {
        await approveProjectRequest(id);
        pushToast({type: "success", message: "Request approved"});
      } else {
        await rejectProjectRequest(id);
        pushToast({type: "success", message: "Request rejected"});
      }
      fetchRequests();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update request"));
    } finally {
      setActionId(null);
    }
  };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.employeeId?.avatar} name={row.employeeId?.name} size="sm" />
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
            row.status === "approved" ? "success" : row.status === "rejected" ? "danger" : "warning"
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
              onClick={() => handleDecision(row._id, "approve")}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              disabled={actionId === row._id}
              onClick={() => handleDecision(row._id, "reject")}
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
        <PageHeader eyebrow="Operations" title="Project leave requests" />
        <Alert tone="warning">You do not have access to this page.</Alert>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Operations" title="Project leave requests" />
      <div className="panel p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select className="ghost-input" value={filters.status} onChange={updateFilter}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex gap-3">
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
    </section>
  );
};

export default RequestsPage;
