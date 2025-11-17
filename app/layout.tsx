import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth";

export const metadata: Metadata = {
  title: "JOQORA.DE - Lead Magnet für OQEMA",
  description: "Die Plattform generiert qualifizierte Produktanfragen und leitet alle passenden Anfragen direkt an OQEMA weiter.",
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

