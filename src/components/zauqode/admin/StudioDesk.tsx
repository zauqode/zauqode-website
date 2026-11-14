/**
 * Zauqode Studio Desk — Private Admin Dashboard
 * URL: /zauqode-studio-desk  (not linked anywhere on the public site)
 *
 * Designed with the signature Zauqode luxury atelier aesthetic:
 *  - Warm ivory linen ground (#F7F5EF)
 *  - Deep regal teal typography (#005a55, #0E4847)
 *  - Champagne gold borders and accents (#d4a55a, #8c6218)
 *  - Brand typography: Croissant One (wordmark), Antic Didone (headings), Sacramento (script), Manrope (UI)
 */

import React, { useState, useEffect, useCallback } from "react";
import { PortfolioTab } from "./tabs/PortfolioTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { FinanceTab } from "./tabs/FinanceTab";
import {
  getAdminDataFn,
  saveAdminDataFn,
  type AdminData,
  type AdminWork,
  type Order,
  type MonthlyExpense,
  uid,
  currentMonth,
} from "@/lib/adminServerFns";

// Re-export for child tabs
export type { AdminData, AdminWork, Order, MonthlyExpense };
export { uid, currentMonth };

const SESSION_KEY = "zsd_auth";
// VITE_ZAUQODE_ADMIN_SECRET must be set in Vercel env vars (Production + Preview)
const ADMIN_SECRET = import.meta.env.VITE_ZAUQODE_ADMIN_SECRET || "";

// ─── Direct Server Functions ──────────────────────────────────────────────────

async function loadAdminData(): Promise<AdminData> {
  try {
    return await getAdminDataFn();
  } catch (err) {
    console.error("loadAdminData error:", err);
    return { works: [], orders: [], expenses: [] };
  }
}

async function saveAdminData(data: AdminData): Promise<boolean> {
  try {
    const res = await saveAdminDataFn({ data });
    return !!res?.success;
  } catch (err) {
    console.error("saveAdminData error:", err);
    return false;
  }
}

