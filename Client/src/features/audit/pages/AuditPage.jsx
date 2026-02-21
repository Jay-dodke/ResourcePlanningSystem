import {useEffect, useState} from "react";
import {listAuditLogs} from "../../audit/audit.service";
import PageHeader from "../../../shared/ui/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    listAuditLogs({limit: 50})
      .then((res) => {
        setError("");
        setLogs(res.data.items || []);
      })
      .catch((err) => {
        setLogs([]);
        setError(getErrorMessage(err, "Unable to load audit logs"));
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {key: "action", label: "Action"},
    {key: "entity", label: "Entity"},
    {key: "entityId", label: "Entity ID"},
    {key: "actor", label: "Actor", render: (row) => row.actorId?.email || "System"},
    {
      key: "date",
      label: "When",
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Compliance" title="Audit history" />
      <DataTable columns={columns} rows={logs} emptyState={loading ? "Loading audit logs..." : "No audit logs yet."} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default AuditPage;







