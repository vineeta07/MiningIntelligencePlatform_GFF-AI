import { IconGauge } from "../../assets/icons";
import { useSafetyGauge } from "../../hooks/useSafetyGauge";
import type { SafetyIncident } from "../../types";

type SafetyGaugeProps = {
  score: number;
  incidents: SafetyIncident[];
};

export default function SafetyGauge({ score, incidents }: SafetyGaugeProps) {
  const { circumference, offset } = useSafetyGauge(score);

  return (
    <div className="flex flex-col items-center gap-4 px-5 py-6">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r="54" stroke="#1E2537" strokeWidth="9" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#34D399"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono-data text-2xl font-semibold text-white">{score}</span>
          <span className="flex items-center gap-1 text-[10.5px] text-slate-500">
            <IconGauge className="h-3 w-3" />
            score
          </span>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        {incidents.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="text-[12px] text-slate-400">{item.label}</span>
            <span
              className="font-mono-data text-[13px] font-semibold"
              style={{ color: item.value === 0 ? "#34D399" : item.tone }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
