"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mountain,
  Gauge,
  Zap,
  Fuel,
  Clock,
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Gem,
  BarChart3,
  Cpu,
  Thermometer,
  Users,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import KPICard from "@/components/KPICard";
import InsightCard from "@/components/InsightCard";

/* ─── Mock Data Generator (replaces API calls when backend is offline) ─── */
function generateMockKPIs() {
  return {
    production: {
      daily_tonnage: Math.round(12500 + (Math.random() - 0.5) * 2000),
      mine_utilization: +(72 + Math.random() * 22).toFixed(1),
      ore_grade: +(58 + Math.random() * 20).toFixed(1),
      equipment_health: +(82 + Math.random() * 15).toFixed(1),
      energy_consumption_kwh: Math.round(45000 + Math.random() * 23000),
      carbon_footprint_tons: +(12 + Math.random() * 16).toFixed(1),
    },
    machine_utilization: +(75 + Math.random() * 20).toFixed(1),
    fuel_consumption_liters: Math.round(8000 + Math.random() * 7000),
    downtime_hours: +(2 + Math.random() * 16).toFixed(1),
    ore_recovery_yield: +(85 + Math.random() * 11).toFixed(1),
    safety: {
      active_incidents: Math.floor(Math.random() * 4),
      days_without_incident: Math.floor(5 + Math.random() * 40),
      risk_index: +(0.1 + Math.random() * 0.3).toFixed(2),
      workers_on_site: Math.floor(120 + Math.random() * 160),
      zones: [
        { name: "Zone A — Open Pit", risk: "LOW", workers: Math.floor(30 + Math.random() * 30) },
        { name: "Zone B — Processing", risk: "MEDIUM", workers: Math.floor(40 + Math.random() * 40) },
        { name: "Zone C — Underground", risk: Math.random() > 0.5 ? "HIGH" : "MEDIUM", workers: Math.floor(20 + Math.random() * 30) },
        { name: "Zone D — Storage", risk: "LOW", workers: Math.floor(10 + Math.random() * 20) },
      ],
    },
  };
}

function generateMockMachines() {
  const statuses = ["OPERATIONAL", "OPERATIONAL", "OPERATIONAL", "MAINTENANCE", "IDLE"];
  return [
    { id: "EXC-001", name: "CAT 390F Excavator", type: "Excavator", utilization: +(55 + Math.random() * 43).toFixed(1), fuel_rate: +(30 + Math.random() * 90).toFixed(1), hours_today: +(4 + Math.random() * 8).toFixed(1), status: statuses[Math.floor(Math.random() * statuses.length)], temperature_c: +(65 + Math.random() * 40).toFixed(1) },
    { id: "DMP-003", name: "Komatsu HD785-7", type: "Haul Truck", utilization: +(55 + Math.random() * 43).toFixed(1), fuel_rate: +(30 + Math.random() * 90).toFixed(1), hours_today: +(4 + Math.random() * 8).toFixed(1), status: statuses[Math.floor(Math.random() * statuses.length)], temperature_c: +(65 + Math.random() * 40).toFixed(1) },
    { id: "DRL-002", name: "Atlas Copco D65", type: "Drill Rig", utilization: +(55 + Math.random() * 43).toFixed(1), fuel_rate: +(30 + Math.random() * 90).toFixed(1), hours_today: +(4 + Math.random() * 8).toFixed(1), status: statuses[Math.floor(Math.random() * statuses.length)], temperature_c: +(65 + Math.random() * 40).toFixed(1) },
    { id: "LDR-001", name: "CAT 994K Loader", type: "Loader", utilization: +(55 + Math.random() * 43).toFixed(1), fuel_rate: +(30 + Math.random() * 90).toFixed(1), hours_today: +(4 + Math.random() * 8).toFixed(1), status: statuses[Math.floor(Math.random() * statuses.length)], temperature_c: +(65 + Math.random() * 40).toFixed(1) },
    { id: "BLD-001", name: "CAT D11T Bulldozer", type: "Bulldozer", utilization: +(55 + Math.random() * 43).toFixed(1), fuel_rate: +(30 + Math.random() * 90).toFixed(1), hours_today: +(4 + Math.random() * 8).toFixed(1), status: statuses[Math.floor(Math.random() * statuses.length)], temperature_c: +(65 + Math.random() * 40).toFixed(1) },
    { id: "CRN-002", name: "Liebherr LTM 1300", type: "Crane", utilization: +(55 + Math.random() * 43).toFixed(1), fuel_rate: +(30 + Math.random() * 90).toFixed(1), hours_today: +(4 + Math.random() * 8).toFixed(1), status: statuses[Math.floor(Math.random() * statuses.length)], temperature_c: +(65 + Math.random() * 40).toFixed(1) },
  ];
}

