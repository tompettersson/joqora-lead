"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth";
import Login from "@/components/login";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  Area,
} from "recharts";

// === Data (edit here) ===

const leadStats = {
  soldToLeadsT: 517.285, // t real aus Leads
  offerPotentialT: 1722.569, // t Angebotsvolumen (Einzelabrufe)
  annualPotentialT: 22881.11, // t bekannte Jahresbedarfe (unvollständig)
};

const monthly = [
  { label: "Jan", shopTotalT: 34.5, oqemaT: 2.34 },
  { label: "Feb", shopTotalT: 15.54, oqemaT: 3.6 },
  { label: "Mrz", shopTotalT: 20.97, oqemaT: 1.1 },
  { label: "Apr", shopTotalT: 31.68, oqemaT: 2.47 },
  { label: "Mai", shopTotalT: 39.87, oqemaT: 2.47 },
  { label: "Jun", shopTotalT: 25.32, oqemaT: 3.6 },
  { label: "Jul", shopTotalT: 14.87, oqemaT: 0.15 },
  { label: "Aug", shopTotalT: 28.38, oqemaT: 0.0 },
  { label: "Sep", shopTotalT: 19.36, oqemaT: 1.0 },
  { label: "Okt", shopTotalT: 30.43, oqemaT: 5.95 },
];

// === Colors ===

const COLORS = {
  leads: "#67c39c", // Standard Grün (bleibt für Leads/Monatsbalken)
  shop: "#839c9a", // Shop-Balken (graugrün)
  joqoraVis: "#1E858F", // bläuliches Grün für JOQORA Sichtbarkeit
  oqemaVis: "#67c39c", // normales Grün für OQEMA Sichtbarkeit
};

// === Helpers ===

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const shopTotalT = sum(monthly.map((m) => m.shopTotalT));
const shopOqemaT = sum(monthly.map((m) => m.oqemaT));
const oqemaSharePct = (shopOqemaT / shopTotalT) * 100;
const leadVsShopFactor =
  shopOqemaT > 0 ? leadStats.soldToLeadsT / shopOqemaT : 0;
const soldVsOfferPct =
  (leadStats.soldToLeadsT / leadStats.offerPotentialT) * 100;
const soldVsAnnualPct =
  (leadStats.soldToLeadsT / leadStats.annualPotentialT) * 100;
const leadVsShopTotalFactor =
  shopTotalT > 0 ? leadStats.soldToLeadsT / shopTotalT : 0;

const formatT = (v: number, digits = 1) => `${v.toFixed(digits)} t`;
const pct = (v: number, digits = 1) => `${v.toFixed(digits)}%`;

// Chart datasets

const tonnageComparison = [
  {
    label: "OQEMA‑Anteil im Shop",
    tonnen: Number(shopOqemaT.toFixed(1)),
  },
  {
    label: "JOQORA‑Shop gesamt",
    tonnen: Number(shopTotalT.toFixed(1)),
  },
  {
    label: "Leads → real verkauft",
    tonnen: Number(leadStats.soldToLeadsT.toFixed(1)),
  },
];

// SISTRIX Darwin Sichtbarkeitsindex (JOQORA vs. OQEMA)
const visibilitySeries = [
  { date: "2023-07-03", joqora: 0.0, oqema: 0.012 },
  { date: "2023-08-07", joqora: 0.0, oqema: 0.012 },
  { date: "2023-09-04", joqora: 0.0, oqema: 0.011 },
  { date: "2023-10-02", joqora: 0.0, oqema: 0.011 },
  { date: "2023-11-06", joqora: 0.005, oqema: 0.011 },
  { date: "2023-12-04", joqora: 0.01, oqema: 0.01 },
  { date: "2024-01-15", joqora: 0.02, oqema: 0.01 },
  { date: "2024-03-18", joqora: 0.04, oqema: 0.01 },
  { date: "2024-05-20", joqora: 0.06, oqema: 0.011 },
  { date: "2024-07-22", joqora: 0.11, oqema: 0.01 },
  { date: "2024-09-30", joqora: 0.125, oqema: 0.01 },
  { date: "2024-12-02", joqora: 0.093, oqema: 0.01 },
  { date: "2025-01-06", joqora: 0.074, oqema: 0.015 },
  { date: "2025-02-10", joqora: 0.097, oqema: 0.01 },
  { date: "2025-03-10", joqora: 0.112, oqema: 0.01 },
  { date: "2025-04-14", joqora: 0.123, oqema: 0.011 },
  { date: "2025-05-26", joqora: 0.137, oqema: 0.011 },
  { date: "2025-06-02", joqora: 0.155, oqema: 0.011 },
  { date: "2025-07-28", joqora: 0.216, oqema: 0.011 },
  { date: "2025-09-15", joqora: 0.172, oqema: 0.009 },
  { date: "2025-10-13", joqora: 0.099, oqema: 0.007 },
  { date: "2025-11-10", joqora: 0.147, oqema: 0.009 },
];

