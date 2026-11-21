import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retro Arcade Revival — Open-Source Classic Game Recreation",
  description: "Preserving vintage PC and arcade game mechanics with clean-room implementations in Godot, Rust, C, and Python. Open-source, community-driven, forever free.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F17] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