function generateMockInsights() {
  return [
    { id: "INS-001", severity: "WARNING" as const, title: "Excavator EXC-001 — Predictive Maintenance Alert", description: "Hydraulic pressure trending 12% below baseline. Predicted failure window: 48-72 hours. Schedule maintenance to avoid unplanned downtime.", category: "EQUIPMENT", timestamp: new Date().toISOString(), confidence: 0.87 },
    { id: "INS-002", severity: "INFO" as const, title: "Ore Grade Improvement — Zone A", description: "Classification data indicates 8% increase in high-grade ore samples from Zone A over the past 7 days. Consider allocating additional processing capacity.", category: "PRODUCTION", timestamp: new Date().toISOString(), confidence: 0.92 },
    { id: "INS-003", severity: "CRITICAL" as const, title: "Safety Zone C — Elevated Risk Index", description: "Underground Zone C risk index has exceeded threshold (0.35). Recommend reducing active worker count and initiating safety protocol review.", category: "SAFETY", timestamp: new Date().toISOString(), confidence: 0.94 },
    { id: "INS-004", severity: "INFO" as const, title: "Energy Optimization Opportunity", description: "Night shift energy consumption is 23% higher than optimal. Adjusting crusher scheduling could save ~4,200 kWh/day.", category: "ENERGY", timestamp: new Date().toISOString(), confidence: 0.78 },
  ];
}

