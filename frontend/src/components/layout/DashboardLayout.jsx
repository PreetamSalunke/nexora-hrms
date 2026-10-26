
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "../../services/api";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const refreshToken = sessionStorage.getItem("refresh_token");

    try {
      if (refreshToken) {
        await api.post("auth/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear local tokens
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");

      setSidebarOpen(false);
      setLoggingOut(false);

      navigate("/login", {
        replace: true,
        state: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
