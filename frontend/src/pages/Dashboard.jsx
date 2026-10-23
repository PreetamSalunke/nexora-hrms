
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Building2,
  CalendarClock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { employeeAPI } from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all pages, not just the first 10 employees.
      let allEmployees = [];
      let nextPage = 1;

      while (nextPage !== null) {
        const response = await employeeAPI.getAll({
          page: nextPage,
          page_size: 100,
        });

        const data = response.data;

        if (Array.isArray(data)) {
          allEmployees = data;
          nextPage = null;
        } else {
          allEmployees = [...allEmployees, ...data.results];
          nextPage = data.next ? nextPage + 1 : null;
        }
      }

      setEmployees(allEmployees);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError("Unable to load employee data. Check Django server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.employment_status === "Active"
  ).length;

  const onLeaveEmployees = employees.filter(
    (employee) => employee.employment_status === "On Leave"
  ).length;

  const totalDepartments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "On Leave",
      value: onLeaveEmployees,
      icon: CalendarClock,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome to Nexora HRMS. Your workforce at a glance.
          </p>
        </div>

        <button
          onClick={fetchEmployees}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-xl p-3 ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold text-slate-900">
                {loading || error ? "—" : stat.value}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Recent Employees
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Latest employees added to the organization
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">
            Loading employees...
          </p>
        ) : error ? (
          <p className="mt-6 text-sm text-red-600">
            Employee records could not be loaded.
          </p>
        ) : employees.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            No employees found. Add employees through Django Admin
            or the API.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {[...employees]
              .sort(
                (a, b) =>
                  new Date(b.created_at) - new Date(a.created_at)
              )
              .slice(0, 5)
              .map((employee) => (
                <div
                  key={employee.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {employee.full_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {employee.employee_id} • {employee.designation}
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {employee.department}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
