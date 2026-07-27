import { useEffect, useState } from "react";
import { IconAlert } from "../assets/icons";
import { EquipmentAPI, WorkerAPI, type SafetyIncidentOut } from "../services";

type AlertItem = { label: string; tone: string };

const SEVERITY_TONE: Record<string, string> = {
  critical: "#F87171",
  high: "#F5A623",
  medium: "#5B8CFF",
  low: "#34D399",
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [equipment, incidents] = await Promise.all([
          EquipmentAPI.list(),
          WorkerAPI.incidents({ resolved: false }),
        ]);

        if (cancelled) return;

        const maintenanceAlerts: AlertItem[] = equipment
          .filter((e) => e.status === "maintenance" || e.status === "breakdown")
          .map((e) => ({
            label: `${e.name} flagged for ${e.status === "breakdown" ? "breakdown" : "maintenance"}`,
            tone: e.status === "breakdown" ? "#F87171" : "#F5A623",
          }));

        const incidentAlerts: AlertItem[] = (incidents as SafetyIncidentOut[]).map((i) => ({
          label: `${i.incident_type} (${i.severity}) - ${i.location ?? "location unknown"}`,
          tone: SEVERITY_TONE[i.severity] ?? "#5B8CFF",
        }));

        setAlerts([...incidentAlerts, ...maintenanceAlerts]);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load alerts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="mb-5">
        <h1 className="font-display text-lg font-semibold text-white">Alerts</h1>
        <p className="text-[13px] text-slate-500">Open items requiring attention</p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-[#111624] p-5 text-[13px] text-[#F87171] ring-1 ring-white/[0.06]">
          Unable to reach the backend API: {error}
        </div>
      )}

      <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
            <IconAlert className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-[14px] font-semibold text-white">Active Alerts</h2>
            <p className="text-[11.5px] text-slate-500">{alerts.length} open</p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {!loading && alerts.length === 0 && (
            <p className="px-5 py-6 text-[13px] text-slate-500">No open alerts. Everything looks good.</p>
          )}
          {alerts.map((alert, idx) => (
            <div key={`${alert.label}-${idx}`} className="flex items-center gap-3 px-5 py-3.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: alert.tone }} />
              <p className="text-[13px] text-slate-200">{alert.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
