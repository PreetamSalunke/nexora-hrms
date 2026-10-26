
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        formData
      );

      sessionStorage.setItem(
        "access_token",
        response.data.access
      );
      sessionStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      navigate(location.state?.from || "/", {
        replace: true,
        state: null,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Left Branding Panel */}
      <div className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#102A56] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-extrabold shadow-lg shadow-blue-950/20">
            N
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Nexora
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Human Resources
            </p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="inline-flex rounded-full border border-blue-300/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100">
            SMARTER WORKFORCE MANAGEMENT
          </span>

          <h2 className="mt-8 text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
            Your people.
            <br />
            <span className="text-sky-300">
              Our priority.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/85">
            Everything you need to manage employees,
            explore workforce insights, and keep your
            organization moving forward.
          </p>

          <div className="mt-12 space-y-5">
            {[
              {
                icon: "✓",
                title: "Effortless Employee Management",
                description:
                  "Keep your workforce information organized.",
              },
              {
                icon: "↗",
                title: "Powerful HR Analytics",
                description:
                  "Make smarter decisions with clear insights.",
              },
              {
                icon: "🔒",
                title: "Secure Access",
                description:
                  "Protect your workspace with authentication.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-lg font-bold">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-blue-200/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-white/15 pt-6 text-xs text-blue-200/70">
          <span>© 2026 Nexora HRMS</span>
          <span>Built for better workplaces</span>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex min-h-screen flex-col">
        {/* Mobile Logo */}
        <div className="flex items-center gap-3 px-6 pt-8 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            N
          </div>
          <span className="text-xl font-bold text-slate-900">
            Nexora HRMS
          </span>
        </div>

        <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <div className="mb-5 hidden h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 lg:flex">
                N
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to access your
                Nexora workspace.
              </p>
            </div>

            {/* Registration Success */}
            {successMessage && (
              <div
                role="status"
                className="mb-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  ✓
                </span>

                <div>
                  <p className="font-semibold">
                    Account Created Successfully!
                  </p>
                  <p className="mt-1">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute inset-y-0 right-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-7 text-center">
              <p className="text-sm text-slate-500">
                New to Nexora?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <p className="mt-10 text-center text-xs text-slate-400">
              Secure access to your HR management workspace
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
