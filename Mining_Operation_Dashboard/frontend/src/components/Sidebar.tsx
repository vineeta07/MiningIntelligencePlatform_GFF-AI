"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Target, BarChart2, Settings, Shield, Truck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Equipment Monitoring", icon: Truck, path: "/equipment" },
    { name: "Classification", icon: Target, path: "/classify" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "Safety Blast", icon: Shield, path: "http://localhost:5173" },
  ];

  return (
    <aside className="w-64 h-full p-6 flex flex-col gap-6 flex-shrink-0 overflow-y-auto bg-[#0b0f17]/95 border-r border-slate-800/80">
      {/* Brand Logo - Shifted Slightly Down & Without Underline */}
      <div className="flex items-center justify-center pt-3 pb-1 -mx-2 px-0 overflow-hidden">
        <img 
          src="/logo_mip.png" 
          alt="Mining Intelligence Platform Logo" 
          className="w-full h-auto object-contain max-h-48 transform scale-105 transition-transform duration-300 hover:scale-110" 
        />
      </div>

      {/* Nav Section */}
      <div className="flex-1 space-y-6">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Main Menu</div>
          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const isExternal = item.path.startsWith("http");

              return (
                <Link key={item.path} href={item.path} target={isExternal ? "_blank" : undefined} className="block relative">
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-slate-800/90 rounded-2xl shadow-sm border border-slate-700/60"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div
                    className={`relative px-4 py-3 flex items-center gap-3 rounded-2xl transition-colors ${
                      isActive ? "text-slate-100 font-semibold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="text-sm tracking-tight">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Tools</div>
          <nav className="space-y-1">
            <div className="px-4 py-3 flex items-center gap-3 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 cursor-pointer transition-colors">
              <Settings className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span className="text-sm">Settings</span>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}




