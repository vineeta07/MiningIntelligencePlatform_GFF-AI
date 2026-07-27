import { useState } from "react";
import { IconClose } from "../../assets/icons";
import type { EquipmentOut, EquipmentCreatePayload, BackendEquipmentStatus } from "../../services";

type EquipmentFormMode = "create" | "edit";

type EquipmentFormModalProps = {
  mode: EquipmentFormMode;
  initialValues?: EquipmentOut | null;
  submitting?: boolean;
  onSubmit: (values: EquipmentCreatePayload) => void;
  onClose: () => void;
};

const EQUIPMENT_TYPES: string[] = [
  "excavator",
  "drill_rig",
  "haul_truck",
  "loader",
  "conveyor",
  "crusher",
  "bulldozer",
];

const EQUIPMENT_STATUSES: BackendEquipmentStatus[] = [
  "operational",
  "idle",
  "maintenance",
  "breakdown",
  "offline",
];

function toInputDate(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export default function EquipmentFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onClose,
}: EquipmentFormModalProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [equipmentType, setEquipmentType] = useState(initialValues?.equipment_type ?? EQUIPMENT_TYPES[0]);
  const [status, setStatus] = useState<BackendEquipmentStatus>(initialValues?.status ?? "operational");
  const [siteLocation, setSiteLocation] = useState(initialValues?.site_location ?? "");
  const [manufacturer, setManufacturer] = useState(initialValues?.manufacturer ?? "");
  const [modelNumber, setModelNumber] = useState(initialValues?.model_number ?? "");
  const [serialNumber, setSerialNumber] = useState(initialValues?.serial_number ?? "");
  const [healthScore, setHealthScore] = useState(String(initialValues?.health_score ?? 100));
  const [operatingHours, setOperatingHours] = useState(String(initialValues?.operating_hours ?? 0));
  const [fuelLevelPct, setFuelLevelPct] = useState(String(initialValues?.fuel_level_pct ?? 100));
  const [temperatureCelsius, setTemperatureCelsius] = useState(
    String(initialValues?.temperature_celsius ?? 25)
  );
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(
    toInputDate(initialValues?.last_maintenance_date)
  );
  const [nextMaintenanceDue, setNextMaintenanceDue] = useState(
    toInputDate(initialValues?.next_maintenance_due)
  );

  const inputClass =
    "w-full rounded-lg bg-[#0B0E14] px-3 py-2 text-[13px] text-slate-100 ring-1 ring-white/[0.08] outline-none focus:ring-[#3ED6C4]/40";
  const labelClass = "mb-1.5 block text-[11.5px] font-medium text-slate-400";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: EquipmentCreatePayload = {
      name,
      equipment_type: equipmentType,
      status,
      site_location: siteLocation,
      manufacturer: manufacturer || null,
      model_number: modelNumber || null,
      serial_number: serialNumber || null,
      health_score: Number(healthScore),
      operating_hours: Number(operatingHours),
      fuel_level_pct: Number(fuelLevelPct),
      temperature_celsius: Number(temperatureCelsius),
      last_maintenance_date: lastMaintenanceDate ? new Date(lastMaintenanceDate).toISOString() : null,
      next_maintenance_due: nextMaintenanceDue ? new Date(nextMaintenanceDue).toISOString() : null,
    };

    onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-[#111624] ring-1 ring-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-display text-[14px] font-semibold text-white">
            {mode === "create" ? "Add Equipment" : "Edit Equipment"}
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
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Equipment Type</label>
              <select
                className={inputClass}
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
              >
                {EQUIPMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as BackendEquipmentStatus)}
              >
                {EQUIPMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Manufacturer</label>
              <input className={inputClass} value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Model No.</label>
              <input className={inputClass} value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Serial No.</label>
              <input className={inputClass} value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Health Score (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className={inputClass}
                value={healthScore}
                onChange={(e) => setHealthScore(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Operating Hours</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Fuel Level (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className={inputClass}
                value={fuelLevelPct}
                onChange={(e) => setFuelLevelPct(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Temperature (°C)</label>
              <input
                type="number"
                className={inputClass}
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Last Maintenance</label>
              <input
                type="date"
                className={inputClass}
                value={lastMaintenanceDate}
                onChange={(e) => setLastMaintenanceDate(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Next Maintenance Due</label>
              <input
                type="date"
                className={inputClass}
                value={nextMaintenanceDue}
                onChange={(e) => setNextMaintenanceDue(e.target.value)}
              />
            </div>
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
              {submitting ? "Saving..." : mode === "create" ? "Add Equipment" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
