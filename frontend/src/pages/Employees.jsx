
import { useEffect, useState } from "react";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { employeeAPI } from "../services/api";
import EmployeeFormModal from "../components/employees/EmployeeFormModal";
import DeleteEmployeeModal from "../components/employees/DeleteEmployeeModal";

const PAGE_SIZE = 10;

const columns = [
  { label: "Employee", field: "full_name" },
  { label: "Employee ID", field: "employee_id" },
  { label: "Department", field: "department" },
  { label: "Designation", field: "designation" },
  { label: "Salary", field: "salary" },
  { label: "Joining Date", field: "date_of_joining" },
];

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmployees() {
      try {
        setLoading(true);
        setError("");

        const response = await employeeAPI.getAll({
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch,
          ordering,
        });

        if (controller.signal.aborted) return;

        const data = response.data;

        setEmployees(Array.isArray(data) ? data : data.results);
        setTotalCount(
          Array.isArray(data) ? data.length : data.count
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Employee API error:", err);
        setError(
          "Unable to load employees. Check your Django server."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadEmployees();

    return () => controller.abort();
  }, [page, debouncedSearch, ordering, refreshKey]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / PAGE_SIZE)
  );

  const handleSort = (field) => {
    setOrdering((current) =>
      current === field ? `-${field}` : field
    );
    setPage(1);
  };

  const formatSalary = (salary) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(salary));

  const handleEmployeeAdded = () => {
    setSuccessMessage("Employee added successfully!");
    setPage(1);
    setRefreshKey((key) => key + 1);
  };

  const handleEmployeeUpdated = () => {
    setSuccessMessage("Employee updated successfully!");
    setRefreshKey((key) => key + 1);
  };

  const handleEmployeeDeleted = () => {
    setSuccessMessage("Employee deleted successfully!");
    if (page > 1 && employees.length === 1) {
      setPage((current) => current - 1);
    }
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleEmployeeAdded}
      />

      <EmployeeFormModal
        isOpen={Boolean(selectedEmployee)}
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onSuccess={handleEmployeeUpdated}
      />

      <DeleteEmployeeModal
        employee={employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onSuccess={handleEmployeeDeleted}
      />

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Employee Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage your organization's workforce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSuccessMessage("");
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Employee
          </button>

        </div>
      </div>

      {/* Employee Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Users size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                All Employees
              </h2>
              <p className="text-xs text-slate-500">
                {totalCount} matching employee records
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              aria-label="Search employees"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 border-b border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    scope="col"
                    className="px-5 py-4 font-semibold"
                  >
                    <button
                      onClick={() => handleSort(column.field)}
                      className="flex items-center gap-2 hover:text-indigo-600"
                    >
                      {column.label}
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-5 py-4">
                  Status
                </th>
                <th scope="col" className="px-5 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-red-600"
                  >
                    Employee records could not be loaded.
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                          {employee.full_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {employee.full_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {employee.employee_id}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {employee.department}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {employee.designation}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {formatSalary(employee.salary)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {employee.date_of_joining}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${employee.employment_status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : employee.employment_status === "On Leave"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {employee.employment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSuccessMessage("");
                          setSelectedEmployee(employee);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        aria-label={`Edit ${employee.full_name}`}
                        title={`Edit ${employee.full_name}`}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSuccessMessage("");
                          setEmployeeToDelete(employee);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                        aria-label={`Delete ${employee.full_name}`}
                        title={`Delete ${employee.full_name}`}
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-sm text-slate-500">
            {totalCount === 0
              ? "Showing 0 employees"
              : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                page * PAGE_SIZE,
                totalCount
              )} of ${totalCount}`}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || page === 1}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium text-slate-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={loading || page >= totalPages}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;
