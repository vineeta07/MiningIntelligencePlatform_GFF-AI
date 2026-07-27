import { IconShield } from "../assets/icons";

export default function BlastSafety() {
  const blastUrl = import.meta.env.VITE_SAFETY_BLAST_CHECKER_URL || "http://localhost:5173";

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full gap-4">
      <div className="flex items-center justify-between bg-[#151929] border border-white/[0.08] px-6 py-4 rounded-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl text-[#F5A623]">
            <IconShield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Safety Blast Checker Integration</h1>
            <p className="text-xs text-slate-400">
              Live integrated view of the Safety Blast Checker application module.
            </p>
          </div>
        </div>

        <a
          href={blastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] hover:bg-[#e0951c] text-black font-semibold text-xs rounded-xl transition-all shadow-md"
        >
          Open in New Tab ↗
        </a>
      </div>

      <div className="flex-1 w-full bg-[#0E1220] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl relative">
        <iframe
          src={blastUrl}
          title="Safety Blast Checker"
          className="w-full h-full border-0 bg-transparent"
          allow="camera; microphone; geolocation"
        />
      </div>
    </div>
  );
}
