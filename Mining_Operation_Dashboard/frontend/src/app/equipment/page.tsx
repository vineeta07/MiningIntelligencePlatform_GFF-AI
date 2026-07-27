"use client";

import { ExternalLink, Truck } from "lucide-react";

export default function EquipmentPage() {
  const url = process.env.NEXT_PUBLIC_EQUIPMENT_MONITORING_URL || "http://localhost:5174";

  return (
    <div className="flex flex-col h-full w-full gap-4 p-6">
      <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-600">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Equipment & Worker Monitoring Module</h1>
            <p className="text-xs text-gray-500">Live operational equipment status, telematics & workforce safety</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
        >
          Open in New Tab <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="flex-1 w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm min-h-[700px]">
        <iframe
          src={url}
          title="Equipment Monitoring"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
