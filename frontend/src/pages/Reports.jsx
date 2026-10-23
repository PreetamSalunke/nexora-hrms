import { useEffect, useMemo, useRef, useState } from "react";
import {
  Users, UserCheck, CalendarClock, UserX, RefreshCw,
  Download, AlertCircle, Wallet, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { employeeAPI } from "../services/api";

const PAGE_SIZE = 100;
const STATUS_COLORS = ["#4f46e5", "#f59e0b", "#94a3b8"];
const formatMoney = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount);

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

// Mount each chart only when it first scrolls into view so Recharts animates on entry.
function AnimatedChart({ children, className = "" }) {
  const containerRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {hasEntered ? children : <div className="h-full w-full" aria-hidden="true" />}
    </div>
  );
}

function Reports() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAllEmployees() {
      setLoading(true);
      setError("");
      try {
        const all = [];
        let page = 1;
        let total = Infinity;
        while (all.length < total) {
          const response = await employeeAPI.getAll({ page, page_size: PAGE_SIZE });
          if (cancelled) return;
          const payload = response.data;
          const records = Array.isArray(payload) ? payload : payload.results;
          if (!Array.isArray(records)) throw new Error("Unexpected employee API response");
          all.push(...records);
          if (Array.isArray(payload)) break;
          total = Number(payload.count ?? all.length);
          if (records.length === 0) break;
          page += 1;
        }
        if (!cancelled) setEmployees(all);
      } catch (err) {
        if (!cancelled) {
          console.error("Reports API error:", err);
          setError("Unable to load reports. Check your Django server and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAllEmployees();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const analytics = useMemo(() => {
    const departments = new Map();
    const statuses = { Active: 0, "On Leave": 0, Inactive: 0 };
    const months = new Map();
    let totalSalary = 0;

    employees.forEach((employee) => {
      const department = employee.department || "Unassigned";
      const salary = Number(employee.salary) || 0;
      const previous = departments.get(department) || { name: department, employees: 0, salary: 0 };
      previous.employees += 1;
      previous.salary += salary;
      departments.set(department, previous);
      totalSalary += salary;

      const status = employee.employment_status;
      if (Object.prototype.hasOwnProperty.call(statuses, status)) statuses[status] += 1;

      const date = employee.date_of_joining;
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const month = date.slice(0, 7);
        months.set(month, (months.get(month) || 0) + 1);
      }
    });

    return {
      departments: [...departments.values()].sort((a, b) => b.employees - a.employees),
      statuses: Object.entries(statuses).map(([name, value]) => ({ name, value })),
      hiring: [...months.entries()].sort(([a], [b]) => a.localeCompare(b))
        .map(([month, hires]) => ({ month, hires })),
      totalSalary,
      active: statuses.Active,
      onLeave: statuses["On Leave"],
      inactive: statuses.Inactive,
    };
  }, [employees]);

  const exportCSV = () => {
    const headers = ["Employee ID", "Full Name", "Email", "Phone", "Department", "Designation", "Salary (INR)", "Date of Joining", "Status"];
    const rows = employees.map((employee) => [
      employee.employee_id, employee.full_name, employee.email, employee.phone,
      employee.department, employee.designation, employee.salary,
      employee.date_of_joining, employee.employment_status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexora-employee-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { title: "Total Employees", value: employees.length, icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { title: "Active Employees", value: analytics.active, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
    { title: "On Leave", value: analytics.onLeave, icon: CalendarClock, color: "bg-amber-50 text-amber-600" },
    { title: "Inactive", value: analytics.inactive, icon: UserX, color: "bg-slate-100 text-slate-600" },
  ];

  const chartCard = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Reports & Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">Live workforce insights from employee records.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)} disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button type="button" onClick={exportCSV} disabled={loading || Boolean(error) || employees.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            <Download size={17} /> Export CSV
          </button>
        </div>
      </div>

      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} />{error}</div>}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">Loading reports...</div>
      ) : error ? null : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ title, value, icon: Icon, color }) => (
              <div key={title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>
                <div className={`rounded-xl p-3 ${color}`}><Icon size={23} /></div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Wallet size={23} /></div>
            <div><p className="text-sm text-slate-500">Total Salary Across Employee Records</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatMoney(analytics.totalSalary)}</p>
              <p className="mt-1 text-xs text-slate-400">Sum of stored salary values; not a payroll calculation.</p>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">No employee records yet. Add employees to see analytics.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <section className={chartCard}>
                  <h2 className="mb-5 font-semibold text-slate-900">Employees by Department</h2>
                  <AnimatedChart className="h-72 w-full"><ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.departments} margin={{ top: 5, right: 12, left: -18, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={65} tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="employees" fill="#4f46e5" radius={[5, 5, 0, 0]} isAnimationActive animationBegin={100} animationDuration={1400} animationEasing="ease-out" />
                    </BarChart>
                  </ResponsiveContainer></AnimatedChart>
                </section>
                <section className={chartCard}>
                  <h2 className="mb-5 font-semibold text-slate-900">Employment Status Distribution</h2>
                  <AnimatedChart className="h-72 w-full"><ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={analytics.statuses} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} isAnimationActive animationBegin={100} animationDuration={1500} animationEasing="ease-out">
                      {analytics.statuses.map((entry, index) => <Cell key={entry.name} fill={STATUS_COLORS[index]} />)}
                    </Pie><Tooltip /><Legend verticalAlign="bottom" /></PieChart>
                  </ResponsiveContainer></AnimatedChart>
                </section>
                <section className={chartCard}>
                  <h2 className="mb-5 font-semibold text-slate-900">Salary by Department</h2>
                  <AnimatedChart className="h-72 w-full"><ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.departments} margin={{ top: 5, right: 12, left: 0, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={65} tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} width={55} /><Tooltip formatter={(value) => formatMoney(value)} />
                      <Bar dataKey="salary" fill="#0d9488" radius={[5, 5, 0, 0]} isAnimationActive animationBegin={100} animationDuration={1400} animationEasing="ease-out" />
                    </BarChart>
                  </ResponsiveContainer></AnimatedChart>
                </section>
                <section className={chartCard}>
                  <h2 className="mb-5 font-semibold text-slate-900">Monthly Hiring Trend</h2>
                  <AnimatedChart className="h-72 w-full"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.hiring} margin={{ top: 5, right: 15, left: -18, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="hires" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} isAnimationActive animationBegin={100} animationDuration={1600} animationEasing="ease-out" />
                    </LineChart>
                  </ResponsiveContainer></AnimatedChart>
                </section>
              </div>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 p-5"><BarChart3 size={20} className="text-indigo-600" />
                  <h2 className="font-semibold text-slate-900">Employee Report</h2><span className="text-xs text-slate-500">({employees.length} records)</span>
                </div>
                <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                    {["Employee ID", "Employee", "Department", "Designation", "Salary", "Joining Date", "Status"].map((label) => <th key={label} className="px-5 py-4 font-semibold">{label}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((employee) => <tr key={employee.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-700">{employee.employee_id}</td>
                      <td className="px-5 py-3"><span className="font-medium text-slate-900">{employee.full_name}</span><span className="block text-xs text-slate-500">{employee.email}</span></td>
                      <td className="px-5 py-3 text-slate-600">{employee.department}</td>
                      <td className="px-5 py-3 text-slate-600">{employee.designation}</td>
                      <td className="px-5 py-3 text-slate-700">{formatMoney(Number(employee.salary) || 0)}</td>
                      <td className="px-5 py-3 text-slate-600">{employee.date_of_joining}</td>
                      <td className="px-5 py-3 text-slate-600">{employee.employment_status}</td>
                    </tr>)}
                  </tbody>
                </table></div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
