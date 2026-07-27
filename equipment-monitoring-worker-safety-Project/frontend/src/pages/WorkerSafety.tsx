import { useEffect, useState } from "react";
import { IconHelmet, IconUsers, IconPlus, IconAlert } from "../assets/icons";
import SafetyGauge from "../components/workers/SafetyGauge";
import WorkerTable from "../components/workers/WorkerTable";
import WorkerFormModal from "../components/workers/WorkerFormModal";
import IncidentTable from "../components/workers/IncidentTable";
import IncidentFormModal from "../components/workers/IncidentFormModal";
import { WORKER_STATUS_STYLE, SEVERITY_STYLE } from "../utils/uiConfig";
import {
  WorkerAPI,
  computeSafetyScore,
  mapIncidentsToSafetySummary,
  mapWorkersToRows,
  mapIncidentsToRows,
  type WorkerSummary,
  type WorkerOut,
  type WorkerCreatePayload,
  type SafetyIncidentOut,
  type SafetyIncidentCreatePayload,
} from "../services";
import type { SafetyIncident } from "../types";

export default function WorkerSafety() {
  const [summary, setSummary] = useState<WorkerSummary | null>(null);
  const [incidentSummary, setIncidentSummary] = useState<SafetyIncident[]>([]);
  const [workers, setWorkers] = useState<WorkerOut[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncidentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Worker modal / CRUD state
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [workerModalMode, setWorkerModalMode] = useState<"create" | "edit">("create");
  const [selectedWorker, setSelectedWorker] = useState<WorkerOut | null>(null);
  const [workerSubmitting, setWorkerSubmitting] = useState(false);

  // Incident modal / CRUD state
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentModalMode, setIncidentModalMode] = useState<"create" | "edit">("create");
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncidentOut | null>(null);
  const [incidentSubmitting, setIncidentSubmitting] = useState(false);

  function fetchAll() {
    return Promise.all([WorkerAPI.summary(), WorkerAPI.incidents({}), WorkerAPI.list()])
      .then(([workerSummary, allIncidents, allWorkers]) => {
        setSummary(workerSummary);
        setIncidentSummary(mapIncidentsToSafetySummary(allIncidents.filter((i) => !i.resolved)));
        setIncidents(allIncidents);
        setWorkers(allWorkers);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load worker data");
      });
  }

  useEffect(() => {
    let cancelled = false;

    fetchAll().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const onDuty = summary?.by_status["on_duty"] ?? 0;
  const safetyScore = summary ? computeSafetyScore(summary) : 0;
  const workerRows = mapWorkersToRows(workers);
  const incidentRows = mapIncidentsToRows(incidents, workers);

  // -- Worker CRUD -----------------------------------------------------
  function handleAddWorkerClick() {
    setWorkerModalMode("create");
    setSelectedWorker(null);
    setWorkerModalOpen(true);
  }

  function handleEditWorkerClick(id: string) {
    const item = workers.find((w) => w.id === id) ?? null;
    setWorkerModalMode("edit");
    setSelectedWorker(item);
    setWorkerModalOpen(true);
  }

  async function handleDeleteWorkerClick(id: string) {
    const item = workers.find((w) => w.id === id);
    if (!window.confirm(`Delete worker "${item?.full_name ?? id}"? This cannot be undone.`)) return;

    try {
      await WorkerAPI.delete(id);
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete worker");
    }
  }

  async function handleWorkerModalSubmit(values: WorkerCreatePayload) {
    setWorkerSubmitting(true);
    try {
      if (workerModalMode === "create") {
        await WorkerAPI.create(values);
      } else if (selectedWorker) {
        await WorkerAPI.update(selectedWorker.id, values);
      }
      await fetchAll();
      setWorkerModalOpen(false);
      setSelectedWorker(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save worker");
    } finally {
      setWorkerSubmitting(false);
    }
  }

  // -- Incident CRUD ----------------------------------------------------
  function handleAddIncidentClick() {
    setIncidentModalMode("create");
    setSelectedIncident(null);
    setIncidentModalOpen(true);
  }

  function handleEditIncidentClick(id: string) {
    const item = incidents.find((i) => i.id === id) ?? null;
    setIncidentModalMode("edit");
    setSelectedIncident(item);
    setIncidentModalOpen(true);
  }

  async function handleResolveIncidentClick(id: string) {
    try {
      await WorkerAPI.updateIncident(id, { resolved: true });
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve incident");
    }
  }

  async function handleDeleteIncidentClick(id: string) {
    if (!window.confirm("Delete this incident? This cannot be undone.")) return;

    try {
      await WorkerAPI.deleteIncident(id);
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete incident");
    }
  }

  async function handleIncidentModalSubmit(values: SafetyIncidentCreatePayload) {
    setIncidentSubmitting(true);
    try {
      if (incidentModalMode === "create") {
        await WorkerAPI.createIncident(values);
      } else if (selectedIncident) {
        await WorkerAPI.updateIncident(selectedIncident.id, {
          incident_type: values.incident_type,
          severity: values.severity,
          description: values.description,
          location: values.location,
        });
      }
      await fetchAll();
      setIncidentModalOpen(false);
      setSelectedIncident(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save incident");
    } finally {
      setIncidentSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-white">Worker Safety</h1>
          <p className="text-[13px] text-slate-500">Compliance &amp; incident tracking</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-[#111624] p-5 text-[13px] text-[#F87171] ring-1 ring-white/[0.06]">
          Unable to reach the backend API: {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06] xl:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B8CFF]/10 text-[#5B8CFF]">
              <IconUsers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-[14px] font-semibold text-white">Workforce</h2>
              <p className="text-[11.5px] text-slate-500">On-site personnel</p>
            </div>
          </div>
          {!loading && summary && (
            <div className="px-5 py-6">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono-data text-[28px] font-semibold leading-none text-white">
                  {onDuty}
                </span>
                <span className="text-[12px] text-slate-500">personnel</span>
              </div>
              <p className="mt-2 text-[12px] text-[#34D399]">
                {summary.total_workers} total registered
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06] xl:col-span-3">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#34D399]/10 text-[#34D399]">
              <IconHelmet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-[14px] font-semibold text-white">Safety Score</h2>
              <p className="text-[11.5px] text-slate-500">Derived from open safety incidents</p>
            </div>
          </div>

          {!loading && <SafetyGauge score={Math.round(safetyScore)} incidents={incidentSummary} />}
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-[#111624] ring-1 ring-white/[0.06]">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B8CFF]/10 text-[#5B8CFF]">
              <IconUsers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-[14px] font-semibold text-white">Workers</h2>
              <p className="text-[11.5px] text-slate-500">All registered personnel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddWorkerClick}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#3ED6C4] px-3.5 py-2 text-[13px] font-semibold text-[#0B0E14] hover:bg-[#3ED6C4]/90"
          >
            <IconPlus className="h-4 w-4" />
            Add Worker
          </button>
        </div>

        {!loading && (
          <WorkerTable
            rows={workerRows}
            statusStyle={WORKER_STATUS_STYLE}
            onEdit={handleEditWorkerClick}
            onDelete={handleDeleteWorkerClick}
          />
        )}
      </section>

      <section className="mt-6 rounded-xl bg-[#111624] ring-1 ring-white/[0.06]">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
              <IconAlert className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-[14px] font-semibold text-white">Safety Incidents</h2>
              <p className="text-[11.5px] text-slate-500">All reported incidents</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddIncidentClick}
            disabled={workers.length === 0}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#3ED6C4] px-3.5 py-2 text-[13px] font-semibold text-[#0B0E14] hover:bg-[#3ED6C4]/90 disabled:opacity-60"
          >
            <IconPlus className="h-4 w-4" />
            Report Incident
          </button>
        </div>

        {!loading && (
          <IncidentTable
            rows={incidentRows}
            severityStyle={SEVERITY_STYLE}
            onEdit={handleEditIncidentClick}
            onResolve={handleResolveIncidentClick}
            onDelete={handleDeleteIncidentClick}
          />
        )}
      </section>

      {workerModalOpen && (
        <WorkerFormModal
          mode={workerModalMode}
          initialValues={selectedWorker}
          submitting={workerSubmitting}
          onSubmit={handleWorkerModalSubmit}
          onClose={() => {
            setWorkerModalOpen(false);
            setSelectedWorker(null);
          }}
        />
      )}

      {incidentModalOpen && (
        <IncidentFormModal
          mode={incidentModalMode}
          workers={workers}
          initialValues={selectedIncident}
          submitting={incidentSubmitting}
          onSubmit={handleIncidentModalSubmit}
          onClose={() => {
            setIncidentModalOpen(false);
            setSelectedIncident(null);
          }}
        />
      )}
    </>
  );
}
