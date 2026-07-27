// Static UI configuration (navigation + status styling). This file no longer
// contains any mock/demo data - all dashboard data now comes from the live
// FastAPI backend via src/services.
import {
  IconGrid,
  IconTruck,
  IconUsers,
  IconAlert,
  IconSettings,
} from "../assets/icons";
import type { NavItem, EquipmentStatus, WorkerStatusLabel, IncidentSeverityLabel } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", path: "/", icon: IconGrid },
  { label: "Equipment", path: "/equipment", icon: IconTruck },
  { label: "Workforce", path: "/workers", icon: IconUsers },
  { label: "Alerts", path: "/alerts", icon: IconAlert },
  { label: "Blast Safety", path: "/blast-safety", icon: IconAlert },
  { label: "Settings", path: "/settings", icon: IconSettings },
];

export const STATUS_STYLE: Record<EquipmentStatus, string> = {
  Operational: "text-[#34D399] bg-[#34D399]/10 ring-1 ring-[#34D399]/25",
  Maintenance: "text-[#F5A623] bg-[#F5A623]/10 ring-1 ring-[#F5A623]/25",
  Idle: "text-slate-400 bg-slate-400/10 ring-1 ring-slate-400/20",
  Breakdown: "text-[#F87171] bg-[#F87171]/10 ring-1 ring-[#F87171]/25",
  Offline: "text-slate-500 bg-slate-500/10 ring-1 ring-slate-500/20",
};

export const WORKER_STATUS_STYLE: Record<WorkerStatusLabel, string> = {
  "On Duty": "text-[#34D399] bg-[#34D399]/10 ring-1 ring-[#34D399]/25",
  "Off Duty": "text-slate-500 bg-slate-500/10 ring-1 ring-slate-500/20",
  "On Break": "text-[#5B8CFF] bg-[#5B8CFF]/10 ring-1 ring-[#5B8CFF]/25",
  Emergency: "text-[#F87171] bg-[#F87171]/10 ring-1 ring-[#F87171]/25",
  Evacuated: "text-[#F5A623] bg-[#F5A623]/10 ring-1 ring-[#F5A623]/25",
};

export const SEVERITY_STYLE: Record<IncidentSeverityLabel, string> = {
  Low: "text-[#34D399] bg-[#34D399]/10 ring-1 ring-[#34D399]/25",
  Medium: "text-[#5B8CFF] bg-[#5B8CFF]/10 ring-1 ring-[#5B8CFF]/25",
  High: "text-[#F5A623] bg-[#F5A623]/10 ring-1 ring-[#F5A623]/25",
  Critical: "text-[#F87171] bg-[#F87171]/10 ring-1 ring-[#F87171]/25",
};
