import { IconMenu, IconSearch, IconBell } from "../../assets/icons";

type NavbarProps = {
  onOpenMobile: () => void;
};

export default function Navbar({ onOpenMobile }: NavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#0B0E14]/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-slate-100 lg:hidden"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate font-display text-[15px] font-semibold text-white sm:text-base">
          Northgate Industrial Site
        </h1>
        <p className="hidden truncate text-xs text-slate-500 sm:block">Live operations · Updated 12 seconds ago</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06] md:flex">
          <IconSearch className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets, workers, zones…"
            className="w-52 bg-transparent text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="relative rounded-lg p-2.5 text-slate-400 ring-1 ring-white/[0.06] hover:bg-white/[0.05] hover:text-slate-100"
        >
          <IconBell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F5A623] ring-2 ring-[#0B0E14]" />
        </button>

        <div className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-white/[0.05]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5B8CFF] to-[#3ED6C4] font-mono-data text-[12px] font-semibold text-white">
            RM
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-[13px] font-medium text-slate-100">R. Mercer</p>
            <p className="text-[11px] text-slate-500">Site Supervisor</p>
          </div>
        </div>
      </div>
    </header>
  );
}
