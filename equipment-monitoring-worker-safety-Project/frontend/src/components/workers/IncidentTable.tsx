import type { IncidentRow, IncidentSeverityLabel } from "../../types";
import { IconEdit, IconTrash } from "../../assets/icons";

type IncidentTableProps = {
  rows: IncidentRow[];
  severityStyle: Record<IncidentSeverityLabel, string>;
  onEdit?: (id: string) => void;
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function IncidentTable({
  rows,
  severityStyle,
  onEdit,
  onResolve,
  onDelete,
}: IncidentTableProps) {
  return (
    <div className="divide-y divide-white/[0.05]">
      {rows.length === 0 && (
        <p className="px-5 py-6 text-[13px] text-slate-500">No incidents found.</p>
      )}
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-4 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium text-slate-100">{row.incidentType}</p>
            <p className="truncate text-[11.5px] text-slate-500">
              {row.workerName} &middot; {row.location}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${severityStyle[row.severity]}`}
          >
            {row.severity}
          </span>

          <span
            className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${
              row.resolved
                ? "text-[#34D399] bg-[#34D399]/10 ring-1 ring-[#34D399]/25"
                : "text-slate-400 bg-slate-400/10 ring-1 ring-slate-400/20"
            }`}
          >
            {row.resolved ? "Resolved" : "Open"}
          </span>

          {(onEdit || onResolve || onDelete) && (
            <div className="flex shrink-0 items-center gap-1">
              {onResolve && !row.resolved && (
                <button
                  type="button"
                  onClick={() => onResolve(row.id)}
                  className="rounded-md px-2 py-1 text-[11px] font-medium text-[#34D399] hover:bg-[#34D399]/10"
                >
                  Resolve
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(row.id)}
                  aria-label={`Edit ${row.incidentType}`}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-[#3ED6C4]"
                >
                  <IconEdit className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  aria-label={`Delete ${row.incidentType}`}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-[#F87171]"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
