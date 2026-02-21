import {useEffect, useState} from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import DataTable from "../../../shared/components/DataTable";
import Badge from "../../../shared/ui/Badge";
import {listTasks} from "../../tasks/tasks.service";
import {listAllocations} from "../../allocations/allocations.service";
import {listLeaves} from "../../leaves/leaves.service";
import {listProjects} from "../../projects/projects.service";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([
      listTasks({limit: 20}),
      listAllocations({limit: 20}),
      listLeaves({limit: 20}),
      listProjects({limit: 20}),
    ])
      .then(([tasksRes, allocationsRes, leavesRes, projectsRes]) => {
        const taskEvents = (tasksRes.data.items || []).map((task) => ({
          id: task._id,
          type: "Task",
          title: task.title,
          owner: task.assigneeId?.name || "Unassigned",
          start: task.startDate,
          end: task.dueDate,
          status: task.status,
        }));
        const allocationEvents = (allocationsRes.data.items || []).map((allocation) => ({
          id: allocation._id,
          type: "Allocation",
          title: allocation.projectId?.name || "Project allocation",
          owner: allocation.employeeId?.name || "",
          start: allocation.startDate,
          end: allocation.endDate,
          status: allocation.role,
        }));
        const leaveEvents = (leavesRes.data.items || []).map((leave) => ({
          id: leave._id,
          type: "Leave",
          title: leave.type,
          owner: leave.employeeId?.name || "",
          start: leave.startDate,
          end: leave.endDate,
          status: leave.status,
        }));
        const projectEvents = (projectsRes.data.items || []).map((project) => ({
          id: project._id,
          type: "Project",
          title: project.name,
          owner: project.managerId?.name || "",
          start: project.startDate,
          end: project.endDate,
          status: project.status,
        }));

        const merged = [...taskEvents, ...allocationEvents, ...leaveEvents, ...projectEvents].sort(
          (a, b) => new Date(a.start || a.end || 0) - new Date(b.start || b.end || 0)
        );
        setEvents(merged);
      })
      .catch(() => setEvents([]));
  }, []);

  const columns = [
    {key: "type", label: "Type"},
    {key: "title", label: "Title"},
    {key: "owner", label: "Owner"},
    {
      key: "dates",
      label: "Dates",
      render: (row) => {
        const start = row.start ? new Date(row.start).toLocaleDateString() : "-";
        const end = row.end ? new Date(row.end).toLocaleDateString() : "-";
        return `${start} - ${end}`;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "approved" || row.status === "done" ? "success" : "warning"}>
          {row.status || "planned"}
        </Badge>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Timeline" title="Calendar & milestones" />
      <DataTable columns={columns} rows={events} emptyState="No timeline events." />
    </section>
  );
};

export default CalendarPage;







