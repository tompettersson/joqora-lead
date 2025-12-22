import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth";

export const metadata: Metadata = {
  title: "JOQORA – Jahresrückblick 2025",
  description: "Lead-Magnet für OQEMA: 618 t über Leads realisiert, 316 t Gesamtshop. Die wichtigsten Zahlen im Überblick.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

