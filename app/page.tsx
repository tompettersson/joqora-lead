"use client";

import React from "react";
import Image from "next/image";
import Snowfall from "react-snowfall";
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
  soldToLeadsT: 618.2, // t real aus Leads (Einzelanfragen) - OQEMA
  offerPotentialT: 1217, // t Angebotsvolumen (angebotene Menge Lieferung)
  annualPotentialT: 19748, // t bekannte Jahresbedarfe (wenn bekannt)
  shopOqemaT: 26, // t OQEMA-Anteil im Shop
  shopTotalT: 316, // t Gesamtshop (Jan-Dez 2025)
  offerCount: 71, // Anzahl Einzelanfragen mit Angebot
};

// === Colors ===

const COLORS = {
  leads: "#67c39c", // Standard Grün (bleibt für Leads/Monatsbalken)
  shop: "#839c9a", // Shop-Balken (graugrün)
  joqoraVis: "#1E858F", // bläuliches Grün für JOQORA Sichtbarkeit
  oqemaVis: "#67c39c", // normales Grün für OQEMA Sichtbarkeit
};

// === Helpers ===

const shopOqemaT = leadStats.shopOqemaT; // OQEMA-Anteil im Shop
const shopTotalT = leadStats.shopTotalT; // Gesamtshop (extrapoliert)
const soldVsOfferPct =
  (leadStats.soldToLeadsT / leadStats.offerPotentialT) * 100;
const soldVsAnnualPct =
  (leadStats.soldToLeadsT / leadStats.annualPotentialT) * 100;
const leadVsOqemaShopFactor =
  shopOqemaT > 0 ? leadStats.soldToLeadsT / shopOqemaT : 0; // OQEMA Leads vs. OQEMA Shop (≈24x)
const leadVsTotalShopFactor =
  shopTotalT > 0 ? leadStats.soldToLeadsT / shopTotalT : 0; // OQEMA Leads vs. Gesamtshop (≈2x)

const formatT = (v: number, digits = 1) => `${v.toFixed(digits)} t`;
const pct = (v: number, digits = 1) => `${v.toFixed(digits)}%`;

// Chart datasets

