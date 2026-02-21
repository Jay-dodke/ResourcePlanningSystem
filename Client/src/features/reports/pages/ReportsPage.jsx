import {useEffect, useState} from "react";
import {
  utilizationReport,
  exportUtilizationCsv,
  exportEmployeesCsv,
  exportProjectsCsv,
  exportAllocationsCsv,
  exportTasksCsv,
} from "../../reports/reports.service";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import DataTable from "../../../shared/components/DataTable";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const ReportsPage = () => {
  const [utilization, setUtilization] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setLoading(true);
    utilizationReport()
      .then((res) => {
        setError("");
        setUtilization(res.data.data || []);
      })
      .catch((err) => {
        setUtilization([]);
        setError(getErrorMessage(err, "Unable to load reports"));
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => row.employee?.name || "-",
    },
    {key: "totalAllocation", label: "Total Allocation", render: (row) => `${row.totalAllocation}%`},
    {key: "assignments", label: "Assignments"},
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Insights"
        title="Reports & analytics"
        action={<Button variant="primary">Generate report</Button>}
      />
      <div className="panel p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Utilization summary</p>
            <p className="text-xs text-secondary">Live allocation totals by employee.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                exportUtilizationCsv().then((res) => downloadBlob(res.data, "utilization.csv"))
              }
            >
              Utilization CSV
            </Button>
            <Button
              variant="ghost"
              onClick={() => exportEmployeesCsv().then((res) => downloadBlob(res.data, "employees.csv"))}
            >
              Employees CSV
            </Button>
            <Button
              variant="ghost"
              onClick={() => exportProjectsCsv().then((res) => downloadBlob(res.data, "projects.csv"))}
            >
              Projects CSV
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                exportAllocationsCsv().then((res) => downloadBlob(res.data, "allocations.csv"))
              }
            >
              Allocations CSV
            </Button>
            <Button
              variant="ghost"
              onClick={() => exportTasksCsv().then((res) => downloadBlob(res.data, "tasks.csv"))}
            >
              Tasks CSV
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={utilization}
        emptyState={loading ? "Loading report..." : "No report data."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default ReportsPage;







