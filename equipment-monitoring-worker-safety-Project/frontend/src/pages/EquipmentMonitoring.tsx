import { useEffect, useState } from "react";
import { IconTruck, IconPlus } from "../assets/icons";
import EquipmentTable from "../components/equipment/EquipmentTable";
import EquipmentFormModal from "../components/equipment/EquipmentFormModal";
import { STATUS_STYLE } from "../utils/uiConfig";
import { EquipmentAPI, mapEquipmentToRows } from "../services";
import type { EquipmentOut, EquipmentCreatePayload } from "../services";
import type { EquipmentRow } from "../types";

export default function EquipmentMonitoring() {
  const [equipment, setEquipment] = useState<EquipmentOut[]>([]);
  const [rows, setRows] = useState<EquipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / CRUD state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOut | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function fetchEquipment() {
    return EquipmentAPI.list()
      .then((data) => {
        setEquipment(data);
        setRows(mapEquipmentToRows(data));
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load equipment");
      });
  }

  useEffect(() => {
    let cancelled = false;

    fetchEquipment().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleAddClick() {
    setModalMode("create");
    setSelectedEquipment(null);
    setModalOpen(true);
  }

  function handleEditClick(id: string) {
    const item = equipment.find((e) => e.id === id) ?? null;
    setModalMode("edit");
    setSelectedEquipment(item);
    setModalOpen(true);
  }

  async function handleDeleteClick(id: string) {
    const item = equipment.find((e) => e.id === id);
    if (!window.confirm(`Delete equipment "${item?.name ?? id}"? This cannot be undone.`)) return;

    try {
      await EquipmentAPI.delete(id);
      await fetchEquipment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete equipment");
    }
  }

  async function handleModalSubmit(values: EquipmentCreatePayload) {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await EquipmentAPI.create(values);
      } else if (selectedEquipment) {
        await EquipmentAPI.update(selectedEquipment.id, values);
      }
      await fetchEquipment();
      setModalOpen(false);
      setSelectedEquipment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save equipment");
    } finally {
      setSubmitting(false);
    }
  }

  const operational = rows.filter((r) => r.status === "Operational").length;
  const maintenance = rows.filter((r) => r.status === "Maintenance").length;
  const idle = rows.filter((r) => r.status === "Idle" || r.status === "Offline").length;

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg font-semibold text-white">Equipment Monitoring</h1>
          <p className="text-[13px] text-slate-500">Fleet status across all active zones</p>
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#3ED6C4] px-3.5 py-2 text-[13px] font-semibold text-[#0B0E14] hover:bg-[#3ED6C4]/90"
        >
          <IconPlus className="h-4 w-4" />
          Add Equipment
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-[#111624] p-5 text-[13px] text-[#F87171] ring-1 ring-white/[0.06]">
          Unable to reach the backend API: {error}
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#111624] p-5 ring-1 ring-white/[0.06]">
          <p className="text-[12.5px] text-slate-400">Operational</p>
          <p className="mt-2 font-mono-data text-2xl font-semibold text-[#34D399]">{operational}</p>
        </div>
        <div className="rounded-xl bg-[#111624] p-5 ring-1 ring-white/[0.06]">
          <p className="text-[12.5px] text-slate-400">Maintenance</p>
          <p className="mt-2 font-mono-data text-2xl font-semibold text-[#F5A623]">{maintenance}</p>
        </div>
        <div className="rounded-xl bg-[#111624] p-5 ring-1 ring-white/[0.06]">
          <p className="text-[12.5px] text-slate-400">Idle</p>
          <p className="mt-2 font-mono-data text-2xl font-semibold text-slate-400">{idle}</p>
        </div>
      </section>

      <div className="rounded-xl bg-[#111624] ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3ED6C4]/10 text-[#3ED6C4]">
            <IconTruck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-[14px] font-semibold text-white">Fleet</h2>
            <p className="text-[11.5px] text-slate-500">All tracked equipment</p>
          </div>
        </div>

        {!loading && (
          <EquipmentTable
            rows={rows}
            statusStyle={STATUS_STYLE}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {modalOpen && (
        <EquipmentFormModal
          mode={modalMode}
          initialValues={selectedEquipment}
          submitting={submitting}
          onSubmit={handleModalSubmit}
          onClose={() => {
            setModalOpen(false);
            setSelectedEquipment(null);
          }}
        />
      )}
    </>
  );
}
