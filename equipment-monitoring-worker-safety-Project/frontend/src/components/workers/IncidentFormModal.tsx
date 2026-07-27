import { useState } from "react";
import { IconClose } from "../../assets/icons";
import type {
  WorkerOut,
  SafetyIncidentOut,
  SafetyIncidentCreatePayload,
  SafetyIncidentSeverity,
} from "../../services";

type IncidentFormMode = "create" | "edit";

type IncidentFormModalProps = {
  mode: IncidentFormMode;
  workers: WorkerOut[];
  initialValues?: SafetyIncidentOut | null;
  submitting?: boolean;
  onSubmit: (values: SafetyIncidentCreatePayload) => void;
  onClose: () => void;
};

const SEVERITIES: SafetyIncidentSeverity[] = ["low", "medium", "high", "critical"];

export default function IncidentFormModal({
  mode,
  workers,
  initialValues,
  submitting,
  onSubmit,
  onClose,
}: IncidentFormModalProps) {
  const [workerId, setWorkerId] = useState(initialValues?.worker_id ?? workers[0]?.id ?? "");
  const [incidentType, setIncidentType] = useState(initialValues?.incident_type ?? "");
  const [severity, setSeverity] = useState<SafetyIncidentSeverity>(initialValues?.severity ?? "low");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");

  const inputClass =
    "w-full rounded-lg bg-[#0B0E14] px-3 py-2 text-[13px] text-slate-100 ring-1 ring-white/[0.08] outline-none focus:ring-[#3ED6C4]/40";
  const labelClass = "mb-1.5 block text-[11.5px] font-medium text-slate-400";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: SafetyIncidentCreatePayload = {
      worker_id: workerId,
      incident_type: incidentType,
      severity,
      description: description || null,
      location: location || null,
    };

    onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-[#111624] ring-1 ring-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-display text-[14px] font-semibold text-white">
            {mode === "create" ? "Report Incident" : "Edit Incident"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-white/[0.06] hover:text-slate-200"
            aria-label="Close"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className={labelClass}>Worker</label>
            <select
              className={inputClass}
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
              disabled={mode === "edit"}
            >
              {workers.length === 0 && <option value="">No workers available</option>}
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.full_name} ({w.employee_code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Incident Type</label>
              <input
                className={inputClass}
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className={labelClass}>Severity</label>
              <select
                className={inputClass}
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SafetyIncidentSeverity)}
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-slate-400 hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (mode === "create" && workers.length === 0)}
              className="rounded-lg bg-[#3ED6C4] px-4 py-2 text-[13px] font-semibold text-[#0B0E14] hover:bg-[#3ED6C4]/90 disabled:opacity-60"
            >
              {submitting ? "Saving..." : mode === "create" ? "Report Incident" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
