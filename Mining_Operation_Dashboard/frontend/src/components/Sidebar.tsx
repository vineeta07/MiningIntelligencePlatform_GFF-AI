"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Target, BarChart2, BookOpen, Settings, Bell, MessageSquare, Plus, Shield } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Classification", icon: Target, path: "/classify" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "Documentation", icon: BookOpen, path: "/docs" },
    { name: "Safety Blast", icon: Shield, path: "http://localhost:5173" },
  ];

  return (
    <aside className="w-64 h-full p-6 flex flex-col gap-8 flex-shrink-0 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2">
        <Image src="/logo_mip.png" alt="MIP Logo" width={200} height={200} className="object-contain" />
        
      </div>

      {/* Nav Section */}
      <div className="flex-1 space-y-8">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Main</div>
          <nav className="space-y-1">
            {menu.map((item) => {
              const isActive = pathname === item.path;
              const isExternal = item.path.startsWith("http");
              return (
                <Link key={item.path} href={item.path} target={isExternal ? "_blank" : undefined} className="block relative">
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white rounded-2xl shadow-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`relative px-4 py-3 flex items-center gap-3 rounded-2xl transition-colors ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900"}`}>
                    <item.icon className={`w-5 h-5 ${isActive ? "text-gray-900" : "text-gray-400"}`} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Tools</div>
          <nav className="space-y-1">
            <div className="px-4 py-3 flex items-center gap-3 rounded-2xl text-gray-500 hover:text-gray-900 cursor-pointer">
              <Settings className="w-5 h-5 text-gray-400" /> Settings
            </div>
          </nav>
        </div>
      </div>

      {/* User profile */}
      <div className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-bold">V</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-900">Vineeta</div>
          <div className="text-[10px] text-gray-500">v.admin@mining.app</div>
        </div>
      </div>
    </aside>
  );
}
