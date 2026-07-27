import { NavLink } from "react-router-dom";
import { IconLogo, IconChevron } from "../../assets/icons";
import { NAV_ITEMS } from "../../utils/uiConfig";

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/[0.06] bg-[#0E1220]",
          "transition-transform duration-200 ease-out lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[76px]" : "w-64",
          "transition-[width] ",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5A623]/10 text-[#F5A623] ring-1 ring-[#F5A623]/25">
            <IconLogo className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[13.5px] font-semibold tracking-tight text-white">SiteWatch</span>
              <span className="font-mono-data text-[10.5px] tracking-wide text-slate-500">OPS CONSOLE</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/"}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  [
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    isActive
                      ? "bg-[#F5A623]/10 text-[#F5A623] ring-1 ring-[#F5A623]/20"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100",
                    collapsed ? "justify-center" : "",
                  ].join(" ")
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden shrink-0 border-t border-white/[0.06] p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200"
          >
            <IconChevron className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
