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
// VITE_ZAUQODE_ADMIN_SECRET can be set in Vercel env vars, with atelier fallback key
const ADMIN_SECRET = import.meta.env.VITE_ZAUQODE_ADMIN_SECRET || "thrive@123";

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
    <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-4 sm:p-6 selection:bg-[#005a55] selection:text-[#F7F5EF]">
      <div className="w-full max-w-md bg-white border border-[#d4a55a]/40 rounded-3xl p-6 sm:p-11 shadow-[0_12px_45px_rgba(0,90,85,0.06)] relative overflow-hidden">
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
              className="w-full bg-[#fdfcf7] border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-[#005a55] placeholder-[#005a55]/25 text-base sm:text-sm outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all shadow-inner touch-manipulation"
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
      <header className="sticky top-0 z-30 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#d4a55a]/30 px-3.5 sm:px-8 py-3 sm:py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span
              className="text-sm sm:text-lg tracking-[0.25em] uppercase text-[#005a55] font-normal truncate"
              style={{ fontFamily: "'Croissant One', cursive, serif" }}
            >
              ZAUQODE
            </span>
            <span className="text-[#d4a55a] text-xs">/</span>
            <span
              className="text-sm sm:text-lg text-[#005a55] truncate"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              Studio Desk
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {saveMsg && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  saveMsg.startsWith("✓")
                    ? "bg-[#eef8f3] text-[#00756e] border-[#cdeee3]"
                    : "bg-rose-50 text-rose-600 border-rose-200"
                }`}
              >
                {saveMsg}
              </span>
            )}
            {saving && (
              <span className="text-[11px] text-[#8c6218] animate-pulse font-medium hidden xs:inline">
                Syncing…
              </span>
            )}
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthed(false);
              }}
              className="text-xs font-semibold text-[#005a55]/70 hover:text-[#005a55] border border-[#005a55]/20 hover:border-[#005a55]/50 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 transition-colors cursor-pointer touch-manipulation"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header & Navigation Tabs — Horizontally Scrollable on Mobile with Momentum */}
      <div className="bg-white border-b border-[#d4a55a]/25 px-3 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <nav
            className="flex gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar py-2 w-full sm:w-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {[
              { id: "portfolio" as const, label: "Portfolio", fullLabel: "Portfolio Works", count: data.works.length, icon: "✦" },
              { id: "orders" as const, label: "Orders", fullLabel: "Client Orders", count: data.orders.length, icon: "◈" },
              { id: "finance" as const, label: "Finance", fullLabel: "Profit & Expenses", icon: "₹" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 rounded-xl transition-all cursor-pointer touch-manipulation ${
                  tab === t.id
                    ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                    : "text-[#005a55]/60 hover:text-[#005a55] hover:bg-[#F7F5EF]"
                }`}
              >
                <span className={tab === t.id ? "text-[#d4a55a]" : "text-[#8c6218]"}>{t.icon}</span>
                <span className="hidden sm:inline">{t.fullLabel}</span>
                <span className="sm:hidden">{t.label}</span>
                {t.count !== undefined && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                      tab === t.id
                        ? "bg-[#F7F5EF] text-[#005a55]"
                        : "bg-[#005a55]/10 text-[#005a55]"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div
            className="hidden md:block text-xs text-[#8c6218] tracking-widest uppercase font-semibold"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Digital Studio Management
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <main className="p-3.5 sm:p-6 md:p-8 max-w-6xl mx-auto pb-20">
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
                featuredHomeIds={data.featuredHomeIds}
                onUpdate={(works, featuredHomeIds) =>
                  updateData({
                    works,
                    ...(featuredHomeIds ? { featuredHomeIds } : {}),
                  })
                }
                onUpdateFeatured={(featuredHomeIds) => updateData({ featuredHomeIds })}
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
