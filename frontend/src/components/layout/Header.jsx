
import {
  Menu,
  Bell,
  Search,
  UserRound,
  LogOut,
  LoaderCircle,
} from "lucide-react";

function Header({ onMenuClick, onLogout, loggingOut = false }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            HR Workspace
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your workforce efficiently
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search Placeholder */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />
          <span className="pr-12 text-sm text-slate-400">
            Search workspace
          </span>
        </div>

        {/* Notifications Placeholder */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
          title="Notifications coming soon"
          disabled
        >
          <Bell size={21} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-5">
          <div className="rounded-full bg-indigo-100 p-2 text-indigo-700">
            <UserRound size={19} />
          </div>

          <span className="hidden text-sm font-semibold text-slate-700 sm:block">
            Admin
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          aria-label="Logout"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
        >
          {loggingOut ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}

          <span className="hidden sm:inline">
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
