import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TallerListo | Gestión de órdenes",
  description: "Seguimiento de vehículos y autorización transparente de reparaciones.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}