import {useEffect, useMemo, useState} from "react";
import Button from "../../../components/ui/Button/Button";
import Avatar from "../../../components/ui/Avatar/Avatar";

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < 12; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const normalizeSkills = (skills = []) =>
  skills
    .map((skill) => {
      if (!skill) return null;
      if (typeof skill === "string") {
        const name = skill.trim();
        return name ? {name, level: 3} : null;
      }
      const name = String(skill.name || "").trim();
      if (!name) return null;
      const level = Number.isFinite(skill.level) ? skill.level : 3;
      return {name, level};
    })
    .filter(Boolean);

const normalizeInitial = (values = {}) => ({
  _id: values._id,
  name: values.name || "",
  email: values.email || "",
  password: "",
  roleId: values.roleId || "",
  designation: values.designation || "",
  departmentId: values.departmentId || "",
  managerId: values.managerId || "",
  skills: normalizeSkills(values.skills),
  status: values.status || "active",
  avatar: values.avatar || "",
});

const EmployeeForm = ({
  initialValues,
  roles = [],
  departments = [],
  managers = [],
  skillsCatalog = [],
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState(() => normalizeInitial(initialValues));
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [passwordMode, setPasswordMode] = useState("auto");
  const [showPassword, setShowPassword] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");

  useEffect(() => {
    const normalized = normalizeInitial(initialValues);
    setForm(normalized);
    setAvatarFile(null);
    setErrors({});
    setPasswordMode(normalized._id ? "set" : "auto");
    setShowPassword(false);
  }, [initialValues]);

  useEffect(() => {
    if (!form._id && passwordMode === "auto" && !form.password) {
      setForm((prev) => ({...prev, password: generatePassword()}));
    }
  }, [form._id, form.password, passwordMode]);

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(form.avatar || "");
      return undefined;
    }
    const nextUrl = URL.createObjectURL(avatarFile);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [avatarFile, form.avatar]);

  const managerOptions = useMemo(() => {
    const trimmed = managers.filter((manager) => manager?._id !== form._id);
    const byRole = trimmed.filter((manager) => {
      const roleName = String(manager?.roleId?.name || manager?.role || "");
      return /manager/i.test(roleName);
    });
    return byRole.length ? byRole : trimmed;
  }, [form._id, managers]);

  const filteredSkills = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    if (!query) return skillsCatalog;
    return skillsCatalog.filter((skill) =>
      String(skill?.name || "").toLowerCase().includes(query)
    );
  }, [skillQuery, skillsCatalog]);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({...prev, [field]: value}));
    setErrors((prev) => ({...prev, [field]: ""}));
  };

  const handlePasswordModeChange = (mode) => {
    setPasswordMode(mode);
    setErrors((prev) => ({...prev, password: ""}));
    if (form._id) return;
    if (mode === "auto") {
      setForm((prev) => ({...prev, password: generatePassword()}));
    } else {
      setForm((prev) => ({...prev, password: ""}));
    }
  };

  const toggleSkill = (skill) => {
    if (!skill?.name) return;
    setForm((prev) => {
      const exists = prev.skills.some((entry) => entry.name === skill.name);
      const nextSkills = exists
        ? prev.skills.filter((entry) => entry.name !== skill.name)
        : [...prev.skills, {name: skill.name, level: 3}];
      return {...prev, skills: nextSkills};
    });
  };

  const removeSkill = (skillName) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((entry) => entry.name !== skillName),
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.roleId) nextErrors.roleId = "Role is required";

    if (!form._id) {
      if (!form.password || form.password.length < 8) {
        nextErrors.password = "Password must be at least 8 characters";
      }
    } else if (form.password && form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      roleId: form.roleId || undefined,
      designation: form.designation || undefined,
      departmentId: form.departmentId || undefined,
      managerId: form.managerId || undefined,
      skills: form.skills || [],
      status: form.status || "active",
    };

    if (!form._id || form.password) {
      payload.password = form.password;
    }

    onSubmit(payload, avatarFile);
  };

  const selectedSkillNames = new Set(form.skills.map((skill) => skill.name));
  const previewIsBlob = previewUrl.startsWith("blob:");

  return (
    <form className="panel space-y-8 p-6" onSubmit={handleSubmit} autoComplete="off">
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Profile</p>
          <h3 className="text-lg font-semibold text-primary">Employee profile</h3>
          <p className="text-sm text-secondary">Capture the employee&apos;s core details and photo.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-[auto,1fr,1fr] md:items-end">
          <div className="flex flex-col gap-3">
            {previewIsBlob ? (
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-default bg-secondary">
                <img src={previewUrl} alt={form.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <Avatar src={previewUrl} name={form.name} size="xl" />
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
              />
              <p className="mt-2 text-xs text-secondary">PNG or JPG up to 5MB.</p>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Full name</label>
            <input
              className="ghost-input mt-2"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Enter full name"
            />
            {errors.name ? <p className="mt-1 text-xs text-danger">{errors.name}</p> : null}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Email address</label>
            <input
              className="ghost-input mt-2"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="name@company.com"
              autoComplete="off"
              name="employee-email"
            />
            {errors.email ? <p className="mt-1 text-xs text-danger">{errors.email}</p> : null}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Org info</p>
          <h3 className="text-lg font-semibold text-primary">Role & reporting</h3>
          <p className="text-sm text-secondary">Define access level, department, and manager.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Role</label>
            <select className="ghost-input mt-2" value={form.roleId} onChange={updateField("roleId")}>
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId ? <p className="mt-1 text-xs text-danger">{errors.roleId}</p> : null}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Department</label>
            <select
              className="ghost-input mt-2"
              value={form.departmentId}
              onChange={updateField("departmentId")}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {!departments.length ? (
              <p className="mt-1 text-xs text-secondary">No departments available yet.</p>
            ) : null}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Manager</label>
            <select
              className="ghost-input mt-2"
              value={form.managerId}
              onChange={updateField("managerId")}
            >
              <option value="">Select manager</option>
              {managerOptions.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.name}
                </option>
              ))}
            </select>
            {managerOptions.length ? (
              <p className="mt-1 text-xs text-secondary">Managers are filtered by role and exclude the employee.</p>
            ) : (
              <p className="mt-1 text-xs text-secondary">No managers found yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Job info</p>
          <h3 className="text-lg font-semibold text-primary">Position & skills</h3>
          <p className="text-sm text-secondary">Track designation, skills, and status.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Designation</label>
            <input
              className="ghost-input mt-2"
              value={form.designation}
              onChange={updateField("designation")}
              placeholder="e.g. Senior Engineer"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Status</label>
            <select className="ghost-input mt-2" value={form.status} onChange={updateField("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Skills</label>
            <div className="mt-2 rounded-2xl border border-default bg-secondary p-4">
              <input
                className="ghost-input"
                value={skillQuery}
                onChange={(event) => setSkillQuery(event.target.value)}
                placeholder="Search skills"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {filteredSkills.length ? (
                  filteredSkills.map((skill) => {
                    const selected = selectedSkillNames.has(skill.name);
                    return (
                      <button
                        key={skill._id || skill.name}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          selected
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-default text-secondary hover:bg-[color:rgb(var(--surface-hover))]"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-secondary">No skills found.</p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => removeSkill(skill.name)}
                    className="rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {skill.name} <span className="ml-1 text-[10px]">x</span>
                  </button>
                ))}
                {!form.skills.length ? (
                  <p className="text-xs text-secondary">Select skills from the catalog above.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Security</p>
          <h3 className="text-lg font-semibold text-primary">Credentials</h3>
          <p className="text-sm text-secondary">Set a password or generate a temporary one.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-primary">
                <input
                  type="radio"
                  name="passwordMode"
                  checked={passwordMode === "set"}
                  onChange={() => handlePasswordModeChange("set")}
                />
                Set password manually
              </label>
              <label className="flex items-center gap-2 text-sm text-primary">
                <input
                  type="radio"
                  name="passwordMode"
                  checked={passwordMode === "auto"}
                  onChange={() => handlePasswordModeChange("auto")}
                />
                Auto-generate temporary password
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Password</label>
            <div className="mt-2 flex flex-col gap-2 md:flex-row">
              <input
                className="ghost-input flex-1"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={updateField("password")}
                placeholder={form._id ? "Set a new password (optional)" : "Create a secure password"}
                readOnly={passwordMode === "auto" && !form._id}
                autoComplete="new-password"
              />
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
                {passwordMode === "auto" && !form._id ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setForm((prev) => ({...prev, password: generatePassword()}))}
                    >
                      Regenerate
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigator.clipboard?.writeText(form.password)}
                    >
                      Copy
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
            {errors.password ? <p className="mt-1 text-xs text-danger">{errors.password}</p> : null}
            <p className="mt-2 text-xs text-secondary">
              Share the temporary password with the employee. Encourage them to update it after first login.
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Employee"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;

