import {useEffect, useState} from "react";
import {getDashboard} from "../../../services/dashboard.service";
import Card from "../../../components/ui/Card/Card";
import UtilizationChart from "../../../components/charts/UtilizationChart/UtilizationChart";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Badge from "../../../components/ui/Badge/Badge";
import Avatar from "../../../components/ui/Avatar/Avatar";
import {
  utilizationSeries,
  currentProjects as sampleProjects,
  resourceAvailability as sampleAvailability,
  recentAssignments as sampleAssignments,
} from "../../../data/sampleData";

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => {
        setDashboard(res.data.data);
      })
      .catch(() => {
        setDashboard({
          kpis: {
            totalEmployees: 42,
            activeProjects: 7,
            availableResources: 12,
            utilizationRate: 76,
          },
          currentProjects: sampleProjects,
          resourceAvailability: sampleAvailability,
          recentAssignments: sampleAssignments,
        });
      });
  }, []);

  const kpis = dashboard?.kpis || {
    totalEmployees: "--",
    activeProjects: "--",
    availableResources: "--",
    utilizationRate: "--",
  };

  const projectColumns = [
    {key: "name", label: "Project"},
    {key: "client", label: "Client", render: (row) => row.clientName || row.client},
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "active" || row.status === "Active" ? "success" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {key: "priority", label: "Priority"},
  ];

  const availabilityColumns = [
    {
      key: "name",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.employeeId?.avatar} name={row.employeeId?.name || row.name} size="sm" />
          <span>{row.employeeId?.name || row.name}</span>
        </div>
      ),
    },
    {
      key: "designation",
      label: "Role",
      render: (row) => row.employeeId?.designation || row.designation,
    },
    {
      key: "availability",
      label: "Available",
      render: (row) => {
        const value = row.availablePercent ?? row.availability;
        return typeof value === "number" ? `${value}%` : value;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          tone={
            row.workloadStatus === "available" || row.status === "Available"
              ? "success"
              : row.workloadStatus === "overloaded" || row.status === "Overloaded"
                ? "danger"
                : "warning"
          }
        >
          {row.workloadStatus || row.status}
        </Badge>
      ),
    },
  ];

  const assignmentColumns = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.employeeId?.avatar} name={row.employeeId?.name || row.employee} size="sm" />
          <span>{row.employeeId?.name || row.employee}</span>
        </div>
      ),
    },
    {key: "project", label: "Project", render: (row) => row.projectId?.name || row.project},
    {key: "role", label: "Role", render: (row) => row.role || "Contributor"},
  ];

  const deadlineColumns = [
    {key: "name", label: "Item"},
    {key: "clientName", label: "Project/Client"},
    {
      key: "type",
      label: "Type",
      render: (row) => row.type || "project",
    },
    {
      key: "endDate",
      label: "Deadline",
      render: (row) => (row.endDate ? new Date(row.endDate).toLocaleDateString() : "-"),
    },
  ];

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total employees" value={kpis.totalEmployees} meta="Active staff" />
        <Card title="Active projects" value={kpis.activeProjects} meta="Delivery phase" />
        <Card title="Available resources" value={kpis.availableResources} meta="Ready for work" />
        <Card title="Utilization rate" value={`${kpis.utilizationRate}%`} meta="Last 30 days" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current projects</h3>
              <button className="text-xs uppercase tracking-[0.2em] text-accent">View all</button>
            </div>
            <DataTable columns={projectColumns} rows={dashboard?.currentProjects || []} />
          </div>
          <UtilizationChart data={utilizationSeries} />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Resource availability</h3>
              <button className="text-xs uppercase tracking-[0.2em] text-accent">Filter</button>
            </div>
            <DataTable columns={availabilityColumns} rows={dashboard?.resourceAvailability || []} />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent assignments</h3>
              <button className="text-xs uppercase tracking-[0.2em] text-accent">Export</button>
            </div>
            <DataTable columns={assignmentColumns} rows={dashboard?.recentAssignments || []} />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming deadlines</h3>
              <button className="text-xs uppercase tracking-[0.2em] text-accent">View all</button>
            </div>
            <DataTable columns={deadlineColumns} rows={dashboard?.upcomingDeadlines || []} />
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;