export { loadAdminData, saveAdminData };

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!ADMIN_SECRET) {
      setError("Admin secret not configured. Add VITE_ZAUQODE_ADMIN_SECRET to .env.local or Vercel env vars.");
      setLoading(false);
      return;
    }
    if (input.trim() === ADMIN_SECRET) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onAuth();
    } else {
      setError("Incorrect security key. Please check and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6 selection:bg-[#005a55] selection:text-[#F7F5EF]">
      <div className="w-full max-w-md bg-white border border-[#d4a55a]/40 rounded-3xl p-8 sm:p-11 shadow-[0_12px_45px_rgba(0,90,85,0.06)] relative overflow-hidden">
        {/* Subtle decorative top accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d4a55a]/30 via-[#005a55] to-[#d4a55a]/30" />

        <div className="text-center mb-8">
          <div
            className="text-xs uppercase tracking-[0.35em] text-[#005a55] font-semibold mb-2"
            style={{ fontFamily: "'Croissant One', cursive, serif" }}
          >
            ZAUQODE
          </div>

          <div
            className="text-2xl text-[#8c6218] mb-4"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            Where taste meets digital
          </div>

          <div
            className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.25em] text-[#8c6218] font-bold mb-1"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Private Atelier Access
          </div>

          <h1
            className="text-2xl sm:text-3xl text-[#005a55] font-normal"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            Studio Desk
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="desk-key"
              className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Master Access Key
            </label>
            <input
              id="desk-key"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="••••••••••••••••••••"
              autoFocus
              className="w-full bg-[#fdfcf7] border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-[#005a55] placeholder-[#005a55]/25 text-sm outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all shadow-inner"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            />
          </div>

          {error && (
            <p className="text-rose-600 text-xs text-center font-medium bg-rose-50 border border-rose-200/60 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !input}
            className="w-full bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl py-3.5 text-sm font-semibold tracking-wide shadow-md hover:shadow-lg disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {loading ? "Authenticating…" : "Enter Studio Desk →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#d4a55a]/20 text-center">
          <p className="text-[11px] text-[#0d3b38]/50" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Restricted to Zauqode Atelier Principals Only
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type TabId = "portfolio" | "orders" | "finance";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "portfolio", label: "Portfolio Works", icon: "✦" },
  { id: "orders", label: "Client Orders", icon: "◈" },
  { id: "finance", label: "Profit & Expenses", icon: "₹" },
];

export function StudioDesk() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabId>("portfolio");
  const [data, setData] = useState<AdminData>({ works: [], orders: [], expenses: [] });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  // Load data when authed
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    loadAdminData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [authed]);

  const handleSave = useCallback(async (updated: AdminData) => {
    setSaving(true);
    setSaveMsg("");
    const ok = await saveAdminData(updated);
    setSaving(false);
    setSaveMsg(ok ? "✓ Changes Saved" : "✗ Save failed");
    setTimeout(() => setSaveMsg(""), 3000);
    return ok;
  }, []);

  const dataRef = React.useRef(data);
  dataRef.current = data;

  const updateData = useCallback(
    async (patch: Partial<AdminData>) => {
      const updated = { ...dataRef.current, ...patch };
      setData(updated);
      await handleSave(updated);
    },
    [handleSave]
  );

  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />;
  }

  return (
    <div
      className="min-h-screen bg-[#F7F5EF] text-[#0d3b38] selection:bg-[#005a55] selection:text-[#F7F5EF]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-30 bg-[#F7F5EF]/90 backdrop-blur-md border-b border-[#d4a55a]/30 px-6 sm:px-10 py-4.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className="text-base sm:text-lg tracking-[0.3em] uppercase text-[#005a55] font-normal"
              style={{ fontFamily: "'Croissant One', cursive, serif" }}
            >
              ZAUQODE
            </span>
            <span className="text-[#d4a55a] text-xs">/</span>
            <span
              className="text-base sm:text-lg text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              Studio Desk
            </span>
          </div>

          <div className="flex items-center gap-4">
            {saveMsg && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  saveMsg.startsWith("✓")
                    ? "bg-[#eef8f3] text-[#00756e] border-[#cdeee3]"
                    : "bg-rose-50 text-rose-600 border-rose-200"
                }`}
              >
                {saveMsg}
              </span>
            )}
            {saving && (
              <span className="text-xs text-[#8c6218] animate-pulse font-medium">
                Syncing with Cloud…
              </span>
            )}
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthed(false);
              }}
              className="text-xs font-semibold text-[#005a55]/70 hover:text-[#005a55] border border-[#005a55]/20 hover:border-[#005a55]/50 rounded-full px-3.5 py-1.5 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header & Navigation Tabs */}
      <div className="bg-white border-b border-[#d4a55a]/25 px-6 sm:px-10 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4 pt-4">
          <nav className="flex gap-2 sm:gap-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  tab === t.id
                    ? "border-[#005a55] text-[#005a55] bg-[#F7F5EF]/60 rounded-t-lg"
                    : "border-transparent text-[#005a55]/50 hover:text-[#005a55] hover:bg-[#F7F5EF]/30 rounded-t-lg"
                }`}
              >
                <span className="text-[#8c6218] text-xs">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          <div
            className="hidden sm:block text-xs text-[#8c6218] tracking-widest uppercase font-semibold pb-3"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Digital Studio Management
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <main className="p-6 sm:p-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#005a55]/60 text-sm gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#005a55]/20 border-t-[#005a55] animate-spin" />
            <span style={{ fontFamily: "'Antic Didone', serif" }} className="text-base text-[#005a55]">
              Loading atelier records…
            </span>
          </div>
        ) : (
          <>
            {tab === "portfolio" && (
              <PortfolioTab
                works={data.works}
                onUpdate={(works) => updateData({ works })}
              />
            )}
            {tab === "orders" && (
              <OrdersTab
                orders={data.orders}
                onUpdate={(orders) => updateData({ orders })}
              />
            )}
            {tab === "finance" && (
              <FinanceTab
                orders={data.orders}
                expenses={data.expenses}
                onUpdate={(expenses) => updateData({ expenses })}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
