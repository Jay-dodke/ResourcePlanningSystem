import {useEffect, useState} from "react";
import {listLeaves, createLeave, updateLeave} from "../../../services/leaves.service";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";
import DataTable from "../../../components/tables/DataTable/DataTable";
import {useAuthStore} from "../../../store/useAuthStore";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({type: "annual", startDate: "", endDate: "", reason: ""});
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  const fetchLeaves = () => {
    setLoading(true);
    listLeaves({limit: 20})
      .then((res) => setLeaves(res.data.items || []))
      .catch((err) => {
        setLeaves([]);
        setError(getErrorMessage(err, "Unable to load leave requests"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  const submitLeave = async (event) => {
    event.preventDefault();
    if (!form.startDate || !form.endDate) return;
    const startIso = new Date(form.startDate).toISOString();
    const endIso = new Date(form.endDate).toISOString();
    try {
      setError("");
      await createLeave({
        type: form.type,
        startDate: startIso,
        endDate: endIso,
        reason: form.reason,
      });
      pushToast({type: "success", message: "Leave request submitted"});
      setForm({type: "annual", startDate: "", endDate: "", reason: ""});
      fetchLeaves();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to request leave"));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await updateLeave(id, {status});
      pushToast({type: "success", message: `Leave ${status}`});
      fetchLeaves();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update leave"));
    }
  };

  const columns = [
    {key: "employee", label: "Employee", render: (row) => row.employeeId?.name || "-"},
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
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        isAdmin ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => updateStatus(row._id, "approved")}>Approve</Button>
            <Button variant="ghost" onClick={() => updateStatus(row._id, "rejected")}>Reject</Button>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="People" title="Leave requests" />
      <form className="panel p-5 grid gap-3 md:grid-cols-4" onSubmit={submitLeave}>
        <select className="ghost-input" value={form.type} onChange={updateField("type")}>
          <option value="annual">Annual</option>
          <option value="sick">Sick</option>
          <option value="unpaid">Unpaid</option>
          <option value="other">Other</option>
        </select>
        <input className="ghost-input" type="date" value={form.startDate} onChange={updateField("startDate")} />
        <input className="ghost-input" type="date" value={form.endDate} onChange={updateField("endDate")} />
        <Button type="submit" variant="primary">Request leave</Button>
        <textarea
          className="ghost-input md:col-span-4"
          placeholder="Reason"
          value={form.reason}
          onChange={updateField("reason")}
        />
      </form>
      <DataTable columns={columns} rows={leaves} emptyState={loading ? "Loading leaves..." : "No leave requests."} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default LeavesPage;



