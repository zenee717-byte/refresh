import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.LOADER_NAME ?? "Script Loader",
  description: "Secure Lua Script Loader",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise">{children}</body>
    </html>
  );
}
