
import { useState } from "react";
import { AlertTriangle, Trash2, X, LoaderCircle } from "lucide-react";
import { employeeAPI } from "../../services/api";

function DeleteEmployeeModal({ employee, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!employee) return null;

  const handleDelete = async () => {
    if (deleting) return;

    try {
      setDeleting(true);
      setError("");

      await employeeAPI.delete(employee.id);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Delete employee error:", err);
      setError(
        "Unable to delete employee. Please check your connection and try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-employee-title"
        aria-describedby="delete-employee-description"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close confirmation"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-5">
          <h2
            id="delete-employee-title"
            className="text-xl font-bold text-slate-900"
          >
            Delete Employee?
          </h2>

          <p
            id="delete-employee-description"
            className="mt-3 text-sm leading-6 text-slate-600"
          >
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-slate-900">
              {employee.full_name}
            </span>{" "}
            ({employee.employee_id})?
          </p>

          <p className="mt-2 text-sm text-red-600">
            This action cannot be undone.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}
            {deleting ? "Deleting..." : "Delete Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEmployeeModal;
