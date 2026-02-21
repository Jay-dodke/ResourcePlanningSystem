import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {createUser, listUsers, uploadUserAvatar} from "../../employees/employees.service";
import {listRoles} from "../../roles/roles.service";
import {listDepartments} from "../../departments/departments.service";
import {listSkills} from "../../skills/skills.service";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    listRoles({limit: 50})
      .then((res) => setRoles(res.data.items || []))
      .catch(() => setRoles([]));
    listDepartments({limit: 50})
      .then((res) => setDepartments(res.data.items || []))
      .catch(() => setDepartments([]));
    listSkills({limit: 200})
      .then((res) => setSkills(res.data.items || []))
      .catch(() => setSkills([]));
    listUsers({limit: 200})
      .then((res) => setManagers(res.data.items || []))
      .catch(() => setManagers([]));
  }, []);

  const handleSubmit = async (payload, avatarFile) => {
    try {
      setError("");
      setLoading(true);
      const response = await createUser(payload);
      const created = response.data.data;
      if (avatarFile && created?._id) {
        await uploadUserAvatar(created._id, avatarFile);
      }
      pushToast({type: "success", message: "Employee created successfully"});
      navigate("/employees");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create employee"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="People"
        title="Add employee"
        action={
          <Button variant="ghost" onClick={() => navigate("/employees")}
          >
            Back to list
          </Button>
        }
      />
      <EmployeeForm
        initialValues={{
          name: "",
          email: "",
          password: "",
          roleId: "",
          designation: "",
          departmentId: "",
          managerId: "",
          skills: [],
          status: "active",
          avatar: "",
        }}
        roles={roles}
        departments={departments}
        managers={managers}
        skillsCatalog={skills}
        onSubmit={handleSubmit}
        loading={loading}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default EmployeeCreate;







