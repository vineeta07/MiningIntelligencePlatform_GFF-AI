import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mining Intelligence Platform — Command Centre",
  description:
    "Enterprise-grade AI-powered mining operations dashboard integrating rock classification, predictive analytics, and real-time operational monitoring.",
  keywords: [
    "mining",
    "AI",
    "rock classification",
    "operations dashboard",
    "predictive analytics",
  ],
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="h-screen overflow-hidden flex antialiased">
        <Sidebar />
        <div className="flex-1 h-full overflow-y-auto p-6 pr-8">
          {children}
        </div>
      </body>
    </html>
  );
}
