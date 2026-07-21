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
  crimson: "var(--color-pastel-red)",
  terra: "var(--color-pastel-blue)",
  amber: "var(--color-pastel-yellow)",
  olive: "var(--color-pastel-green)",
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
      className="inner-card flex flex-col justify-between h-full min-h-[140px]"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-2xl bg-white bg-opacity-60 flex items-center justify-center text-gray-800 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-[10px] font-bold bg-white bg-opacity-60 px-2 py-1 rounded-full text-gray-700 shadow-sm">
            {isPositive ? <TrendingUp className="w-3 h-3 text-green-600" /> : isNegative ? <TrendingDown className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-gray-400" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 mb-0.5">{title}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-xs font-semibold text-gray-500">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}
