import {useEffect, useState} from "react";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";
import {getMe} from "../../../services/auth.service";
import {listAllocationsByEmployee, listAllocationsByProject} from "../../../services/allocations.service";
import Avatar from "../../../components/ui/Avatar/Avatar";
import {useAvatarStore} from "../../../store/useAvatarStore";

const MyTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const avatarOverrides = useAvatarStore((state) => state.overrides);

  useEffect(() => {
    setLoading(true);
    getMe()
      .then((res) => res.data.data)
      .then((user) => listAllocationsByEmployee(user.id || user._id))
      .then((res) => {
        const allocations = res.data.items || [];
        const projectIds = Array.from(
          new Set(allocations.map((allocation) => allocation.projectId?._id).filter(Boolean))
        );
        return Promise.all(projectIds.map((projectId) => listAllocationsByProject(projectId)));
      })
      .then((responses) => {
        const merged = new Map();
        responses.forEach((res) => {
          (res.data.items || []).forEach((item) => {
            const key = `${item.employeeId?._id || item.employeeId}-${item.projectId?._id || item.projectId}`;
            merged.set(key, item);
          });
        });
        setError("");
        setTeamMembers(Array.from(merged.values()));
      })
      .catch((err) => {
        setTeamMembers([]);
        setError(getErrorMessage(err, "Unable to load team data"));
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "member",
      label: "Team member",
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
    {key: "role", label: "Role", render: (row) => row.role || "-"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {
      key: "skills",
      label: "Skills",
      render: (row) =>
        (row.employeeId?.skills || [])
          .map((skill) => (typeof skill === "string" ? skill : skill.name))
          .filter(Boolean)
          .slice(0, 3)
          .join(", ") || "-",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="My team" title="Project teammates" />
      <DataTable columns={columns} rows={teamMembers} emptyState={loading ? "Loading team..." : "No team data yet."} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default MyTeam;



