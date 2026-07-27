import { useState } from "react";
import { IconSettings } from "../assets/icons";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <>
      <div className="mb-5">
        <h1 className="font-display text-lg font-semibold text-white">Settings</h1>
        <p className="text-[13px] text-slate-500">Site preferences &amp; console configuration</p>
      </div>

      <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B8CFF]/10 text-[#5B8CFF]">
            <IconSettings className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-[14px] font-semibold text-white">General</h2>
            <p className="text-[11.5px] text-slate-500">Ops console preferences</p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[13.5px] font-medium text-slate-100">Push notifications</p>
              <p className="text-[11.5px] text-slate-500">Get notified on critical alerts</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifications((v) => !v)}
              className={[
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                notifications ? "bg-[#3ED6C4]" : "bg-white/[0.1]",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  notifications ? "translate-x-[22px]" : "translate-x-0.5",
                ].join(" ")}
              />
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[13.5px] font-medium text-slate-100">Auto-refresh data</p>
              <p className="text-[11.5px] text-slate-500">Refresh dashboard metrics automatically</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRefresh((v) => !v)}
              className={[
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                autoRefresh ? "bg-[#3ED6C4]" : "bg-white/[0.1]",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  autoRefresh ? "translate-x-[22px]" : "translate-x-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
