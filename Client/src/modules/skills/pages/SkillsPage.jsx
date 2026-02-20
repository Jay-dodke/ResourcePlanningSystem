import {useEffect, useState} from "react";
import {listSkills, createSkill, deleteSkill} from "../../../services/skills.service";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import DataTable from "../../../components/tables/DataTable/DataTable";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({name: "", category: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  const fetchSkills = () => {
    setLoading(true);
    listSkills({limit: 50})
      .then((res) => setSkills(res.data.items || []))
      .catch((err) => {
        setSkills([]);
        setError(getErrorMessage(err, "Unable to load skills"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name) return;
    try {
      setError("");
      await createSkill({name: form.name, category: form.category});
      pushToast({type: "success", message: "Skill added"});
      setForm({name: "", category: ""});
      fetchSkills();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create skill"));
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this skill?");
    if (!confirmed) return;
    try {
      setError("");
      await deleteSkill(id);
      pushToast({type: "success", message: "Skill deleted"});
      fetchSkills();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete skill"));
    }
  };

  const columns = [
    {key: "name", label: "Skill"},
    {key: "category", label: "Category"},
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
      <PageHeader eyebrow="People" title="Skills & competency" />
      <form className="panel p-5 grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
        <input
          className="ghost-input"
          placeholder="Skill name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({...prev, name: event.target.value}))}
        />
        <input
          className="ghost-input"
          placeholder="Category"
          value={form.category}
          onChange={(event) => setForm((prev) => ({...prev, category: event.target.value}))}
        />
        <Button type="submit" variant="primary">
          Add skill
        </Button>
      </form>
      <DataTable
        columns={columns}
        rows={skills}
        emptyState={loading ? "Loading skills..." : "No skills configured."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default SkillsPage;



