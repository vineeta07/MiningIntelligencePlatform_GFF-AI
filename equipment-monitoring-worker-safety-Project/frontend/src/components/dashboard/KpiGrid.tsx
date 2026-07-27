import type { KpiItem } from "../../types";

type KpiGridProps = {
  data: KpiItem[];
};

export default function KpiGrid({ data }: KpiGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-xl bg-[#111624] p-5 ring-1 ring-white/[0.06]"
          >
            <span
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ backgroundColor: kpi.accent }}
              aria-hidden="true"
            />
            <div className="flex items-start justify-between">
              <p className="text-[12.5px] font-medium text-slate-400">{kpi.label}</p>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${kpi.accent}1A`, color: kpi.accent }}
              >
                <Icon className="h-[17px] w-[17px]" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono-data text-[28px] font-semibold leading-none text-white">
                {kpi.value}
              </span>
              <span className="text-[12px] text-slate-500">{kpi.unit}</span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[12px]">
              <span className={kpi.trend === "up" ? "text-[#34D399]" : "text-[#F5A623]"}>
                {kpi.trend === "up" ? "▲" : "▼"}
              </span>
              <span className="text-slate-500">{kpi.delta}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