const tonnageComparison = [
  {
    label: "Shop",
    oqemaAnteil: shopOqemaT,
    restShop: shopTotalT - shopOqemaT,
    gesamt: shopTotalT,
  },
  {
    label: "OQEMA Leads",
    oqemaAnteil: leadStats.soldToLeadsT,
    restShop: 0,
    gesamt: leadStats.soldToLeadsT,
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
  { date: "2025-12-16", joqora: 0.18, oqema: 0.009 },
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
  <Card className="flex h-full flex-col border border-white bg-white/90 shadow-sm transition-all hover:shadow-md">
    <CardContent className="flex flex-1 flex-col justify-between pt-4 pb-6 px-6">
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
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/christmas-bg.jpg')" }}>
      {/* Schneefall-Effekt */}
      <Snowfall
        snowflakeCount={300}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 50,
          pointerEvents: "none",
        }}
      />

      {/* Minimaler Header - nur Abmelden */}
      <header className="bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                logout();
                window.location.reload();
              }}
              className="text-xs text-white/80 hover:text-white transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Hero - Weihnachtliche Zusammenfassung */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-10">
        <div className="border border-white bg-white/85 px-10 pt-12 pb-10 shadow-xl backdrop-blur-md">
          {/* Logo zentriert */}
          <div className="flex justify-center mb-12">
            <Image
              src="/joqora-logo.svg"
              alt="JOQORA Logo"
              width={200}
              height={50}
              className="h-14 w-auto"
              priority
            />
          </div>

          {/* Weihnachtsgruß */}
          <div className="text-center mb-6">
            <p className="text-4xl mb-2">🎄</p>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Jahresrückblick 2025
            </h1>
          </div>

          {/* Kernbotschaft */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <p className="text-lg md:text-xl leading-relaxed text-slate-700">
              Über JOQORA-Leads wurden <span className="font-semibold text-slate-900">618 t</span> für OQEMA realisiert.
              Zum Vergleich: Das gesamte Shop-Geschäft beträgt <span className="font-semibold text-slate-900">316 t</span> (26 t OQEMA-Anteil).
              Die Anfragenden repräsentieren zudem einen kumulierten Jahresbedarf von knapp 20.000 t.
            </p>
          </div>

          {/* Weihnachtlicher Abschluss */}
          <div className="flex justify-center items-center gap-1">
            <span className="text-base text-amber-400">⭐</span>
            <span className="text-2xl text-amber-400">⭐</span>
            <span className="text-base text-amber-400">⭐</span>
          </div>
        </div>
      </section>

      {/* Block 1: Tonnage-Vergleich */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="border border-white bg-white/85 p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-slate-900">
            Tonnage-Vergleich: Leads vs. Shop-Verkäufe
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Über JOQORA-Leads wurden <span className="font-semibold text-slate-900">{formatT(leadStats.soldToLeadsT, 1)}</span> realisiert –
            knapp <span className="font-semibold text-slate-900">doppelt so viel</span> wie das gesamte Shop-Geschäft ({formatT(shopTotalT, 0)}).
          </p>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tonnageComparison}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <defs>
                  {/* Feine diagonale Streifen für OQEMA-Anteil (grün) */}
                  <pattern id="stripesGreen" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                    <rect width="4" height="6" fill={COLORS.leads} />
                    <rect x="4" width="2" height="6" fill="#8ed4b3" />
                  </pattern>
                  {/* Feine diagonale Streifen für Sonstiges (grau) */}
                  <pattern id="stripesGray" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                    <rect width="4" height="6" fill={COLORS.shop} />
                    <rect x="4" width="2" height="6" fill="#9fb3b1" />
                  </pattern>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis tickFormatter={(v) => `${v} t`} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  formatter={(v: number, name: string) => {
                    if (name === "OQEMA-Anteil") return [`${v} t`, "OQEMA"];
                    if (name === "Sonstiges") return [`${v} t`, "Andere Lieferanten"];
                    return [`${v} t`, name];
                  }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#1e293b",
                  }}
                  labelStyle={{ color: "#1e293b" }}
                  itemStyle={{ color: "#1e293b" }}
                />
                <Legend wrapperStyle={{ color: "#334155" }} />
                <Bar
                  dataKey="oqemaAnteil"
                  name="OQEMA-Anteil"
                  stackId="a"
                  fill="url(#stripesGreen)"
                />
                <Bar
                  dataKey="restShop"
                  name="Sonstiges"
                  stackId="a"
                  fill="url(#stripesGray)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <KPI
              title="Standard‑Shop"
              value={formatT(shopTotalT, 0)}
              sub="Direkte Shop-Verkäufe 2025"
            />
            <KPI
              title="OQEMA‑Anteil"
              value={formatT(shopOqemaT, 0)}
              sub="Im Shop verkauft"
            />
            <KPI
              title="OQEMA Leads"
              value={formatT(leadStats.soldToLeadsT, 0)}
              sub="Über JOQORA-Leads realisiert"
            />
          </div>
        </div>
      </section>

      {/* Block: Potenzial - Angebotsvolumen und Jahrespotenzial */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="border border-white bg-white/85 p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-slate-900">
            Angebotsvolumen und Jahresbedarf
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Über JOQORA-Leads wurden <span className="font-semibold text-slate-900">{formatT(leadStats.soldToLeadsT, 1)}</span> realisiert.
            Das Angebotsvolumen beträgt <span className="font-semibold text-slate-900">{formatT(leadStats.offerPotentialT, 1)}</span> –
            davon wurden <span className="font-semibold text-slate-900">{formatT(leadStats.offerPotentialT - leadStats.soldToLeadsT, 1)}</span> angefragt, aber noch nicht realisiert.
          </p>
          <div className="mt-8">
            <div className="border border-white bg-slate-50 p-6">
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
          </div>
        </div>
      </section>

      {/* Block: Großkunden-Potenzial */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="border border-white bg-white/85 p-8 shadow-xl backdrop-blur-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Großkunden-Potenzial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-900">{leadStats.offerCount}</div>
                <div className="text-sm text-slate-600 mt-2">Anfragen mit<br />bekanntem Jahresbedarf</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-600">{formatT(leadStats.annualPotentialT, 0)}</div>
                <div className="text-sm text-slate-600 mt-2">kumulierter<br />Jahresbedarf</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-400">{formatT(leadStats.annualPotentialT / leadStats.offerCount, 0)}</div>
                <div className="text-sm text-slate-600 mt-2">Ø Jahresbedarf<br />pro Anfrage</div>
              </div>
            </div>
            <p className="mt-8 text-base text-slate-600 max-w-2xl mx-auto">
              Die Anfragenden repräsentieren einen kumulierten Jahresbedarf von knapp 20.000 t.
            </p>
          </div>
        </div>
      </section>

      {/* Block 2: Sichtbarkeit - klar getrennt */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="border border-white bg-white/85 p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-slate-900">
            Sichtbarkeit: Grundlage für die Lead-Generierung
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Der SISTRIX-Sichtbarkeitsindex von JOQORA liegt im Durchschnitt bei <span className="font-semibold text-slate-900">≈ ×{visFactor.toFixed(1)}</span> im Vergleich zu oqema.com.
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
                <Legend wrapperStyle={{ color: "#334155" }} />
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
                  hide
                />
                <Line
                  type="monotone"
                  dataKey="joqora"
                  stroke={COLORS.joqoraVis}
                  strokeWidth={3}
                  dot={false}
                  legendType="none"
                  hide
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Zeitraum-Hinweis */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="border border-white bg-white/80 p-6 shadow-lg backdrop-blur-md">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Zeitraum:</span> Zahlen basieren auf Daten aus 2025 (Stand: Dezember 2025).
          </p>
        </div>
      </section>

      {/* Finale Zusammenfassung */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="border border-white bg-white/85 p-10 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Zusammenfassung
          </h2>
          <div className="space-y-4 text-base text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Lead-Geschäft:</span> Über JOQORA wurden
              <span className="font-semibold text-slate-900"> {formatT(leadStats.soldToLeadsT, 0)}</span> realisiert – gegenüber <span className="font-semibold text-slate-900">{formatT(shopTotalT, 0)}</span> im direkten Shop-Geschäft.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Sichtbarkeit:</span> Der Sichtbarkeitsindex liegt bei ≈ ×{visFactor.toFixed(1)} im Vergleich zu oqema.com (SISTRIX-Daten).
            </p>
            <p>
              <span className="font-semibold text-slate-900">Offenes Potenzial:</span> Von {leadStats.offerCount} Angeboten mit {formatT(leadStats.offerPotentialT, 0)} angefragter Menge
              wurden {formatT(leadStats.soldToLeadsT, 0)} realisiert.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-white/70">
        © JOQORA.DE
      </footer>
    </div>
  );
}
