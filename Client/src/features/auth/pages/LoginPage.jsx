import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../../auth/auth.service";
import {useAuthStore} from "../../../store/useAuthStore";
import Button from "../../../shared/ui/Button";
import Alert from "../../../shared/ui/Alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const rememberedEmail =
    typeof window !== "undefined" ? localStorage.getItem("rps-remember-email") : "";
  const [form, setForm] = useState({
    email: rememberedEmail || "admin@xyz.com",
    password: "admin@123",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const updateField = (field) => (event) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(form);
      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      if (remember) {
        localStorage.setItem("rps-remember-email", form.email);
      } else {
        localStorage.removeItem("rps-remember-email");
      }
      navigate("/");
    } catch {
      setError("Unable to sign in. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden px-16 py-12 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.18),transparent_50%)]" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.4em] text-accent">EXI</p>
            <h1 className="mt-4 text-4xl font-semibold text-primary">Resource Planning Suite</h1>
            <p className="mt-4 max-w-md text-sm text-secondary">
              Control allocations, capacity, and delivery with enterprise-grade clarity.
            </p>
          </div>
          <div className="relative z-10 grid gap-4">
            <div className="panel px-6 py-5">
              <p className="text-sm font-semibold">Operational visibility</p>
              <p className="mt-2 text-xs text-secondary">
                Real-time capacity, workload, and utilization metrics.
              </p>
            </div>
            <div className="panel px-6 py-5">
              <p className="text-sm font-semibold">Secure access</p>
              <p className="mt-2 text-xs text-secondary">
                Role-based access and audited workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="panel px-8 py-10">
              <p className="text-xs uppercase tracking-[0.4em] text-accent">Sign in</p>
              <h2 className="mt-3 text-2xl font-semibold text-primary">Welcome back</h2>
              <p className="mt-2 text-sm text-secondary">
                Use your admin credentials to access the workspace.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-secondary">Email</label>
                  <input className="ghost-input mt-2" value={form.email} onChange={updateField("email")} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-secondary">Password</label>
                  <div className="relative mt-2">
                    <input
                      className="ghost-input pr-12"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={updateField("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-secondary">
                  <input type="checkbox" checked={remember} onChange={() => setRemember((prev) => !prev)} />
                  Remember my email
                </label>
                {error ? <Alert tone="error">{error}</Alert> : null}
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>
            <p className="mt-6 text-center text-xs text-secondary">
              Need help? Contact your system administrator.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;




