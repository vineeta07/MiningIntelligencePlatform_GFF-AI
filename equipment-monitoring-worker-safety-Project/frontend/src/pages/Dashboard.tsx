import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconTruck, IconHelmet } from "../assets/icons";
import KpiGrid from "../components/dashboard/KpiGrid";
import EquipmentTable from "../components/equipment/EquipmentTable";
import SafetyGauge from "../components/workers/SafetyGauge";
import { STATUS_STYLE } from "../utils/uiConfig";
import {
  EquipmentAPI,
  WorkerAPI,
  buildKpiData,
  computeSafetyScore,
  mapEquipmentToRows,
  mapIncidentsToSafetySummary,
} from "../services";
import type { KpiItem, EquipmentRow, SafetyIncident } from "../types";

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KpiItem[]>([]);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentRow[]>([]);
  const [safetyScore, setSafetyScore] = useState(0);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [equipmentSummary, workerSummary, equipment, openIncidents] = await Promise.all([
          EquipmentAPI.summary(),
          WorkerAPI.summary(),
          EquipmentAPI.list(),
          WorkerAPI.incidents({ resolved: false }),
        ]);

        if (cancelled) return;

        setKpiData(buildKpiData(equipmentSummary, workerSummary));
        setEquipmentRows(mapEquipmentToRows(equipment));
        setSafetyScore(computeSafetyScore(workerSummary));
        setIncidents(mapIncidentsToSafetySummary(openIncidents));
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl bg-[#111624] p-5 text-[13px] text-[#F87171] ring-1 ring-white/[0.06]">
        Unable to reach the backend API: {error}
      </div>
    );
  }

  return (
    <>
      {/* KPI grid */}
      <KpiGrid data={kpiData} />

      {/* Feature cards */}
      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Equipment Monitoring */}
        <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06] xl:col-span-3">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3ED6C4]/10 text-[#3ED6C4]">
                <IconTruck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-[14px] font-semibold text-white">Equipment Monitoring</h2>
                <p className="text-[11.5px] text-slate-500">Fleet status across all active zones</p>
              </div>
            </div>
            <Link to="/equipment" className="text-[12px] font-medium text-[#3ED6C4] hover:text-[#5EE9D8]">
              View fleet
            </Link>
          </div>

          {!loading && <EquipmentTable rows={equipmentRows} statusStyle={STATUS_STYLE} />}
        </div>

        {/* Worker Safety */}
        <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06] xl:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#34D399]/10 text-[#34D399]">
              <IconHelmet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-[14px] font-semibold text-white">Worker Safety</h2>
              <p className="text-[11.5px] text-slate-500">Compliance &amp; incident tracking</p>
            </div>
          </div>

          {!loading && <SafetyGauge score={Math.round(safetyScore)} incidents={incidents} />}
        </div>
      </section>
    </>
  );
}
