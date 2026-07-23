"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Gem,
  MapPin,
  User,
  FileText,
  Loader2,
  CheckCircle,
  BarChart3,
  Eye,
  X,
  Camera,
  Layers,
  Crosshair,
} from "lucide-react";

/* ─── Types ─── */
interface ClassificationResult {
  predicted_class: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  ai_explanation?: string;
}


/* ─── Confidence Bar ─── */
function ConfidenceBar({ name, value, isTop }: { name: string; value: number; isTop: boolean }) {
  const pct = (value * 100).toFixed(1);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium w-20 truncate" style={{ color: isTop ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
        {name}
      </span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-warm)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ background: isTop ? "var(--color-crimson)" : "var(--color-terra-light)" }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums w-14 text-right" style={{ color: isTop ? "var(--color-crimson)" : "var(--color-text-muted)" }}>
        {pct}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*            ROCK CLASSIFICATION PAGE                */
/* ═══════════════════════════════════════════════════ */
export default function ClassifyPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [metadata, setMetadata] = useState({
    mine_name: "",
    region: "",
    gps_latitude: "",
    gps_longitude: "",
    operator_name: "",
    notes: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClassify = async () => {
    if (!selectedFile) return;
    setIsClassifying(true);

    try {
      // Try backend first
      const formData = new FormData();
      formData.append("file", selectedFile);
      Object.entries(metadata).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await fetch("http://localhost:8000/api/v1/classify/", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.data || data);
      } else {
        throw new Error("Backend returned an error status.");
      }
    } catch (error) {
      alert("Failed to connect to backend. Make sure the FastAPI server is running on port 8000.");
      console.error(error);
    } finally {
      setIsClassifying(false);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const sortedProbs = result
    ? Object.entries(result.all_probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <main className="w-full max-w-[1440px] mx-auto space-y-10 pb-12">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            AI Rock Image Classification
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Upload rock samples for AI-powered mineral classification with Grad-CAM explainability analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Upload & Metadata ── */}
          <div className="space-y-6">
            {/* Upload Dropzone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              {!previewUrl ? (
                <div
                  className={`dropzone ${isDragging ? "active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-surface-warm)" }}>
                      <Upload className="w-7 h-7" style={{ color: "var(--color-terra)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
                        Drop your rock image here
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        or click to browse — JPEG / PNG supported
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                        <Camera className="w-3.5 h-3.5" /> Camera Capture
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                        <Layers className="w-3.5 h-3.5" /> Batch Upload
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                      <ImageIcon className="w-3.5 h-3.5 inline mr-1.5" />
                      {selectedFile?.name}
                    </span>
                    <button onClick={clearAll} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <X className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                    </button>
                  </div>
                  <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
                    <img src={previewUrl} alt="Rock sample" className="w-full h-64 object-cover" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Metadata Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                <MapPin className="w-4 h-4" style={{ color: "var(--color-terra)" }} />
                Geological Metadata
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Mine Name</label>
                  <input
                    type="text"
                    value={metadata.mine_name}
                    onChange={(e) => setMetadata({ ...metadata, mine_name: e.target.value })}
                    placeholder="e.g. Rajmahal Mine"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Region</label>
                  <input
                    type="text"
                    value={metadata.region}
                    onChange={(e) => setMetadata({ ...metadata, region: e.target.value })}
                    placeholder="e.g. Jharkhand, India"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-text-muted)" }}>GPS Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={metadata.gps_latitude}
                    onChange={(e) => setMetadata({ ...metadata, gps_latitude: e.target.value })}
                    placeholder="24.7914"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-text-muted)" }}>GPS Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={metadata.gps_longitude}
                    onChange={(e) => setMetadata({ ...metadata, gps_longitude: e.target.value })}
                    placeholder="87.3424"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Operator Name</label>
                  <input
                    type="text"
                    value={metadata.operator_name}
                    onChange={(e) => setMetadata({ ...metadata, operator_name: e.target.value })}
                    placeholder="Vineeta"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Notes</label>
                  <input
                    type="text"
                    value={metadata.notes}
                    onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
                    placeholder="Field observations..."
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-primary)" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Classify Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleClassify}
              disabled={!selectedFile || isClassifying}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--color-crimson)" }}
              whileHover={{ scale: selectedFile ? 1.01 : 1 }}
              whileTap={{ scale: selectedFile ? 0.99 : 1 }}
            >
              {isClassifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Rock Sample...
                </>
              ) : (
                "Classify Rock Sample"
              )}
            </motion.button>
          </div>

          {/* ── Right: Results ── */}
          <div>
            <AnimatePresence mode="wait">
              {isClassifying ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(193, 18, 31, 0.08)" }}
                  >
                    <Gem className="w-8 h-8" style={{ color: "var(--color-crimson)" }} />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    AI Engine Processing
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Running EfficientNetV2 inference + Grad-CAM generation...
                  </p>
                  <div className="mt-4 w-48">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: "0%" }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Primary Result */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5" style={{ color: "var(--color-olive)" }} />
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
                        Classification Result
                      </h3>
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-xl" style={{ background: "var(--color-surface-warm)" }}>
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: "rgba(193, 18, 31, 0.1)" }}>
                        <Gem className="w-8 h-8" style={{ color: "var(--color-crimson)" }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                          {result.predicted_class}
                        </div>
                        <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                          Confidence Score:{" "}
                          <span className="font-bold" style={{ color: "var(--color-crimson)" }}>
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        {result.ai_explanation && (
                          <div className="mt-3 text-xs p-3 rounded-lg border border-dashed" style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)", background: "var(--color-surface)" }}>
                            <span className="font-bold" style={{ color: "var(--color-crimson)" }}>AI Insight: </span>
                            {result.ai_explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confidence Matrix */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4" style={{ color: "var(--color-terra)" }} />
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
                        Confidence Matrix — All Classes
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {sortedProbs.map(([name, value], i) => (
                        <ConfidenceBar key={name} name={name} value={value} isTop={i === 0} />
                      ))}
                    </div>
                  </div>

                  {/* Grad-CAM Placeholder */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-4 h-4" style={{ color: "var(--color-amber)" }} />
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
                        AI Explainability — Grad-CAM
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["Original Image", "Grad-CAM Heatmap", "Overlay Analysis"].map((label) => (
                        <div key={label} className="text-center">
                          <div className="rounded-lg overflow-hidden border mb-2 aspect-square flex items-center justify-center" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-warm)" }}>
                            {previewUrl && label === "Original Image" ? (
                              <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
                            ) : previewUrl && label === "Overlay Analysis" ? (
                              <div className="relative w-full h-full">
                                <img src={previewUrl} alt="Overlay" className="w-full h-full object-cover" />
                                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(193, 18, 31, 0.3), rgba(244, 162, 97, 0.2), transparent)", mixBlendMode: "multiply" }} />
                              </div>
                            ) : previewUrl && label === "Grad-CAM Heatmap" ? (
                              <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #FFF8F0, #F4A261, #E07A5F, #C1121F, #3D1C00)" }} />
                            ) : (
                              <Eye className="w-8 h-8" style={{ color: "var(--color-text-muted)" }} />
                            )}
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
                      Grad-CAM highlights regions the AI model focuses on — texture, color, grain patterns, and mineral fractures.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--color-surface-warm)" }}>
                    <Eye className="w-9 h-9" style={{ color: "var(--color-terra-light)" }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    Classification Results
                  </h3>
                  <p className="text-sm max-w-xs" style={{ color: "var(--color-text-muted)" }}>
                    Upload a rock image and click &ldquo;Classify&rdquo; to see AI predictions with Grad-CAM explainability analysis.
                  </p>
                  <div className="mt-6 grid grid-cols-4 gap-2">
                    {["Basalt", "Coal", "Granite", "Limestone", "Marble", "Quartzite", "Sandstone"].map((c) => (
                      <span key={c} className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: "var(--color-surface-warm)", color: "var(--color-text-muted)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
  );
}
