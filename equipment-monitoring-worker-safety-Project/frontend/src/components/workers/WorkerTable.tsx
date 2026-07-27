import type { WorkerRow, WorkerStatusLabel } from "../../types";
import { IconEdit, IconTrash } from "../../assets/icons";

type WorkerTableProps = {
  rows: WorkerRow[];
  statusStyle: Record<WorkerStatusLabel, string>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function WorkerTable({ rows, statusStyle, onEdit, onDelete }: WorkerTableProps) {
  return (
    <div className="divide-y divide-white/[0.05]">
      {rows.length === 0 && (
        <p className="px-5 py-6 text-[13px] text-slate-500">No workers found.</p>
      )}
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-4 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium text-slate-100">{row.name}</p>
            <p className="truncate text-[11.5px] text-slate-500">
              {row.employeeCode} &middot; {row.role} &middot; {row.zone}
            </p>
          </div>

          <span className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${statusStyle[row.status]}`}>
            {row.status}
          </span>

          {(onEdit || onDelete) && (
            <div className="flex shrink-0 items-center gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(row.id)}
                  aria-label={`Edit ${row.name}`}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-[#3ED6C4]"
                >
                  <IconEdit className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  aria-label={`Delete ${row.name}`}
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
