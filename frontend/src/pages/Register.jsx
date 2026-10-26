
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        formData
      );

      navigate("/login", {
        replace: true,
        state: {
          message: "Your account is ready. Please sign in to continue.",
        },
      });
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data).flatMap(
          ([field, value]) => {
            const errors = Array.isArray(value) ? value : [value];

            return errors.map((message) => `${field}: ${message}`);
          }
        );

        setError(messages.join("\n"));
      } else {
        setError(
          "Unable to create your account. Please try again."
        );
      }
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
            YOUR WORKSPACE STARTS HERE
          </span>

          <h2 className="mt-8 text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
            Better teams.
            <br />
            <span className="text-sky-300">
              Better tomorrow.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/85">
            Join Nexora HRMS and simplify employee
            management with one connected workspace.
          </p>

          <div className="mt-12 space-y-5">
            {[
              {
                icon: "✓",
                title: "Centralized Employee Records",
                description:
                  "Keep important workforce information organized.",
              },
              {
                icon: "↗",
                title: "Actionable Workforce Insights",
                description:
                  "Understand your team through clear analytics.",
              },
              {
                icon: "🔒",
                title: "Secure Account Access",
                description:
                  "Manage your workspace with protected authentication.",
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

      {/* Right Registration Panel */}
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
            <div className="mb-8">
              <div className="mb-5 hidden h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 lg:flex">
                N
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Get started with your Nexora HRMS workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
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
                  placeholder="Choose a username"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters and a strong password.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm_password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    autoComplete="new-password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Validation Errors */}
              {error && (
                <div
                  role="alert"
                  className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-7 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            <p className="mt-10 text-center text-xs text-slate-400">
              Secure registration powered by Nexora HRMS
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;
