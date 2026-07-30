"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

interface InsightCardProps {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  category: string;
  confidence: number;
  timestamp: string;
  delay?: number;
}

const severityConfig = {
  CRITICAL: {
    icon: AlertCircle,
    bg: "#FAD2E1", // Pastel Blush Pink
    color: "#991B1B",
    label: "CRITICAL",
  },
  WARNING: {
    icon: AlertTriangle,
    bg: "#FFF1E6", // Pastel Warm Peach
    color: "#9A3412",
    label: "WARNING",
  },
  INFO: {
    icon: Info,
    bg: "#D6E2E9", // Pastel Soft Ice Blue
    color: "#1E40AF",
    label: "INSIGHT",
  },
};

export default function InsightCard({
  severity,
  title,
  description,
  category,
  confidence,
  delay = 0,
}: InsightCardProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.12 }}
      className="inner-card transition-all hover:shadow-md border border-white/60 shadow-sm"
      style={{ backgroundColor: config.bg }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/80 border border-white/80 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Icon className="w-5 h-5" style={{ color: config.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white/80 border border-white/80 shadow-sm"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 border border-white/80 shadow-sm text-slate-700">
              {category}
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
          <p className="text-xs leading-relaxed text-slate-700 mb-3">{description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-600">AI Confidence</span>
              <div className="w-16 h-1.5 rounded-full bg-white overflow-hidden shadow-sm">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${confidence * 100}%`, background: config.color }}
                />
              </div>
              <span className="text-[10px] font-bold tabular-nums" style={{ color: config.color }}>
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

