import {useEffect, useState} from "react";
import {listRoles} from "../../../services/roles.service";
import DataTable from "../../../components/tables/DataTable/DataTable";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    listRoles({limit: 50})
      .then((res) => {
        setRoles(res.data.items || []);
      })
      .catch(() => setRoles([]));
  }, []);

  const columns = [
    {key: "name", label: "Role"},
    {
      key: "permissions",
      label: "Permissions",
      render: (row) => (row.permissions || []).slice(0, 3).join(", ") || "-",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Security"
        title="Roles & permissions"
        action={<Button variant="primary">Create role</Button>}
      />
      <DataTable columns={columns} rows={roles} emptyState="No roles available." />
    </section>
  );
};

export default RolesPage;



