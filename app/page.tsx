"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Magnet,
  Search,
  Layers,
  TrendingUp,
  ShieldCheck,
  Handshake,
  Globe,
  Target,
  BarChart3,
  Users,
} from "lucide-react";
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
  LabelList,
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

// chart datasets

const compareBars = [
  {
    label: "Leads → real verkauft",
    tonnen: Number(leadStats.soldToLeadsT.toFixed(1)),
  },
  {
    label: "OQEMA‑Anteil im JOQORA‑Shop",
    tonnen: Number(shopOqemaT.toFixed(1)),
  },
];

const monthlyBars = monthly.map((m) => ({
  label: m.label,
  "Shop gesamt": m.shopTotalT,
  "OQEMA-Anteil": m.oqemaT,
}));

const compareBarsShop = [
  {
    label: "Leads → real verkauft",
    tonnen: Number(leadStats.soldToLeadsT.toFixed(1)),
  },
  {
    label: "JOQORA‑Shop gesamt",
    tonnen: Number(shopTotalT.toFixed(1)),
  },
];

// SISTRIX Darwin Sichtbarkeitsindex (JOQORA vs. OQEMA)
const visibilitySeries = [
  // — Frühe Phase: JOQORA startet bei ~0, OQEMA relativ stabil —
  { date: "2023-07-03", joqora: 0.0, oqema: 0.012 },
  { date: "2023-08-07", joqora: 0.0, oqema: 0.012 },
  { date: "2023-09-04", joqora: 0.0, oqema: 0.011 },
  { date: "2023-10-02", joqora: 0.0, oqema: 0.011 },
  { date: "2023-11-06", joqora: 0.005, oqema: 0.011 },
  { date: "2023-12-04", joqora: 0.01, oqema: 0.01 },
  // — 2024 —
  { date: "2024-01-15", joqora: 0.02, oqema: 0.01 },
  { date: "2024-03-18", joqora: 0.04, oqema: 0.01 },
  { date: "2024-05-20", joqora: 0.06, oqema: 0.011 },
  { date: "2024-07-22", joqora: 0.11, oqema: 0.01 },
  { date: "2024-09-30", joqora: 0.125, oqema: 0.01 },
  { date: "2024-12-02", joqora: 0.093, oqema: 0.01 },
  // — 2025 (Originalpunkte verdichtet aus SISTRIX-Liste) —
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

// Aggregation: Durchschnittliche Sichtbarkeit (Gesamt-Sichtbarkeit)
const visAvgJoqora =
  visibilitySeries.reduce((s, p) => s + p.joqora, 0) / visibilitySeries.length;
const visAvgOqema =
  visibilitySeries.reduce((s, p) => s + p.oqema, 0) / visibilitySeries.length;
const visFactor = visAvgOqema > 0 ? visAvgJoqora / visAvgOqema : 0;

const visCompareData = [
  {
    label: "Durchschnitt",
    JOQORA: Number(visAvgJoqora.toFixed(3)),
    OQEMA: Number(visAvgOqema.toFixed(3)),
  },
];

// === UI pieces ===

const KPI: React.FC<{ title: string; value: string; sub?: string }> = ({
  title,
  value,
  sub,
}) => (
  <Card className="flex h-full flex-col rounded-2xl border-slate-200 bg-white/90 shadow-sm transition-all hover:shadow-md">
    <CardContent className="flex flex-1 flex-col justify-between p-6">
      <div className="mb-6 text-xs uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="flex items-center justify-center">
        <div className="text-4xl font-bold text-slate-900">{value}</div>
      </div>
      {sub && <div className="mt-3 text-sm leading-relaxed text-slate-500">{sub}</div>}
    </CardContent>
  </Card>
);

type ProgressProps = {
  value: number;
  captionLeft: string;
  captionRight: string;
};

const Progress: React.FC<ProgressProps> = ({
  value,
  captionLeft,
  captionRight,
}) => (
  <div>
    <div className="flex items-center justify-between text-xs text-slate-600">
      <span>{captionLeft}</span>
      <span>{pct(value)}</span>
    </div>
    <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <div className="mt-1 text-[11px] text-slate-500">{captionRight}</div>
  </div>
);

// === Page ===

export default function LeadMagnetLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header with Logo */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center">
            <Image
              src="/joqora-logo.svg"
              alt="JOQORA Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-10">
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
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-slate-700">
            Die Plattform generiert qualifizierte Produktanfragen und leitet
            alle passenden Anfragen direkt an OQEMA weiter. Viele Produkte sind
            nicht direkt im Shop kaufbar – die Anfragefunktion ist der
            eigentliche Hebel.{" "}
            <span className="text-slate-700">
              Die aktuelle Reichweite beruht auf{" "}
              <span className="font-medium text-slate-900">
                kontinuierlich gewachsenen Signalen
              </span>{" "}
              – ein reiner Wechsel der Domain oder eine Parallelstruktur bildet
              dieses Niveau erfahrungsgemäß nicht unmittelbar ab.
            </span>
          </p>
          
          {/* Grafik: Gesamtkatalog und Anfrageformular */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
              Basis für individuelle Anfragen & Leads
            </div>
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
            <p className="mt-3 text-sm text-slate-600">
              Der umfassende Gesamtkatalog ermöglicht individuelle Produktanfragen über das Anfrageformular – 
              die Grundlage für qualifizierte Leads, die direkt an OQEMA weitergeleitet werden.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KPI
              title="Bereits über Leads verkauft"
              value={formatT(leadStats.soldToLeadsT, 1)}
              sub="Menge, die OQEMA aus JOQORA‑Leads realisiert hat"
            />
            <KPI
              title="Angebotsvolumen (Abrufe)"
              value={formatT(leadStats.offerPotentialT, 1)}
              sub={`Davon realisiert: ${pct(soldVsOfferPct)}`}
            />
            <KPI
              title="Bekanntes Jahrespotenzial"
              value={formatT(leadStats.annualPotentialT, 0)}
              sub={`Realisiert: ${pct(soldVsAnnualPct)}`}
            />
            <KPI
              title="OQEMA‑Anteil im JOQORA‑Shop (Jan–Okt)"
              value={formatT(shopOqemaT, 1)}
              sub={`≈ ${pct(oqemaSharePct)} Anteil am Shopvolumen`}
            />
          </div>

          {/* Bullets mit Icons */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 1 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-slate-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-slate-800" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Leads bewegen mehr
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  {formatT(leadStats.soldToLeadsT, 1)} aus Leads vs.{" "}
                  {formatT(shopTotalT, 1)} Shop gesamt (≈ ×
                  {leadVsShopTotalFactor.toFixed(1)}).
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="rounded-lg bg-emerald-100 p-2 group-hover:bg-emerald-200 transition-colors">
                <Magnet className="h-6 w-6 text-emerald-800" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  OQEMA profitiert überproportional
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Leads → real verkauft vs. OQEMA‑Anteil im Shop: ≈ ×
                  {leadVsShopFactor.toFixed(1)} ( {formatT(leadStats.soldToLeadsT, 1)} vs.{" "}
                  {formatT(shopOqemaT, 1)} ).
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                <Search className="h-6 w-6 text-blue-800" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Angebote werden verwertet
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  {formatT(leadStats.soldToLeadsT, 1)} von{" "}
                  {formatT(leadStats.offerPotentialT, 1)} Angebotsvolumen →{" "}
                  {pct(soldVsOfferPct)} Realisierung.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="rounded-lg bg-teal-100 p-2 group-hover:bg-teal-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-teal-800" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Sichtbarkeit schlägt oqema.com
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Durchschnittlicher Sichtbarkeitsindex: JOQORA ≈ ×
                  {visFactor.toFixed(1)} vs. oqema.com (SISTRIX‑Daten).
                </p>
              </div>
            </div>

            {/* 5 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="rounded-lg bg-purple-100 p-2 group-hover:bg-purple-200 transition-colors">
                <Layers className="h-6 w-6 text-purple-800" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Sortimentbreite → Rankinghebel
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Partner‑Sortimente + Long‑Tail‑Inhalte stärken Autorität –
                  Rankings der OQEMA‑Produkte steigen mit.
                </p>
              </div>
            </div>

            {/* 6 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="rounded-lg bg-amber-100 p-2 group-hover:bg-amber-200 transition-colors">
                <ShieldCheck className="h-6 w-6 text-amber-800" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Steuerung & Marktzugang
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Eigene Produkte priorisieren, Partner ergänzen ohne direkte
                  Konkurrenz – Reichweite und Kontrolle bleiben bei JOQORA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big comparison */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg lg:col-span-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Leads vs. OQEMA‑Anteil im JOQORA‑Shop
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Die über Leads realisierte Menge ist{" "}
              <span className="font-semibold text-slate-900">
                ≈ ×{leadVsShopFactor.toFixed(1)}
              </span>{" "}
              größer als der direkte OQEMA‑Anteil im JOQORA‑Shop.
            </p>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compareBars}
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
                  <Bar
                    dataKey="tonnen"
                    name="Tonnen"
                    fill={COLORS.leads}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">
              Hebel der Plattform
            </h3>
            <div className="mt-4 space-y-4">
              <Progress
                value={soldVsOfferPct}
                captionLeft="Realisierung aus Angebotsvolumen"
                captionRight="Leads → real verkauft vs. Abrufe"
              />
              <Progress
                value={soldVsAnnualPct}
                captionLeft="Realisierung aus Jahrespotenzial"
                captionRight="Leads → real verkauft vs. bekannte Jahresbedarfe"
              />
              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Kernaussage:</p>
                <p className="mt-1">
                  JOQORA.DE liefert für OQEMA ein Vielfaches an Wert im{" "}
                  <span className="font-medium text-slate-900">
                    Lead‑Geschäft
                  </span>{" "}
                  gegenüber dem direkten Shop‑Umsatz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zusatz‑Vergleich: Leads vs. JOQORA‑Shop gesamt */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Leads vs. JOQORA‑Shop gesamt
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Über JOQORA‑Leads wurden insgesamt{" "}
            <span className="font-semibold text-slate-900">
              ≈ ×{leadVsShopTotalFactor.toFixed(1)}
            </span>{" "}
            so viele Tonnen bewegt wie durch den gesamten direkten Shop‑Verkauf.
          </p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={compareBarsShop}
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
                <Bar
                  dataKey="tonnen"
                  name="Tonnen"
                  fill={COLORS.leads}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Gesamt‑Sichtbarkeit (Vergleichsbalken) */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Gesamt‑Sichtbarkeit (Durchschnitt) – JOQORA vs. OQEMA
          </h2>
          <p className="mt-2 text-base text-slate-600">
            JOQORA hat im Beobachtungszeitraum eine im Schnitt deutlich höhere
            Sichtbarkeit. Verhältnis:{" "}
            <span className="font-semibold text-slate-900">
              ≈ ×{visFactor.toFixed(1)}
            </span>
            .
          </p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visCompareData}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  domain={[0, Math.max(visAvgJoqora, visAvgOqema) * 1.2]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="JOQORA" fill={COLORS.joqoraVis} radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="JOQORA"
                    position="top"
                    formatter={(v: number) => v.toFixed(3)}
                  />
                </Bar>
                <Bar dataKey="OQEMA" fill={COLORS.shop} radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="OQEMA"
                    position="top"
                    formatter={(v: number) => v.toFixed(3)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Strategischer Hinweis (Moat) */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">
            <span className="font-medium text-slate-900">Executive Summary:</span>{" "}
            JOQORA weist in den relevanten OQEMA‑Produktsegmenten eine sichtbar
            gewachsene Präsenz auf. Ein vergleichbares Niveau lässt sich auf
            anderen Domains in der Regel nur mit{" "}
            <span className="font-medium text-slate-900">
              Zeit und Kontinuität
            </span>{" "}
            abbilden.
          </p>
        </div>
      </section>

      {/* Sichtbarkeit (SISTRIX Darwin) */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Sichtbarkeitsindex (SISTRIX Darwin): JOQORA vs. OQEMA
          </h2>
          <p className="mt-2 text-base text-slate-600">
            JOQORA wirft ein deutlich größeres Netz aus: höhere Sichtbarkeit in
            genau den Produktsegmenten, die OQEMA anbietet – auch dort, wo
            Produkte nur per Anfrage verfügbar sind.
          </p>
          <div className="mt-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={visibilitySeries}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <defs>
                  {/* Diagonale Schraffuren */}
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
                {/* Flächen unter den Kurven */}
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
                {/* Linien oben drüber für Klarheit */}
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

      {/* Monthly chart */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-900">
            Monatliche Tonnage im JOQORA‑Shop (gesamt vs. OQEMA‑Anteil)
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Jeder Balken zeigt die gesamte Tonnage des JOQORA‑Shops pro Monat;
            der zweite Balken zeigt den darin enthaltenen OQEMA‑Anteil.
          </p>
          <div className="mt-6 h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyBars}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v} t`} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  formatter={(v: number) => [`${v} t`, "Tonnen"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Shop gesamt"
                  name="JOQORA‑Shop gesamt"
                  fill={COLORS.shop}
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="OQEMA-Anteil"
                  name="OQEMA‑Anteil im JOQORA‑Shop"
                  fill={COLORS.leads}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KPI
              title="Shop gesamt (Jan–Okt)"
              value={formatT(shopTotalT, 1)}
              sub="Alle Bestellungen über den Shop"
            />
            <KPI
              title="OQEMA‑Anteil im JOQORA‑Shop (Jan–Okt)"
              value={formatT(shopOqemaT, 1)}
              sub={`Anteil am Shop: ${pct(oqemaSharePct)}`}
            />
            <KPI
              title="Leads → real verkauft"
              value={formatT(leadStats.soldToLeadsT, 1)}
              sub={`≈ ×${leadVsShopFactor.toFixed(1)} vs. OQEMA‑Anteil im JOQORA‑Shop`}
            />
          </div>
        </div>
      </section>

      {/* Narrative / CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg lg:col-span-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Warum JOQORA.DE strategisch wichtig ist
            </h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                <span>
                  Alle Anfragen zu OQEMA‑Produkten werden automatisch als
                  qualifizierte Leads an OQEMA weitergeleitet.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                <span>
                  JOQORA schafft zusätzliche Reichweite in Suchmaschinen &
                  Nischen – viele Neukunden kennen OQEMA vorher nicht.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                <span>
                  Viele Produkte sind nicht direkt kaufbar – die
                  Anfragefunktion maximiert Reichweite & Conversion.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                <span>
                  Die Plattform arbeitet wie ein dauerhafter, digitaler
                  Außendienstkanal und ergänzt OQEMA, statt zu kannibalisieren.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">
              Nächste Schritte
            </h3>
            <ol className="mt-4 space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                  1
                </span>
                <span>
                  Headline/Copy mit Claude finalisieren (Hero + KPI‑Erklärungen).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                  2
                </span>
                <span>
                  Optional: echte Monatsnamen/Zeiträume verankern.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                  3
                </span>
                <span>
                  Optional: API‑Feed für Live‑Zahlen (Shop/CRM) anbinden.
                </span>
              </li>
            </ol>
            <button className="mt-6 w-full rounded-xl border border-slate-300 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:from-slate-800 hover:to-slate-700 hover:shadow-md">
              Kontakt aufnehmen
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        © JOQORA.DE
      </footer>
    </div>
  );
}

