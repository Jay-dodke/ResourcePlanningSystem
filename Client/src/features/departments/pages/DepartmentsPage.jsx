import {useEffect, useState} from "react";
import {listDepartments, createDepartment, deleteDepartment} from "../../departments/departments.service";
import {listUsers} from "../../employees/employees.service";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import DataTable from "../../../shared/components/DataTable";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({name: "", code: "", managerId: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  const fetchDepartments = () => {
    setLoading(true);
    listDepartments({limit: 50})
      .then((res) => setDepartments(res.data.items || []))
      .catch((err) => {
        setDepartments([]);
        setError(getErrorMessage(err, "Unable to load departments"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
    listUsers({limit: 200})
      .then((res) => setManagers(res.data.items || []))
      .catch(() => setManagers([]));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name) return;
    try {
      setError("");
      await createDepartment({
        name: form.name,
        code: form.code || undefined,
        managerId: form.managerId || undefined,
      });
      pushToast({type: "success", message: "Department created"});
      setForm({name: "", code: "", managerId: ""});
      fetchDepartments();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create department"));
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this department?");
    if (!confirmed) return;
    try {
      setError("");
      await deleteDepartment(id);
      pushToast({type: "success", message: "Department deleted"});
      fetchDepartments();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete department"));
    }
  };

  const columns = [
    {key: "name", label: "Department"},
    {key: "code", label: "Code"},
    {key: "manager", label: "Manager", render: (row) => row.managerId?.name || "-"},
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button variant="ghost" onClick={() => handleDelete(row._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Org" title="Departments" />
      <form className="panel p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
        <input
          className="ghost-input"
          placeholder="Department name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({...prev, name: event.target.value}))}
        />
        <input
          className="ghost-input"
          placeholder="Code"
          value={form.code}
          onChange={(event) => setForm((prev) => ({...prev, code: event.target.value}))}
        />
        <select
          className="ghost-input"
          value={form.managerId}
          onChange={(event) => setForm((prev) => ({...prev, managerId: event.target.value}))}
        >
          <option value="">Select manager</option>
          {managers.map((manager) => (
            <option key={manager._id} value={manager._id}>
              {manager.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary">
          Add department
        </Button>
      </form>
      <DataTable
        columns={columns}
        rows={departments}
        emptyState={loading ? "Loading departments..." : "No departments created."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default DepartmentsPage;







