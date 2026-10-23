
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChartNoAxesCombined,
  Settings,
  Building2,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Employees", path: "/employees", icon: Users },
  { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
        border-r border-slate-800 bg-slate-950 text-white
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2">
              <Building2 size={23} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">
                NEXORA
              </h1>
              <p className="text-xs text-slate-400">
                HR Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-slate-400">
                Demo Workspace
              </p>
            </div>
            <Settings size={17} className="ml-auto text-slate-500" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
