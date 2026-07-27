// Maps raw backend payloads (services/api.ts) into the view models the
// existing UI components already expect (types/index.ts). Keeping this
// mapping layer separate means components and their props stay untouched.
import { IconTruck, IconUsers, IconAlert, IconShield } from "../assets/icons";
import type {
  KpiItem,
  EquipmentRow,
  EquipmentStatus,
  SafetyIncident,
  WorkerRow,
  WorkerStatusLabel,
  IncidentRow,
  IncidentSeverityLabel,
} from "../types";
import type {
  EquipmentOut,
  EquipmentSummary,
  WorkerSummary,
  WorkerOut,
  SafetyIncidentOut,
  BackendEquipmentStatus,
  BackendWorkerStatus,
} from "./api";

// ---------------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------------
const EQUIPMENT_STATUS_LABEL: Record<BackendEquipmentStatus, EquipmentStatus> = {
  operational: "Operational",
  maintenance: "Maintenance",
  idle: "Idle",
  breakdown: "Breakdown",
  offline: "Offline",
};

export function mapEquipmentToRows(items: EquipmentOut[]): EquipmentRow[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    zone: item.site_location,
    status: EQUIPMENT_STATUS_LABEL[item.status] ?? "Idle",
    load: Math.round(item.health_score),
  }));
}

// ---------------------------------------------------------------------------
// KPI grid (Dashboard overview)
// ---------------------------------------------------------------------------
export function buildKpiData(
  equipmentSummary: EquipmentSummary,
  workerSummary: WorkerSummary
): KpiItem[] {
  const onDuty = workerSummary.by_status["on_duty"] ?? 0;
  const onBreak = workerSummary.by_status["on_break"] ?? 0;
  const operational = equipmentSummary.by_status["operational"] ?? 0;
  const maintenance = equipmentSummary.by_status["maintenance"] ?? 0;
  const safetyScore = computeSafetyScore(workerSummary);

  return [
    {
      label: "Active Equipment",
      value: String(equipmentSummary.total_equipment),
      unit: "units",
      delta: `${operational} operational, ${maintenance} in maintenance`,
      trend: maintenance > operational ? "down" : "up",
      icon: IconTruck,
      accent: "#3ED6C4",
    },
    {
      label: "Workers On Site",
      value: String(onDuty),
      unit: "personnel",
      delta: `${onBreak} on break`,
      trend: onDuty > 0 ? "up" : "down",
      icon: IconUsers,
      accent: "#5B8CFF",
    },
    {
      label: "Critical Alerts",
      value: String(workerSummary.critical_incidents),
      unit: "open",
      delta: `${workerSummary.open_incidents} unresolved total`,
      trend: workerSummary.critical_incidents > 0 ? "down" : "up",
      icon: IconAlert,
      accent: "#F5A623",
    },
    {
      label: "Overall Safety Score",
      value: safetyScore.toFixed(1),
      unit: "/ 100",
      delta:
        workerSummary.open_incidents === 0
          ? "No open incidents"
          : `${workerSummary.open_incidents} open incident(s)`,
      trend: safetyScore >= 85 ? "up" : "down",
      icon: IconShield,
      accent: "#34D399",
    },
  ];
}

/**
 * Derives a 0-100 safety score from open/critical incident counts, since the
 * backend does not expose a single aggregate score directly.
 */
export function computeSafetyScore(workerSummary: WorkerSummary): number {
  const penalty = workerSummary.open_incidents * 4 + workerSummary.critical_incidents * 12;
  return Math.max(0, Math.min(100, 100 - penalty));
}

// ---------------------------------------------------------------------------
// Safety incidents (grouped by severity, for the gauge card + alerts list)
// ---------------------------------------------------------------------------
const SEVERITY_LABEL: Record<string, string> = {
  critical: "Critical incidents",
  high: "High severity incidents",
  medium: "Medium severity incidents",
  low: "Low severity incidents",
};

const SEVERITY_TONE: Record<string, string> = {
  critical: "#F87171",
  high: "#F5A623",
  medium: "#5B8CFF",
  low: "#34D399",
};

export function mapIncidentsToSafetySummary(incidents: SafetyIncidentOut[]): SafetyIncident[] {
  const order = ["critical", "high", "medium", "low"];
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const incident of incidents) {
    counts[incident.severity] = (counts[incident.severity] ?? 0) + 1;
  }
  return order.map((severity) => ({
    label: SEVERITY_LABEL[severity],
    value: counts[severity] ?? 0,
    tone: SEVERITY_TONE[severity],
  }));
}

// ---------------------------------------------------------------------------
// Workers (table rows for the Worker Safety CRUD table)
// ---------------------------------------------------------------------------
const WORKER_STATUS_LABEL: Record<BackendWorkerStatus, WorkerStatusLabel> = {
  on_duty: "On Duty",
  off_duty: "Off Duty",
  on_break: "On Break",
  emergency: "Emergency",
  evacuated: "Evacuated",
};

export function mapWorkersToRows(items: WorkerOut[]): WorkerRow[] {
  return items.map((item) => ({
    id: item.id,
    employeeCode: item.employee_code,
    name: item.full_name,
    role: item.role,
    zone: item.site_location,
    status: WORKER_STATUS_LABEL[item.status] ?? "Off Duty",
  }));
}

// ---------------------------------------------------------------------------
// Safety incidents (table rows for the Incident CRUD table)
// ---------------------------------------------------------------------------
const INCIDENT_SEVERITY_LABEL: Record<string, IncidentSeverityLabel> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function mapIncidentsToRows(
  incidents: SafetyIncidentOut[],
  workers: WorkerOut[]
): IncidentRow[] {
  const workerNameById = new Map(workers.map((w) => [w.id, w.full_name]));
  return incidents.map((incident) => ({
    id: incident.id,
    workerId: incident.worker_id,
    workerName: workerNameById.get(incident.worker_id) ?? "Unknown worker",
    incidentType: incident.incident_type,
    severity: INCIDENT_SEVERITY_LABEL[incident.severity] ?? "Low",
    location: incident.location ?? "Unknown",
    resolved: incident.resolved,
    reportedAt: incident.reported_at,
  }));
}
