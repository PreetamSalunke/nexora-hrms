import { useEffect, useState } from "react";
import { X, Save, LoaderCircle, AlertCircle } from "lucide-react";
import { employeeAPI } from "../../services/api";

const departments = [
  "Engineering", "Human Resources", "Marketing", "Finance",
  "Sales", "Operations", "Customer Support",
];
const statuses = ["Active", "On Leave", "Inactive"];
const initialForm = {
  employee_id: "", full_name: "", email: "", phone: "",
  department: "", designation: "", salary: "",
  date_of_joining: "", employment_status: "Active",
};
const fields = [
  { name: "employee_id", label: "Employee ID", placeholder: "NEX003", required: true },
  { name: "full_name", label: "Full Name", placeholder: "Enter employee name", required: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "employee@example.com", required: true },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter phone number" },
  { name: "designation", label: "Designation", placeholder: "Software Developer", required: true },
  { name: "salary", label: "Salary (INR)", type: "number", placeholder: "45000", required: true },
  { name: "date_of_joining", label: "Date of Joining", type: "date", required: true },
];
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

function EmployeeFormModal({ isOpen, onClose, onSuccess, employee = null }) {
  const isEditMode = Boolean(employee?.id);
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(employee ? Object.fromEntries(
        Object.keys(initialForm).map((key) => [key, employee[key] ?? initialForm[key]])
      ) : { ...initialForm });
      setErrors({});
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined, general: undefined }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.employee_id.trim()) nextErrors.employee_id = "Employee ID is required.";
    if (form.full_name.trim().length < 2) nextErrors.full_name = "Enter at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!form.department) nextErrors.department = "Select a department.";
    if (!form.designation.trim()) nextErrors.designation = "Designation is required.";
    if (form.salary === "" || !Number.isFinite(Number(form.salary)) || Number(form.salary) < 0) {
      nextErrors.salary = "Enter a valid non-negative salary.";
    }
    if (!form.date_of_joining) nextErrors.date_of_joining = "Select a joining date.";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setSaving(true);
      setErrors({});
      const payload = {
        ...form,
        employee_id: form.employee_id.trim().toUpperCase(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        designation: form.designation.trim(),
      };
      if (isEditMode) {
        await employeeAPI.update(employee.id, payload);
      } else {
        await employeeAPI.create(payload);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      const responseData = error.response?.data;
      if (responseData && typeof responseData === "object" && !Array.isArray(responseData)) {
        const apiErrors = {};
        for (const [field, messages] of Object.entries(responseData)) {
          apiErrors[field === "non_field_errors" || field === "detail" ? "general" : field] =
            Array.isArray(messages) ? messages.join(" ") : String(messages);
        }
        setErrors(apiErrors);
      } else {
        setErrors({ general: "Unable to save employee. Check Django server." });
      }
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (field) => (
    <div key={field.name}>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-slate-700">
        {field.label}{field.required && " *"}
      </label>
      <input
        id={field.name} name={field.name} type={field.type || "text"}
        value={form[field.name]} onChange={handleChange}
        placeholder={field.placeholder} required={field.required}
        min={field.name === "salary" ? "0" : undefined}
        step={field.name === "salary" ? "0.01" : undefined}
        aria-invalid={Boolean(errors[field.name])} className={inputClass}
      />
      {errors[field.name] && <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="employee-form-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="employee-form-title" className="text-xl font-bold text-slate-900">
              {isEditMode ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditMode ? "Update the employee's information below." : "Enter the employee's information below."}
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={saving}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50" aria-label="Close form">
            <X size={22} />
          </button>
        </div>

        <form id="employee-form" onSubmit={handleSubmit} className="overflow-y-auto p-6">
          {errors.general && (
            <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} />{errors.general}
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.slice(0, 4).map(renderInput)}
            <div>
              <label htmlFor="department" className="mb-2 block text-sm font-medium text-slate-700">Department *</label>
              <select id="department" name="department" value={form.department} onChange={handleChange}
                required aria-invalid={Boolean(errors.department)} className={inputClass}>
                <option value="">Select department</option>
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
            </div>
            {fields.slice(4).map(renderInput)}
            <div>
              <label htmlFor="employment_status" className="mb-2 block text-sm font-medium text-slate-700">Employment Status</label>
              <select id="employment_status" name="employment_status" value={form.employment_status}
                onChange={handleChange} className={inputClass}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="employee-form" disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : isEditMode ? "Update Employee" : "Save Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeFormModal;
