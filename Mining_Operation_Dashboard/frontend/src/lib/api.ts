import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// ── Classification API ──
export async function classifyRock(formData: FormData) {
  const res = await api.post("/classify/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getResults(params?: {
  page?: number;
  limit?: number;
  mine_name?: string;
  region?: string;
  predicted_class?: string;
}) {
  const res = await api.get("/classify/results", { params });
  return res.data;
}

export async function getResultById(id: string) {
  const res = await api.get(`/classify/results/${id}`);
  return res.data;
}

export async function getClassificationStats() {
  const res = await api.get("/classify/stats");
  return res.data;
}

// ── Dashboard API ──
export async function getDashboardOverview() {
  const res = await api.get("/dashboard/overview");
  return res.data;
}

export async function getDashboardKPIs() {
  const res = await api.get("/dashboard/kpis");
  return res.data;
}

export async function getMachineMetrics() {
  const res = await api.get("/dashboard/machines");
  return res.data;
}

export async function getTrends(days: number = 30) {
  const res = await api.get("/dashboard/trends", { params: { days } });
  return res.data;
}

export async function getInsights() {
  const res = await api.get("/dashboard/insights");
  return res.data;
}

// ── Model Info ──
export async function getModelInfo() {
  const res = await api.get("/model/info");
  return res.data;
}
