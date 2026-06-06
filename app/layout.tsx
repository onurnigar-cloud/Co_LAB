import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Co_LAB | Dijital Coğrafya Öğretim Laboratuvarı",
  description: "Coğrafya öğretimi için derslik, sunum, 3D model, test ve AI arşiv sistemi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