function generateTrendData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      tonnage: Math.round(12500 + (Math.random() - 0.5) * 4000 + Math.sin(i / 7) * 500),
      utilization: +(82 + (Math.random() - 0.5) * 20).toFixed(1),
    });
  }
  return data;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string }> = {
    OPERATIONAL: { bg: "rgba(96, 108, 56, 0.1)", color: "var(--color-olive)" },
    MAINTENANCE: { bg: "rgba(244, 162, 97, 0.12)", color: "#B8651A" },
    IDLE: { bg: "rgba(61, 28, 0, 0.06)", color: "var(--color-text-muted)" },
    LOW: { bg: "rgba(96, 108, 56, 0.1)", color: "var(--color-olive)" },
    MEDIUM: { bg: "rgba(244, 162, 97, 0.12)", color: "#B8651A" },
    HIGH: { bg: "rgba(193, 18, 31, 0.08)", color: "var(--color-crimson)" },
  };
  const c = config[status] || config.IDLE;
  return (
    <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

/* ─── Mini Sparkline ─── */
function Sparkline({ data, color = "var(--color-crimson)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════ */
/*                    MAIN DASHBOARD                  */
/* ═══════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [kpis, setKpis] = useState<ReturnType<typeof generateMockKPIs> | null>(null);
  const [machines, setMachines] = useState<ReturnType<typeof generateMockMachines>>([]);
  const [insights, setInsights] = useState<ReturnType<typeof generateMockInsights>>([]);
  const [trends, setTrends] = useState<ReturnType<typeof generateTrendData>>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    // Use mock data (will switch to API when backend is running)
    setTimeout(() => {
      setKpis(generateMockKPIs());
      setMachines(generateMockMachines());
      setInsights(generateMockInsights());
      setTrends(generateTrendData());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (!kpis) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-background)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Gem className="w-8 h-8" style={{ color: "var(--color-crimson)" }} />
        </motion.div>
      </div>
    );
  }

  const trendTonnage = trends.map((t) => t.tonnage);
  const trendUtil = trends.map((t) => t.utilization);

  return (
    <main className="w-full max-w-[1440px] mx-auto space-y-10 pb-12">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Mining Operations Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Executive Command Centre — Real-time operational intelligence across all mining zones.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* ── Production KPIs ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: "var(--color-crimson)" }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
              Production Overview
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard title="Daily Tonnage" value={kpis.production.daily_tonnage} unit="t" change={3.2} icon={Mountain} color="crimson" delay={0} />
            <KPICard title="Mine Utilization" value={kpis.production.mine_utilization} unit="%" change={1.8} icon={Gauge} color="terra" delay={1} />
            <KPICard title="Ore Grade" value={kpis.production.ore_grade} unit="%" change={-0.4} icon={Gem} color="amber" delay={2} />
            <KPICard title="Equipment Health" value={kpis.production.equipment_health} unit="%" change={0.6} icon={Activity} color="olive" delay={3} />
            <KPICard title="Energy Draw" value={(kpis.production.energy_consumption_kwh / 1000).toFixed(1)} unit="MWh" change={-2.1} icon={Zap} color="amber" delay={4} />
            <KPICard title="Carbon Footprint" value={kpis.production.carbon_footprint_tons} unit="t CO₂" change={-1.3} icon={TrendingUp} color="olive" delay={5} />
          </div>
        </section>

        {/* ── Operational Metrics Row ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4" style={{ color: "var(--color-terra)" }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
              Real-Time KPIs
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Machine Utilization" value={kpis.machine_utilization} unit="%" change={2.5} icon={Gauge} color="crimson" delay={0} />
            <KPICard title="Fuel Consumption" value={kpis.fuel_consumption_liters.toLocaleString()} unit="L" change={-1.2} icon={Fuel} color="amber" delay={1} />
            <KPICard title="Downtime" value={kpis.downtime_hours} unit="hrs" change={-4.5} icon={Clock} color="terra" delay={2} />
            <KPICard title="Ore Recovery Yield" value={kpis.ore_recovery_yield} unit="%" change={1.1} icon={TrendingUp} color="olive" delay={3} />
          </div>
        </section>

        {/* ── Two Column: Trends + Safety ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trend Sparklines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
                  30-Day Production Trend
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Daily tonnage output & mine utilization</p>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end gap-[3px] h-40 mb-4">
              {trends.map((t, i) => {
                const maxT = Math.max(...trendTonnage);
                const pct = (t.tonnage / maxT) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                    className="flex-1 rounded-t-sm cursor-pointer transition-colors group relative"
                    style={{ background: i === trends.length - 1 ? "var(--color-crimson)" : "var(--color-terra-light)" }}
                    title={`${t.date}: ${t.tonnage.toLocaleString()} t`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-espresso text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{background: "var(--color-espresso)"}}>
                      {t.tonnage.toLocaleString()} t
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
              <span>{trends[0]?.date}</span>
              <span>{trends[Math.floor(trends.length / 2)]?.date}</span>
              <span>{trends[trends.length - 1]?.date}</span>
            </div>
          </motion.div>

          {/* Safety Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4" style={{ color: "var(--color-crimson)" }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>Safety Monitor</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>Active Incidents</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: kpis.safety.active_incidents > 0 ? "var(--color-crimson)" : "var(--color-olive)" }}>
                  {kpis.safety.active_incidents}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>Days Without Incident</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: "var(--color-olive)" }}>
                  {kpis.safety.days_without_incident}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>Risk Index</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: parseFloat(String(kpis.safety.risk_index)) > 0.3 ? "var(--color-crimson)" : "var(--color-amber)" }}>
                  {kpis.safety.risk_index}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>Workers On Site</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>
                  {kpis.safety.workers_on_site}
                </span>
              </div>

              <div className="border-t pt-3 mt-3" style={{ borderColor: "var(--color-border-light)" }}>
                <span className="text-[10px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--color-text-muted)" }}>Zone Status</span>
                <div className="space-y-2">
                  {kpis.safety.zones.map((zone) => (
                    <div key={zone.name} className="flex items-center justify-between">
                      <span className="text-xs truncate flex-1 mr-2" style={{ color: "var(--color-text-secondary)" }}>{zone.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{zone.workers}</span>
                        <StatusBadge status={zone.risk} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Equipment Monitoring ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4" style={{ color: "var(--color-amber)" }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
              Equipment Monitoring
            </h2>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Utilization</th>
                    <th>Fuel Rate</th>
                    <th>Hours Today</th>
                    <th>Temp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td>
                        <span className="font-mono text-xs font-semibold" style={{ color: "var(--color-crimson)" }}>{m.id}</span>
                      </td>
                      <td className="font-medium">{m.name}</td>
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--color-surface-warm)", color: "var(--color-text-secondary)" }}>{m.type}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-warm)" }}>
                            <div className="h-full rounded-full" style={{ width: `${m.utilization}%`, background: Number(m.utilization) > 80 ? "var(--color-olive)" : "var(--color-amber)" }} />
                          </div>
                          <span className="text-xs tabular-nums font-semibold">{m.utilization}%</span>
                        </div>
                      </td>
                      <td className="tabular-nums">{m.fuel_rate} L/hr</td>
                      <td className="tabular-nums">{m.hours_today}h</td>
                      <td>
                        <span className="flex items-center gap-1 tabular-nums">
                          <Thermometer className="w-3 h-3" style={{ color: Number(m.temperature_c) > 90 ? "var(--color-crimson)" : "var(--color-text-muted)" }} />
                          {m.temperature_c}°C
                        </span>
                      </td>
                      <td><StatusBadge status={m.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── AI Insights Engine ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: "var(--color-crimson)" }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
              AI Insights Engine
            </h2>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: "rgba(193, 18, 31, 0.08)", color: "var(--color-crimson)" }}>
              {insights.length} ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <InsightCard key={insight.id} {...insight} delay={i} />
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t pt-6 pb-8 mt-12" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--color-crimson)" }}>
                <Gem className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                Mining Intelligence Platform v1.0
              </span>
            </div>
            <p className="text-[10px] text-center sm:text-right leading-relaxed max-w-lg" style={{ color: "var(--color-text-muted)" }}>
              © 2025 Mining Intelligence Platform. All rights reserved. Developed by Vineeta — AI Rock Classification Module & Mining Operations Dashboard.
            </p>
          </div>
        </footer>
      </main>
  );
}
