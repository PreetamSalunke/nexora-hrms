
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate Axios instance for refreshing tokens
const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
});

// Attach JWT access token to every API request
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Prevent multiple simultaneous refresh requests
let refreshPromise = null;

function clearSession() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = sessionStorage.getItem("refresh_token");

    if (!refreshToken) {
      clearSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("auth/token/refresh/", {
            refresh: refreshToken,
          })
          .then(({ data }) => {
            sessionStorage.setItem("access_token", data.access);

            // Support refresh-token rotation
            if (data.refresh) {
              sessionStorage.setItem("refresh_token", data.refresh);
            }

            return data.access;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

// Existing Employee CRUD API — unchanged
export const employeeAPI = {
  getAll: (params = {}) => api.get("employees/", { params }),

  getById: (id) => api.get(`employees/${id}/`),

  create: (data) => api.post("employees/", data),

  update: (id, data) => api.patch(`employees/${id}/`, data),

  delete: (id) => api.delete(`employees/${id}/`),
};

export default api;
