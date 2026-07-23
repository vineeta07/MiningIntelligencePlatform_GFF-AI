"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Server,
  Database,
  Cpu,
  TestTube,
  BookOpen,
  Rocket,
  Shield,
  Gem,
  ExternalLink,
} from "lucide-react";

const documents = [
  {
    id: "srs",
    title: "Software Requirement Specification (SRS)",
    description: "Exhaustive breakdown of structural, performance, security, and algorithmic constraints for the Mining Intelligence Platform.",
    icon: FileText,
    color: "var(--color-crimson)",
    bg: "rgba(193, 18, 31, 0.08)",
    sections: ["Functional Requirements", "Non-Functional Requirements", "System Constraints", "Data Flow Diagrams"],
  },
  {
    id: "architecture",
    title: "System Architecture Diagram",
    description: "Deep blueprint map tracking client nodes, ingestion microservices, asynchronous workers, and persistent data tiers.",
    icon: Server,
    color: "var(--color-terra)",
    bg: "rgba(224, 122, 95, 0.1)",
    sections: ["Frontend (Next.js)", "Backend (FastAPI)", "AI Engine (PyTorch)", "Data Layer (PostgreSQL, MongoDB, MinIO)"],
  },
  {
    id: "database",
    title: "Database Schema (ER Diagram)",
    description: "Full relational mappings for PostgreSQL metadata tables and unstructured tracking models for MongoDB collections.",
    icon: Database,
    color: "var(--color-amber)",
    bg: "rgba(244, 162, 97, 0.12)",
    sections: ["classification_results", "production_metrics", "telemetry_logs (MongoDB)", "Image Storage (MinIO)"],
  },
  {
    id: "api",
    title: "API Documentation (OpenAPI/Swagger)",
    description: "Interactive documentation exposed at /docs detailing contract payloads, security schemes, and error classes.",
    icon: ExternalLink,
    color: "var(--color-olive)",
    bg: "rgba(96, 108, 56, 0.1)",
    sections: ["POST /classify", "GET /results", "GET /dashboard/overview", "GET /dashboard/kpis"],
  },
  {
    id: "ai-model",
    title: "AI Model Documentation",
    description: "Deep documentation covering base model parameters, precision validation scores (Precision, Recall, F1-Score), layer dimensions, and training hyperparameters.",
    icon: Cpu,
    color: "var(--color-crimson)",
    bg: "rgba(193, 18, 31, 0.08)",
    sections: ["EfficientNetV2 Architecture", "7 Rock Classes", "Test Accuracy: 78.2%", "Grad-CAM Explainability"],
  },
  {
    id: "test-suite",
    title: "Test Suite & Verification Reports",
    description: "Comprehensive suite containing unit verification cases, integration tracking scripts, and load simulation metrics.",
    icon: TestTube,
    color: "var(--color-terra)",
    bg: "rgba(224, 122, 95, 0.1)",
    sections: ["Unit Tests", "Integration Tests", "API Load Tests", "Model Accuracy Validation"],
  },
  {
    id: "user-manual",
    title: "User Manual",
    description: "Field engineer and command supervisor documentation outlining system activation, image logging protocols, and dashboard navigation.",
    icon: BookOpen,
    color: "var(--color-amber)",
    bg: "rgba(244, 162, 97, 0.12)",
    sections: ["Getting Started", "Rock Classification Guide", "Dashboard Navigation", "Troubleshooting"],
  },
  {
    id: "deployment",
    title: "Deployment Guide",
    description: "Step-by-step installation directives outlining environment settings, Docker commands, and production scaling rules.",
    icon: Rocket,
    color: "var(--color-olive)",
    bg: "rgba(96, 108, 56, 0.1)",
    sections: ["Docker Compose Setup", "Environment Variables", "Production Build", "CI/CD Pipeline"],
  },
];

export default function DocsPage() {
  return (
    <main className="w-full max-w-[1440px] mx-auto space-y-10 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            System Documentation
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Complete technical documentation suite for the Mining Intelligence Platform.
          </p>
        </motion.div>

        {/* Model Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(193, 18, 31, 0.08)" }}>
              <Gem className="w-5 h-5" style={{ color: "var(--color-crimson)" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>AI Model Overview</h2>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>EfficientNetV2 — Rock & Mineral Classification</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Architecture", value: "EfficientNetV2" },
              { label: "Input Size", value: "224 × 224" },
              { label: "Classes", value: "7" },
              { label: "Test Accuracy", value: "78.16%" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg" style={{ background: "var(--color-surface-warm)" }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--color-text-muted)" }}>{item.label}</div>
                <div className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Basalt", "Coal", "Granite", "Limestone", "Marble", "Quartzite", "Sandstone"].map((c) => (
              <span key={c} className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: "var(--color-surface-accent)", color: "var(--color-text-secondary)" }}>
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, i) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="glass-card p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: doc.bg }}>
                    <Icon className="w-5 h-5" style={{ color: doc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
                      {doc.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>
                      {doc.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.sections.map((s) => (
                        <span key={s} className="text-[9px] font-medium px-2 py-0.5 rounded" style={{ background: "var(--color-surface-warm)", color: "var(--color-text-muted)" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mt-8"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-primary)" }}>
            Technology Stack
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { cat: "O1 — Frontend", items: "Next.js · Tailwind CSS · TypeScript" },
              { cat: "O2 — Backend", items: "Python (FastAPI) · REST API" },
              { cat: "O3 — AI Frameworks", items: "PyTorch · OpenCV · Scikit-learn" },
              { cat: "O4 — Data & Storage", items: "PostgreSQL · MongoDB · MinIO" },
              { cat: "O5 — Deployment", items: "Docker · Docker Compose · GitHub Actions" },
            ].map((stack) => (
              <div key={stack.cat} className="p-3 rounded-lg" style={{ background: "var(--color-surface-warm)" }}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-crimson)" }}>{stack.cat}</div>
                <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{stack.items}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
  );
}
