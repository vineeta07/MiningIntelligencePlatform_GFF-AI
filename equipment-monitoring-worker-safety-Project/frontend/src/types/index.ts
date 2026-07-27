import type { IconProps } from "../assets/icons";

export type NavItem = {
  label: string;
  path: string;
  icon: (props: IconProps) => JSX.Element;
};

export type KpiTrend = "up" | "down";

export type KpiItem = {
  label: string;
  value: string;
  unit: string;
  delta: string;
  trend: KpiTrend;
  icon: (props: IconProps) => JSX.Element;
  accent: string;
};

export type EquipmentStatus = "Operational" | "Maintenance" | "Idle" | "Breakdown" | "Offline";

export type EquipmentRow = {
  id: string;
  name: string;
  zone: string;
  status: EquipmentStatus;
  load: number;
};

export type SafetyIncident = {
  label: string;
  value: number;
  tone: string;
};

export type WorkerStatusLabel = "On Duty" | "Off Duty" | "On Break" | "Emergency" | "Evacuated";

export type WorkerRow = {
  id: string;
  employeeCode: string;
  name: string;
  role: string;
  zone: string;
  status: WorkerStatusLabel;
};

export type IncidentSeverityLabel = "Low" | "Medium" | "High" | "Critical";

export type IncidentRow = {
  id: string;
  workerId: string;
  workerName: string;
  incidentType: string;
  severity: IncidentSeverityLabel;
  location: string;
  resolved: boolean;
  reportedAt: string;
};