const visAvgJoqora =
  visibilitySeries.reduce((s, p) => s + p.joqora, 0) / visibilitySeries.length;
const visAvgOqema =
  visibilitySeries.reduce((s, p) => s + p.oqema, 0) / visibilitySeries.length;
const visFactor = visAvgOqema > 0 ? visAvgJoqora / visAvgOqema : 0;

// === UI pieces ===

const KPI: React.FC<{ title: string; value: string; sub?: string }> = ({
  title,
  value,
  sub,
}) => (
  <Card className="flex h-full flex-col rounded-2xl border-slate-200 bg-white/90 shadow-sm transition-all hover:shadow-md">
    <CardContent className="flex flex-1 flex-col justify-between pt-8 pb-6 px-6">
      <div className="mb-4 text-xs uppercase tracking-wide text-slate-500 text-center">
        {title}
      </div>
      <div className="flex items-center justify-center">
        <div className="text-4xl font-bold text-slate-900 text-center">{value}</div>
      </div>
      {sub && <div className="mt-3 text-sm leading-relaxed text-slate-500 text-center">{sub}</div>}
    </CardContent>
  </Card>
);

// === Page ===

export default function LeadMagnetLanding() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header with Logo */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Image
              src="/joqora-logo.svg"
              alt="JOQORA Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <button
              onClick={() => {
                logout();
                window.location.reload();
              }}
              className="text-xs text-slate-600 hover:text-slate-900 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8">
        <div className="rounded-3xl border border-slate-200 bg-white px-10 pt-12 pb-10 shadow-lg backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
              JOQORA.DE als{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Lead‑Magnet
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-emerald-100/60 -z-0"></span>
              </span>{" "}
              für OQEMA
            </h1>
          </div>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-700">
            Die Plattform generiert qualifizierte Produktanfragen und leitet alle passenden Anfragen direkt an OQEMA weiter. 
            Viele Produkte sind nicht direkt im Shop kaufbar – die Anfragefunktion ist der eigentliche Hebel.
          </p>
          
          {/* Grafik: Gesamtkatalog und Anfrageformular */}
          <div className="mt-8 px-8 py-8">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/gesamtkatalog.jpg"
                alt="Gesamtkatalog und Anfrageformular - Basis für Leads"
                width={1200}
                height={600}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Block 1: Tonnage-Vergleich */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Tonnage-Vergleich: Leads vs. Shop-Verkäufe
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Über JOQORA-Leads wurden <span className="font-semibold text-slate-900">{formatT(leadStats.soldToLeadsT, 1)}</span> realisiert – 
            das ist <span className="font-semibold text-slate-900">≈ ×{leadVsShopTotalFactor.toFixed(1)}</span> mehr als der gesamte direkte Shop-Verkauf ({formatT(shopTotalT, 1)}). 
            Der OQEMA-Anteil im Shop beträgt lediglich {formatT(shopOqemaT, 1)} – die über Leads generierte Menge übersteigt diesen bei weitem.
          </p>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tonnageComparison}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis tickFormatter={(v) => `${v} t`} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  formatter={(v: number, n: string) => [`${v} t`, n]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="tonnen"
                  name="Tonnen"
                  fill={COLORS.leads}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <KPI
              title="OQEMA‑Anteil im Shop"
              value={formatT(shopOqemaT, 1)}
              sub={`≈ ${pct(oqemaSharePct)} des Shopvolumens`}
            />
            <KPI
              title="JOQORA‑Shop gesamt"
              value={formatT(shopTotalT, 1)}
              sub="Direkte Shop-Verkäufe (Jan–Okt)"
            />
            <KPI
              title="Leads → real verkauft"
              value={formatT(leadStats.soldToLeadsT, 1)}
              sub="Über JOQORA-Leads realisiert"
            />
          </div>
        </div>
      </section>

      {/* Block: Potenzial - Angebotsvolumen und Jahrespotenzial */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Noch mehr Potenzial: Angebotsvolumen und Jahrespotenzial
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Über JOQORA-Leads wurden bereits <span className="font-semibold text-slate-900">{formatT(leadStats.soldToLeadsT, 1)}</span> realisiert. 
            Das Angebotsvolumen beträgt jedoch <span className="font-semibold text-slate-900">{formatT(leadStats.offerPotentialT, 1)}</span> – 
            es wurden also <span className="font-semibold text-slate-900">{formatT(leadStats.offerPotentialT - leadStats.soldToLeadsT, 1)}</span> angefragt, aber noch nicht realisiert. 
            <span className="font-semibold text-slate-900">Bei den Angeboten liegt noch erhebliches Potenzial</span> – durch Optimierung der Angebotsprozesse können deutlich mehr Tonnen umgesetzt werden.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Angebotsvolumen vs. Realisiert
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Angebotsvolumen (Abrufe)</span>
                  <span className="text-lg font-semibold text-slate-900">{formatT(leadStats.offerPotentialT, 1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Davon realisiert</span>
                  <span className="text-lg font-semibold text-emerald-700">{formatT(leadStats.soldToLeadsT, 1)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Noch nicht realisiert</span>
                  <span className="text-lg font-bold text-amber-700">{formatT(leadStats.offerPotentialT - leadStats.soldToLeadsT, 1)}</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Realisierungsquote</span>
                    <span>{pct(soldVsOfferPct)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                      style={{ width: `${soldVsOfferPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Jahrespotenzial vs. Realisiert
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Bekanntes Jahrespotenzial</span>
                  <span className="text-lg font-semibold text-slate-900">{formatT(leadStats.annualPotentialT, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Davon realisiert</span>
                  <span className="text-lg font-semibold text-emerald-700">{formatT(leadStats.soldToLeadsT, 1)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Noch verfügbares Potenzial</span>
                  <span className="text-lg font-bold text-amber-700">{formatT(leadStats.annualPotentialT - leadStats.soldToLeadsT, 0)}</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Realisierungsquote</span>
                    <span>{pct(soldVsAnnualPct)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                      style={{ width: `${soldVsAnnualPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Fazit:</span> Es wurden {formatT(leadStats.soldToLeadsT, 1)} realisiert, 
              aber angefragt waren {formatT(leadStats.offerPotentialT, 1)}. 
              Bei den Angeboten liegt noch erhebliches Potenzial – durch Optimierung der Angebotsprozesse können deutlich mehr Tonnen umgesetzt werden.
            </p>
          </div>
        </div>
      </section>

      {/* Block 2: Sichtbarkeit - klar getrennt */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-3xl border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Sichtbarkeit: Grundlage für den Lead-Magnet
          </h2>
          <p className="mt-3 text-base text-slate-600">
            JOQORA erreicht durch kontinuierliche Suchmaschinenoptimierung eine deutlich höhere Sichtbarkeit als oqema.com. 
            Im Durchschnitt liegt der Sichtbarkeitsindex bei <span className="font-semibold text-slate-900">≈ ×{visFactor.toFixed(1)}</span> im Vergleich zu oqema.com (SISTRIX-Daten).
          </p>
          <div className="mt-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={visibilitySeries}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <defs>
                  <pattern
                    id="hatchJ"
                    width="6"
                    height="6"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="#1E858F"
                      strokeWidth="1"
                    />
                  </pattern>
                  <pattern
                    id="hatchO"
                    width="6"
                    height="6"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="#67c39c"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 0.22]} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="oqema"
                  name="oqema.com"
                  stroke={COLORS.oqemaVis}
                  fill="url(#hatchO)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="joqora"
                  name="joqora.de"
                  stroke={COLORS.joqoraVis}
                  fill="url(#hatchJ)"
                  fillOpacity={0.7}
                />
                <Line
                  type="monotone"
                  dataKey="oqema"
                  stroke={COLORS.oqemaVis}
                  strokeWidth={2}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey="joqora"
                  stroke={COLORS.joqoraVis}
                  strokeWidth={3}
                  dot={false}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Zeitraum-Hinweis */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Zeitraum:</span> Zahlen basieren auf Daten aus 2025 (Stand: November 2025). 
            Shop-Verkäufe: Januar bis Oktober 2025.
          </p>
        </div>
      </section>

      {/* Finale Zusammenfassung */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-10 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Zusammenfassung
          </h2>
          <div className="space-y-4 text-base text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">JOQORA.DE bewegt real viele Tonnen:</span> Über Leads wurden {formatT(leadStats.soldToLeadsT, 1)} realisiert – 
              das ist <span className="font-semibold text-slate-900">≈ ×{leadVsShopTotalFactor.toFixed(1)} mehr</span> als der gesamte direkte Shop-Verkauf ({formatT(shopTotalT, 1)}).
            </p>
            <p>
              <span className="font-semibold text-slate-900">Der Grund:</span> Eine breite Sichtbarkeit, die über kontinuierliche Suchmaschinenoptimierung erreicht wurde. 
              JOQORA erreicht einen Sichtbarkeitsindex von ≈ ×{visFactor.toFixed(1)} im Vergleich zu oqema.com und dient damit als effektiver Lead-Magnet für OQEMA.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Die Menge an verkauften Produkten übersteigt bei weitem</span> das, was im Shop an OQEMA-Produkten verkauft wird ({formatT(shopOqemaT, 1)}). 
              Diese Diskrepanz wird in der Betrachtung oft übersehen, da das Bewusstsein für den Lead-Mechanismus noch nicht vollständig etabliert ist.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        © JOQORA.DE
      </footer>
    </div>
  );
}
