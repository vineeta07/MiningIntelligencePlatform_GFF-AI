"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, AlertCircle, Zap } from "lucide-react";

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
    bg: "var(--color-pastel-red)",
    color: "#E53E3E",
    label: "CRITICAL",
  },
  WARNING: {
    icon: AlertTriangle,
    bg: "var(--color-pastel-yellow)",
    color: "#D69E2E",
    label: "WARNING",
  },
  INFO: {
    icon: Info,
    bg: "var(--color-pastel-blue)",
    color: "#3182CE",
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
      className="inner-card transition-all hover:shadow-sm"
      style={{ backgroundColor: config.bg }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white bg-opacity-60 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Icon className="w-5 h-5" style={{ color: config.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-white bg-opacity-60 shadow-sm"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
            <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white bg-opacity-60 shadow-sm text-gray-500">
              {category}
            </span>
          </div>

          <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
          <p className="text-xs leading-relaxed text-gray-600 mb-3">{description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-gray-500">AI Confidence</span>
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
