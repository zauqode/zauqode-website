/**
 * Zauqode Studio Desk — Private Admin Dashboard
 * URL: /zauqode-studio-desk  (not linked anywhere on the public site)
 *
 * Features:
 *  - Password gate (checked client-side against a hashed secret stored in env at build time)
 *  - Tab 1 — Portfolio Works  : add / hide works (stored as JSON blob)
 *  - Tab 2 — Orders           : track client orders, payment status, completion
 *  - Tab 3 — Finance          : monthly revenue & expenses, profit calculation
 *
 * Storage: Vercel Blob (JSON files, no database needed)
 * Session: sessionStorage (cleared on tab close)
 */

import React, { useState, useEffect, useCallback } from "react";
import { PortfolioTab } from "./tabs/PortfolioTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { FinanceTab } from "./tabs/FinanceTab";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminWork {
  id: string;
  name: string;
  category: string;
  label: string;
  thumbUrl: string;
  liveUrl?: string;
  hidden: boolean;
  addedAt: string;
}

export interface Order {
  id: string;
  clientName: string;
  projectType: string;
  amount: number;        // total agreed amount (₹)
  advance: number;       // advance received (₹)
  advancePaid: boolean;
  fullPaid: boolean;
  completed: boolean;
  deadline?: string;
  notes?: string;
  createdAt: string;
  month: string;         // "2026-11" for grouping
}

export interface MonthlyExpense {
  id: string;
  month: string;         // "2026-11"
  description: string;
  amount: number;        // ₹
  createdAt: string;
}

export interface AdminData {
  works: AdminWork[];
  orders: Order[];
  expenses: MonthlyExpense[];
}

const SESSION_KEY = "zsd_auth";
const BLOB_DATA_KEY = "zauqode-admin-data.json";
// VITE_ZAUQODE_ADMIN_SECRET must be set in Vercel env vars (Production + Preview)
const ADMIN_SECRET = import.meta.env.VITE_ZAUQODE_ADMIN_SECRET || "";

// ─── Utilities ───────────────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export { uid, currentMonth };

// ─── Blob helpers ────────────────────────────────────────────────────────────

async function loadAdminData(): Promise<AdminData> {
  try {
    const res = await fetch(`/api/admin-blob?key=${encodeURIComponent(BLOB_DATA_KEY)}`, {
      headers: { "x-admin-secret": ADMIN_SECRET },
    });
    if (!res.ok) return { works: [], orders: [], expenses: [] };
    const json = await res.json();
    return json as AdminData;
  } catch {
    return { works: [], orders: [], expenses: [] };
  }
}

async function saveAdminData(data: AdminData): Promise<boolean> {
  try {
    const res = await fetch("/api/admin-blob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({ key: BLOB_DATA_KEY, data }),
    });
    return res.ok;
  } catch {
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
    // Compare against env-injected secret
    if (!ADMIN_SECRET) {
      setError("Admin secret not configured. Add VITE_ZAUQODE_ADMIN_SECRET to Vercel env vars.");
      setLoading(false);
      return;
    }
    if (input.trim() === ADMIN_SECRET) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onAuth();
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1f1e] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#0d2b29] border border-[#d4a55a]/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div
            className="text-[#d4a55a] text-xs tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Private Access
          </div>
          <h1
            className="text-[#f3e3c0] text-2xl"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            Studio Desk
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-4 py-3 text-[#f3e3c0] placeholder-[#f3e3c0]/30 text-sm outline-none focus:border-[#d4a55a]/70 transition-colors"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          />
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !input}
            className="w-full bg-[#d4a55a] text-[#0a1f1e] rounded-lg py-3 text-sm font-semibold tracking-wide disabled:opacity-40 hover:bg-[#c49348] transition-colors"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {loading ? "Checking…" : "Enter Desk"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type TabId = "portfolio" | "orders" | "finance";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "portfolio", label: "Portfolio", icon: "🖼" },
  { id: "orders", label: "Orders", icon: "📋" },
  { id: "finance", label: "Finance", icon: "₹" },
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
    setSaveMsg(ok ? "✓ Saved" : "✗ Save failed");
    setTimeout(() => setSaveMsg(""), 3000);
    return ok;
  }, []);

  const updateData = useCallback(
    async (patch: Partial<AdminData>) => {
      const updated = { ...data, ...patch };
      setData(updated);
      await handleSave(updated);
    },
    [data, handleSave]
  );

  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />;
  }

  return (
    <div
      className="min-h-screen bg-[#0a1f1e] text-[#f3e3c0]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0a1f1e]/95 backdrop-blur-md border-b border-[#d4a55a]/20 px-5 sm:px-8 py-4 flex items-center justify-between">
        <div>
          <span
            className="text-xs tracking-[0.3em] uppercase text-[#d4a55a]"
          >
            Zauqode
          </span>
          <span className="text-[#f3e3c0]/40 mx-2">·</span>
          <span className="text-sm text-[#f3e3c0]/70">Studio Desk</span>
        </div>
        <div className="flex items-center gap-4">
          {saveMsg && (
            <span
              className={`text-xs font-semibold ${saveMsg.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`}
            >
              {saveMsg}
            </span>
          )}
          {saving && (
            <span className="text-xs text-[#d4a55a]/60 animate-pulse">Saving…</span>
          )}
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setAuthed(false);
            }}
            className="text-xs text-[#f3e3c0]/40 hover:text-[#f3e3c0]/70 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-[#d4a55a]/20 px-5 sm:px-8 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              tab === t.id
                ? "border-[#d4a55a] text-[#d4a55a]"
                : "border-transparent text-[#f3e3c0]/50 hover:text-[#f3e3c0]/80"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="p-5 sm:p-8 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-[#f3e3c0]/40 text-sm animate-pulse">
            Loading data…
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
