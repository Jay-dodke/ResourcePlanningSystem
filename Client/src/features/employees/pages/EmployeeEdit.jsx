import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {getUser, updateUser, listUsers, uploadUserAvatar} from "../../employees/employees.service";
import {listRoles} from "../../roles/roles.service";
import {listDepartments} from "../../departments/departments.service";
import {listSkills} from "../../skills/skills.service";
import {useUiStore} from "../../../store/useUiStore";
import {useAuthStore} from "../../../store/useAuthStore";
import {useAvatarStore} from "../../../store/useAvatarStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const EmployeeEdit = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);
  const currentUser = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAvatarOverride = useAvatarStore((state) => state.setAvatarOverride);

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

  useEffect(() => {
    getUser(id)
      .then((res) => {
        const user = res.data.data;
        const skillList = (user.skills || [])
          .map((skill) => {
            if (typeof skill === "string") return {name: skill, level: 3};
            if (!skill?.name) return null;
            return {name: skill.name, level: skill.level || 3};
          })
          .filter(Boolean);
        setInitialValues({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: "",
          roleId: user.roleId?._id || "",
          designation: user.designation || "",
          departmentId: user.departmentId?._id || "",
          managerId: user.managerId?._id || "",
          skills: skillList,
          status: user.status || "active",
          avatar: user.avatar || "",
        });
      })
      .catch(() => setInitialValues(null));
  }, [id]);

  const handleSubmit = async (payload, avatarFile) => {
    try {
      setError("");
      setLoading(true);
      await updateUser(id, payload);
      if (avatarFile) {
        const response = await uploadUserAvatar(id, avatarFile);
        const updated = response.data.data;
        if (updated?.avatar) {
          setAvatarOverride(id, updated.avatar);
          if (currentUser && String(currentUser.id || currentUser._id) === String(id)) {
            setAuth({
              user: {...currentUser, avatar: updated.avatar},
              accessToken,
              refreshToken,
            });
          }
        }
      }
      pushToast({type: "success", message: "Employee updated"});
      navigate("/employees");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update employee"));
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="panel p-6 text-sm text-secondary">Loading employee...</div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="People"
        title="Edit employee"
        action={
          <Button variant="ghost" onClick={() => navigate("/employees")}
          >
            Back to list
          </Button>
        }
      />
      <EmployeeForm
        initialValues={initialValues}
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

export default EmployeeEdit;







