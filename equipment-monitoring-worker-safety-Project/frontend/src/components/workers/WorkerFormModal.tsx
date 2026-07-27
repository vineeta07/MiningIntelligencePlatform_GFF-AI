import { useState } from "react";
import { IconClose } from "../../assets/icons";
import type { WorkerOut, WorkerCreatePayload, BackendWorkerStatus } from "../../services";

type WorkerFormMode = "create" | "edit";

type WorkerFormModalProps = {
  mode: WorkerFormMode;
  initialValues?: WorkerOut | null;
  submitting?: boolean;
  onSubmit: (values: WorkerCreatePayload) => void;
  onClose: () => void;
};

const WORKER_STATUSES: BackendWorkerStatus[] = [
  "on_duty",
  "off_duty",
  "on_break",
  "emergency",
  "evacuated",
];

export default function WorkerFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onClose,
}: WorkerFormModalProps) {
  const [employeeCode, setEmployeeCode] = useState(initialValues?.employee_code ?? "");
  const [fullName, setFullName] = useState(initialValues?.full_name ?? "");
  const [role, setRole] = useState(initialValues?.role ?? "");
  const [siteLocation, setSiteLocation] = useState(initialValues?.site_location ?? "");
  const [status, setStatus] = useState<BackendWorkerStatus>(initialValues?.status ?? "off_duty");
  const [contactNumber, setContactNumber] = useState(initialValues?.contact_number ?? "");
  const [helmetSensorId, setHelmetSensorId] = useState(initialValues?.helmet_sensor_id ?? "");
  const [heartRateBpm, setHeartRateBpm] = useState(
    initialValues?.heart_rate_bpm != null ? String(initialValues.heart_rate_bpm) : ""
  );
  const [bodyTemperatureC, setBodyTemperatureC] = useState(
    initialValues?.body_temperature_c != null ? String(initialValues.body_temperature_c) : ""
  );
  const [gasExposurePpm, setGasExposurePpm] = useState(
    initialValues?.gas_exposure_ppm != null ? String(initialValues.gas_exposure_ppm) : ""
  );
  const [currentZone, setCurrentZone] = useState(initialValues?.current_zone ?? "");

  const inputClass =
    "w-full rounded-lg bg-[#0B0E14] px-3 py-2 text-[13px] text-slate-100 ring-1 ring-white/[0.08] outline-none focus:ring-[#3ED6C4]/40";
  const labelClass = "mb-1.5 block text-[11.5px] font-medium text-slate-400";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: WorkerCreatePayload = {
      employee_code: employeeCode,
      full_name: fullName,
      role,
      site_location: siteLocation,
      status,
      contact_number: contactNumber || null,
      helmet_sensor_id: helmetSensorId || null,
      heart_rate_bpm: heartRateBpm !== "" ? Number(heartRateBpm) : null,
      body_temperature_c: bodyTemperatureC !== "" ? Number(bodyTemperatureC) : null,
      gas_exposure_ppm: gasExposurePpm !== "" ? Number(gasExposurePpm) : null,
      current_zone: currentZone || null,
    };

    onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-[#111624] ring-1 ring-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-display text-[14px] font-semibold text-white">
            {mode === "create" ? "Add Worker" : "Edit Worker"}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Employee Code</label>
              <input
                className={inputClass}
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                maxLength={50}
              />
            </div>
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={150}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Role</label>
              <input
                className={inputClass}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as BackendWorkerStatus)}
              >
                {WORKER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Site Location</label>
            <input
              className={inputClass}
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
              required
              maxLength={150}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Contact Number</label>
              <input
                className={inputClass}
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Helmet Sensor ID</label>
              <input
                className={inputClass}
                value={helmetSensorId}
                onChange={(e) => setHelmetSensorId(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Heart Rate (bpm)</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={heartRateBpm}
                onChange={(e) => setHeartRateBpm(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Body Temp (°C)</label>
              <input
                type="number"
                className={inputClass}
                value={bodyTemperatureC}
                onChange={(e) => setBodyTemperatureC(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Gas Exposure (ppm)</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={gasExposurePpm}
                onChange={(e) => setGasExposurePpm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Current Zone</label>
            <input
              className={inputClass}
              value={currentZone}
              onChange={(e) => setCurrentZone(e.target.value)}
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
              disabled={submitting}
              className="rounded-lg bg-[#3ED6C4] px-4 py-2 text-[13px] font-semibold text-[#0B0E14] hover:bg-[#3ED6C4]/90 disabled:opacity-60"
            >
              {submitting ? "Saving..." : mode === "create" ? "Add Worker" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
