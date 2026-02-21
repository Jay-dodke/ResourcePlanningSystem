import {useEffect, useState} from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import Card from "../../../shared/ui/Card";
import UtilizationChart from "../../../shared/components/UtilizationChart";
import {getAnalytics} from "../../analytics/analytics.service";
import {utilizationSeries} from "../../../shared/data/sampleData";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then((res) => {
        setError("");
        setSummary(res.data.data?.summary || null);
      })
      .catch((err) => {
        setSummary(null);
        setError(getErrorMessage(err, "Unable to load analytics"));
      });
  }, []);

  const stats = summary || {
    totalEmployees: "--",
    activeProjects: "--",
    totalTasks: "--",
    openTasks: "--",
    utilizationRate: "--",
    availableResources: "--",
    overloadedResources: "--",
    pendingLeaves: "--",
  };

  return (
    <section className="flex flex-col gap-6">
      <PageHeader eyebrow="Insights" title="Resource analytics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1440px]:grid-cols-4">
        <Card title="Total employees" value={stats.totalEmployees} meta="Active workforce" />
        <Card title="Active projects" value={stats.activeProjects} meta="Delivery in motion" />
        <Card title="Open tasks" value={stats.openTasks} meta="Backlog health" />
        <Card title="Utilization rate" value={`${stats.utilizationRate}%`} meta="Last 30 days" />
        <Card title="Available resources" value={stats.availableResources} meta="Ready to assign" />
        <Card title="Overloaded" value={stats.overloadedResources} meta="At risk" />
        <Card title="Total tasks" value={stats.totalTasks} meta="Across projects" />
        <Card title="Pending leave" value={stats.pendingLeaves} meta="Awaiting approval" />
      </div>
      <UtilizationChart data={utilizationSeries} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default AnalyticsPage;







