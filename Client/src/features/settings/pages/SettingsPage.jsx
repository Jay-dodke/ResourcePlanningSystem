import {useEffect, useState} from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {getSettings, updateSettings} from "../../settings/settings.service";

const SettingsPage = () => {
  const [form, setForm] = useState({
    companyName: "",
    workHoursPerDay: 8,
    timezone: "",
    currency: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((res) => {
        if (res.data.data) {
          setForm(res.data.data);
        }
      })
      .catch(() => null);
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Admin"
        title="System settings"
        action={
          <Button
            variant="primary"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await updateSettings(form);
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        }
      />
      <div className="panel p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">
              Company name
            </label>
            <input
              className="ghost-input mt-2"
              value={form.companyName || ""}
              onChange={updateField("companyName")}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">
              Work hours per day
            </label>
            <input
              className="ghost-input mt-2"
              type="number"
              value={form.workHoursPerDay || 8}
              onChange={updateField("workHoursPerDay")}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Timezone</label>
            <input
              className="ghost-input mt-2"
              value={form.timezone || ""}
              onChange={updateField("timezone")}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-secondary">Currency</label>
            <input
              className="ghost-input mt-2"
              value={form.currency || ""}
              onChange={updateField("currency")}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;







