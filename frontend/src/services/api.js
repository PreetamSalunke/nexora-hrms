
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const employeeAPI = {
  getAll: (params = {}) => api.get("employees/", { params }),

  getById: (id) => api.get(`employees/${id}/`),

  create: (data) => api.post("employees/", data),

  update: (id, data) => api.patch(`employees/${id}/`, data),

  delete: (id) => api.delete(`employees/${id}/`),
};

export default api;
