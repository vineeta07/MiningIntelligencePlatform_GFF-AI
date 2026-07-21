"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Gem,
  PieChart,
  Calendar,
  Filter,
} from "lucide-react";

/* ─── Mock Analytics Data ─── */
function generateDistribution() {
  const classes = ["Basalt", "Coal", "Granite", "Limestone", "Marble", "Quartzite", "Sandstone"];
  const colors = [
    "var(--color-crimson)",
    "var(--color-espresso)",
    "var(--color-terra)",
    "var(--color-amber)",
    "var(--color-sand)",
    "var(--color-olive)",
    "var(--color-terra-light)",
  ];
  return classes.map((name, i) => ({
    name,
    count: Math.floor(10 + Math.random() * 90),
    avg_confidence: +(0.7 + Math.random() * 0.25).toFixed(3),
    color: colors[i],
  }));
}

function generateMonthly() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return months.map((m) => ({
    month: m,
    count: Math.floor(20 + Math.random() * 120),
  }));
}

function generateRecent() {
  const classes = ["Basalt", "Coal", "Granite", "Limestone", "Marble", "Quartzite", "Sandstone"];
  const mines = ["Rajmahal Mine", "Singareni Mine", "Neyveli Mine", "Jharia Mine", "Raniganj Mine"];
  const results = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date();
    d.setHours(d.getHours() - i * 3);
    results.push({
      id: `CLS-${String(1000 - i).padStart(4, "0")}`,
      predicted_class: classes[Math.floor(Math.random() * classes.length)],
      confidence: +(0.7 + Math.random() * 0.28).toFixed(3),
      mine_name: mines[Math.floor(Math.random() * mines.length)],
      classified_at: d.toISOString(),
    });
  }
  return results;
}

export default function AnalyticsPage() {
  const [distribution, setDistribution] = useState<ReturnType<typeof generateDistribution>>([]);
  const [monthly, setMonthly] = useState<ReturnType<typeof generateMonthly>>([]);
  const [recent, setRecent] = useState<ReturnType<typeof generateRecent>>([]);

  useEffect(() => {
    setDistribution(generateDistribution());
    setMonthly(generateMonthly());
    setRecent(generateRecent());
  }, []);

  const totalClassifications = distribution.reduce((s, d) => s + d.count, 0);
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);
  const maxMonthly = Math.max(...monthly.map((m) => m.count), 1);

  return (
    <main className="w-full max-w-[1440px] mx-auto space-y-10 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Analytics & Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Classification trends, mineral distribution analysis, and historical data.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
          <div className="kpi-card">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Total Classifications</div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{totalClassifications}</div>
          </div>
          <div className="kpi-card">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Rock Types Detected</div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>7</div>
          </div>
          <div className="kpi-card">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Avg Confidence</div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-crimson)" }}>
              {(distribution.reduce((s, d) => s + d.avg_confidence, 0) / (distribution.length || 1) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="kpi-card">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Model Accuracy</div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-olive)" }}>71.8%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Class Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <PieChart className="w-4 h-4" style={{ color: "var(--color-crimson)" }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>Class Distribution</h3>
            </div>
            <div className="space-y-3">
              {distribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-20" style={{ color: "var(--color-text-secondary)" }}>{d.name}</span>
                  <div className="flex-1 h-6 rounded overflow-hidden" style={{ background: "var(--color-surface-warm)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className="h-full rounded flex items-center justify-end pr-2"
                      style={{ background: d.color, minWidth: "40px" }}
                    >
                      <span className="text-[10px] font-bold text-white">{d.count}</span>
                    </motion.div>
                  </div>
                  <span className="text-xs tabular-nums font-semibold w-12 text-right" style={{ color: "var(--color-text-muted)" }}>
                    {(d.avg_confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-4 h-4" style={{ color: "var(--color-terra)" }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>Monthly Classification Count</h3>
            </div>
            <div className="flex items-end gap-3 h-48">
              {monthly.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{m.count}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.count / maxMonthly) * 160}px` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="w-full rounded-t-md"
                    style={{ background: i === monthly.length - 1 ? "var(--color-crimson)" : "var(--color-terra-light)" }}
                  />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--color-text-muted)" }}>{m.month}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Classifications Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: "var(--color-amber)" }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>Recent Classifications</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Predicted Class</th>
                  <th>Confidence</th>
                  <th>Mine</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td><span className="font-mono text-xs font-semibold" style={{ color: "var(--color-crimson)" }}>{r.id}</span></td>
                    <td className="font-medium">{r.predicted_class}</td>
                    <td>
                      <span className="font-bold tabular-nums" style={{ color: r.confidence > 0.85 ? "var(--color-olive)" : "var(--color-amber)" }}>
                        {(r.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td>{r.mine_name}</td>
                    <td className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(r.classified_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
  );
}
