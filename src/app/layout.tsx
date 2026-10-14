import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ülesannete haldur",
  description: "Next.js + Supabase kodutöö",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
