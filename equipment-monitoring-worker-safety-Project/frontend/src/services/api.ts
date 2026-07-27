// API client for the FastAPI backend (Mining Intelligence Platform).
// Base URL is configurable via VITE_API_BASE_URL (see .env / .env.example).

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

const API_V1 = `${API_BASE_URL}/api/v1`;

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_V1}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore body parse errors
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Backend response types (mirror app/schemas.py + summary endpoints)
// ---------------------------------------------------------------------------
export type BackendEquipmentStatus =
  | "operational"
  | "idle"
  | "maintenance"
  | "breakdown"
  | "offline";

export interface EquipmentOut {
  id: string;
  name: string;
  equipment_type: string;
  status: BackendEquipmentStatus;
  site_location: string;
  manufacturer?: string | null;
  model_number?: string | null;
  serial_number?: string | null;
  health_score: number;
  operating_hours: number;
  fuel_level_pct: number;
  temperature_celsius: number;
  last_maintenance_date?: string | null;
  next_maintenance_due?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EquipmentSummary {
  total_equipment: number;
  by_status: Record<string, number>;
  average_health_score: number;
}

// Mirrors backend app/schemas.py EquipmentCreate (all EquipmentBase fields).
export interface EquipmentCreatePayload {
  name: string;
  equipment_type: string;
  status: BackendEquipmentStatus;
  site_location: string;
  manufacturer?: string | null;
  model_number?: string | null;
  serial_number?: string | null;
  health_score?: number;
  operating_hours?: number;
  fuel_level_pct?: number;
  temperature_celsius?: number;
  last_maintenance_date?: string | null;
  next_maintenance_due?: string | null;
}

// Mirrors backend app/schemas.py EquipmentUpdate (all fields optional/partial).
export type EquipmentUpdatePayload = Partial<EquipmentCreatePayload>;

export type BackendWorkerStatus = "on_duty" | "off_duty" | "on_break" | "emergency" | "evacuated";

export interface WorkerOut {
  id: string;
  employee_code: string;
  full_name: string;
  role: string;
  site_location: string;
  status: BackendWorkerStatus;
  contact_number?: string | null;
  helmet_sensor_id?: string | null;
  heart_rate_bpm?: number | null;
  body_temperature_c?: number | null;
  gas_exposure_ppm?: number | null;
  current_zone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerSummary {
  total_workers: number;
  by_status: Record<string, number>;
  open_incidents: number;
  critical_incidents: number;
}

export type SafetyIncidentSeverity = "low" | "medium" | "high" | "critical";

export interface SafetyIncidentOut {
  id: string;
  worker_id: string;
  incident_type: string;
  severity: SafetyIncidentSeverity;
  description?: string | null;
  location?: string | null;
  resolved: boolean;
  reported_at: string;
  resolved_at?: string | null;
}

// Mirrors backend app/schemas.py WorkerCreate (all WorkerBase fields).
export interface WorkerCreatePayload {
  employee_code: string;
  full_name: string;
  role: string;
  site_location: string;
  status: BackendWorkerStatus;
  contact_number?: string | null;
  helmet_sensor_id?: string | null;
  heart_rate_bpm?: number | null;
  body_temperature_c?: number | null;
  gas_exposure_ppm?: number | null;
  current_zone?: string | null;
}

// Mirrors backend app/schemas.py WorkerUpdate (all fields optional/partial).
export type WorkerUpdatePayload = Partial<WorkerCreatePayload>;

// Mirrors backend app/schemas.py SafetyIncidentCreate.
export interface SafetyIncidentCreatePayload {
  worker_id: string;
  incident_type: string;
  severity: SafetyIncidentSeverity;
  description?: string | null;
  location?: string | null;
}

// Mirrors backend app/schemas.py SafetyIncidentUpdate.
export interface SafetyIncidentUpdatePayload {
  incident_type?: string;
  severity?: SafetyIncidentSeverity;
  description?: string | null;
  location?: string | null;
  resolved?: boolean;
}

// ---------------------------------------------------------------------------
// Equipment endpoints
// ---------------------------------------------------------------------------
export const EquipmentAPI = {
  list: (params?: { status?: BackendEquipmentStatus; site_location?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.site_location) query.set("site_location", params.site_location);
    const qs = query.toString();
    return request<EquipmentOut[]>(`/equipment${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<EquipmentOut>(`/equipment/${id}`),
  summary: () => request<EquipmentSummary>(`/equipment/stats/summary`),
  assessment: (id: string) => request<unknown>(`/equipment/${id}/assessment`),
  create: (payload: EquipmentCreatePayload) =>
    request<EquipmentOut>(`/equipment`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: EquipmentUpdatePayload) =>
    request<EquipmentOut>(`/equipment/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    request<void>(`/equipment/${id}`, {
      method: "DELETE",
    }),
};

// ---------------------------------------------------------------------------
// Worker Safety endpoints
// ---------------------------------------------------------------------------
export const WorkerAPI = {
  list: (params?: { status?: BackendWorkerStatus; site_location?: string; role?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.site_location) query.set("site_location", params.site_location);
    if (params?.role) query.set("role", params.role);
    const qs = query.toString();
    return request<WorkerOut[]>(`/workers${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<WorkerOut>(`/workers/${id}`),
  summary: () => request<WorkerSummary>(`/workers/stats/summary`),
  assessment: (id: string) => request<unknown>(`/workers/${id}/assessment`),
  incidents: (params?: { resolved?: boolean; severity?: SafetyIncidentSeverity }) => {
    const query = new URLSearchParams();
    if (params?.resolved !== undefined) query.set("resolved", String(params.resolved));
    if (params?.severity) query.set("severity", params.severity);
    const qs = query.toString();
    return request<SafetyIncidentOut[]>(`/workers/incidents${qs ? `?${qs}` : ""}`);
  },
  create: (payload: WorkerCreatePayload) =>
    request<WorkerOut>(`/workers`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: WorkerUpdatePayload) =>
    request<WorkerOut>(`/workers/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    request<void>(`/workers/${id}`, {
      method: "DELETE",
    }),
  createIncident: (payload: SafetyIncidentCreatePayload) =>
    request<SafetyIncidentOut>(`/workers/incidents`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateIncident: (id: string, payload: SafetyIncidentUpdatePayload) =>
    request<SafetyIncidentOut>(`/workers/incidents/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteIncident: (id: string) =>
    request<void>(`/workers/incidents/${id}`, {
      method: "DELETE",
    }),
};

export { ApiError, API_BASE_URL };
