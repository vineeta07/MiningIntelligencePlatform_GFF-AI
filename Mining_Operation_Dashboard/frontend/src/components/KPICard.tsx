"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  color?: "crimson" | "terra" | "amber" | "olive";
  delay?: number;
}

const colorMap = {
  crimson: "#FAD2E1", // Soft Pastel Blush Pink
  terra: "#D6E2E9",   // Soft Pastel Ice Blue
  amber: "#FFF1E6",   // Soft Pastel Warm Peach
  olive: "#D8F3DC",   // Soft Pastel Mint Green
};

export default function KPICard({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color = "olive",
  delay = 0,
}: KPICardProps) {
  const bg = colorMap[color];
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="inner-card flex flex-col justify-between h-full min-h-[140px] shadow-sm border border-white/40"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-2xl bg-white/80 border border-white/80 flex items-center justify-center text-slate-800 shadow-sm">
          <Icon className="w-5 h-5 text-slate-800" />
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-[10px] font-bold bg-white/80 border border-white/80 px-2.5 py-1 rounded-full text-slate-800 shadow-sm">
            {isPositive ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : isNegative ? <TrendingDown className="w-3 h-3 text-rose-600" /> : <Minus className="w-3 h-3 text-slate-400" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-600 mb-0.5">{title}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-600">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}

