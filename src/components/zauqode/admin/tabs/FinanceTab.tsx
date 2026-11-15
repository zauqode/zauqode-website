/**
 * Finance Tab — Monthly revenue, operational expenses & net profit tracker.
 * Fully optimized for mobile & iOS Safari with zero layout clipping or text overlap.
 */

import React, { useState, useMemo } from "react";
import { type Order, type MonthlyExpense, uid, currentMonth } from "../StudioDesk";
import {
  DatePickerDDMMYYYY,
  InlineDatePickerDDMMYYYY,
  toDDMMYYYY,
} from "../DatePickerDDMMYYYY";

interface Props {
  orders: Order[];
  expenses: MonthlyExpense[];
  onUpdate: (expenses: MonthlyExpense[]) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function monthLabel(m: string) {
  const [y, mo] = m.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(mo, 10) - 1] || mo} ${y}`;
}

export function formatDisplayDate(dateStr?: string, fallbackMonth?: string): string {
  if (!dateStr) {
    if (fallbackMonth) {
      const [y, mo] = fallbackMonth.split("-");
      if (y && mo) {
        return `${mo.padStart(2, "0")}/${y}`;
      }
    }
    return "";
  }
  return toDDMMYYYY(dateStr);
}

// ─── iOS Mobile Sheet Modal ───────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#005a55]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content — Bottom Sheet on Mobile, Centered Card on sm+ */}
      <div
        className={`relative w-full ${maxWidth} bg-[#F7F5EF] border-t sm:border border-[#d4a55a]/45 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,90,85,0.22)] z-10 max-h-[92dvh] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,20px)]`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* iOS Drag Handle */}
        <div className="w-10 h-1 bg-[#d4a55a]/40 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-start justify-between border-b border-[#d4a55a]/25 pb-3 mb-4">
          <div>
            {subtitle && (
              <div className="text-[10px] font-bold text-[#8c6218] tracking-[0.25em] uppercase mb-0.5">
                {subtitle}
              </div>
            )}
            <h3
              className="text-xl sm:text-2xl text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#d4a55a]/40 text-[#005a55] hover:bg-[#005a55] hover:text-[#F7F5EF] flex items-center justify-center text-sm font-semibold transition-all cursor-pointer shadow-2xs touch-manipulation"
            title="Close"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

// ─── Add Expense Modal ────────────────────────────────────────────────────────

function AddExpenseModal({
  open,
  month,
  onClose,
  onAdd,
}: {
  open: boolean;
  month: string;
  onClose: () => void;
  onAdd: (e: MonthlyExpense) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!description.trim()) {
      setError("Expense description is required.");
      return;
    }
    const val = parseFloat(amount) || 0;
    if (val <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    const chosenDate = date || today;
    const targetMonth = chosenDate.slice(0, 7) || month;

    onAdd({
      id: uid(),
      month: targetMonth,
      description: description.trim(),
      amount: val,
      date: chosenDate,
      createdAt: new Date().toISOString(),
    });

    setDescription("");
    setAmount("");
    setDate(today);
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Operational Expense"
      subtitle="Studio Expenses"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
            Expense Description *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Meta Ads, Cloud Hosting, Fonts..."
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Cost (₹) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2300"
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Expense Date (dd/mm/yyyy)
            </label>
            <DatePickerDDMMYYYY value={date} onChange={(d) => setDate(d)} />
          </div>
        </div>

        {error && (
          <p className="text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-200 rounded-lg p-2.5">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4a55a]/20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 text-xs font-semibold text-[#005a55] hover:bg-white rounded-xl border border-[#d4a55a]/40 transition-colors cursor-pointer touch-manipulation text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-5 py-3 sm:py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer touch-manipulation text-center"
          >
            Record Expense +
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit Expense Modal ───────────────────────────────────────────────────────

function EditExpenseModal({
  expense,
  open,
  onClose,
  onSave,
}: {
  expense: MonthlyExpense | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: MonthlyExpense) => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (expense) {
      setDescription(expense.description || "");
      setAmount(expense.amount ? String(expense.amount) : "0");
      setDate(expense.date || (expense.createdAt ? expense.createdAt.split("T")[0] : ""));
      setError("");
    }
  }, [expense]);

  if (!expense) return null;

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!description.trim()) {
      setError("Expense description is required.");
      return;
    }
    const val = parseFloat(amount) || 0;
    if (val <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    const chosenDate = date || expense.date || new Date().toISOString().split("T")[0];
    const targetMonth = chosenDate.slice(0, 7) || expense.month;

    onSave({
      ...expense,
      description: description.trim(),
      amount: val,
      date: chosenDate,
      month: targetMonth,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Operational Expense"
      subtitle="Studio Expenses Editor"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
            Expense Description *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Cost (₹) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Expense Date (dd/mm/yyyy)
            </label>
            <DatePickerDDMMYYYY value={date} onChange={(d) => setDate(d)} />
          </div>
        </div>

        {error && (
          <p className="text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-200 rounded-lg p-2.5">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4a55a]/20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 text-xs font-semibold text-[#005a55] hover:bg-white rounded-xl border border-[#d4a55a]/40 transition-colors cursor-pointer touch-manipulation text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-5 py-3 sm:py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer touch-manipulation text-center"
          >
            Save Changes ✦
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Finance Tab ─────────────────────────────────────────────────────────

interface MonthSummary {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  orderCount: number;
}

export function FinanceTab({ orders, expenses, onUpdate }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [subView, setSubView] = useState<"expenses" | "inflow" | "statement">("expenses");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<MonthlyExpense | null>(null);

  // Build all months from orders + expenses + current
  const allMonths = useMemo(() => {
    const set = new Set<string>([currentMonth()]);
    orders.forEach((o) => set.add(o.month));
    expenses.forEach((e) => set.add(e.month));
    return Array.from(set).sort().reverse();
  }, [orders, expenses]);

  // Per-month summaries
  const summaries = useMemo<MonthSummary[]>(() => {
    return allMonths.map((m) => {
      const mo = orders.filter((o) => o.month === m);
      const me = expenses.filter((e) => e.month === m);

      const revenue =
        mo.filter((o) => o.fullPaid).reduce((s, o) => s + o.amount, 0) +
        mo.filter((o) => !o.fullPaid && o.advancePaid).reduce((s, o) => s + o.advance, 0);

      const expTotal = me.reduce((s, e) => s + e.amount, 0);
      return {
        month: m,
        revenue,
        expenses: expTotal,
        profit: revenue - expTotal,
        orderCount: mo.length,
      };
    });
  }, [allMonths, orders, expenses]);

  const curSummary = summaries.find((s) => s.month === selectedMonth) ?? {
    month: selectedMonth,
    revenue: 0,
    expenses: 0,
    profit: 0,
    orderCount: 0,
  };
  const curExpenses = expenses.filter((e) => e.month === selectedMonth);
  const curOrders = orders.filter((o) => o.month === selectedMonth);

  // Year aggregates
  const yr = new Date().getFullYear().toString();
  const yrSummaries = summaries.filter((s) => s.month.startsWith(yr));
  const yrRevenue = yrSummaries.reduce((s, m) => s + m.revenue, 0);
  const yrExpenses = yrSummaries.reduce((s, m) => s + m.expenses, 0);
  const yrProfit = yrRevenue - yrExpenses;

  const handleAddExpense = (e: MonthlyExpense) => {
    onUpdate([...expenses, e]);
  };

  const handleSaveExpense = (updated: MonthlyExpense) => {
    onUpdate(expenses.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteExpense = (id: string) => {
    if (!confirm("Permanently remove this expense record?")) return;
    onUpdate(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Modals */}
      <AddExpenseModal
        open={addModalOpen}
        month={selectedMonth}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddExpense}
      />

      <EditExpenseModal
        expense={editingExpense}
        open={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={handleSaveExpense}
      />

      {/* Mobile-Optimized Fiscal KPI Card */}
      <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
        {/* 3 Metrics in balanced 3-column grid on all viewports */}
        <div className="grid grid-cols-3 gap-2 text-center sm:text-left sm:flex sm:items-center sm:gap-6">
          <div className="border-r sm:border-r-0 border-[#d4a55a]/20 pr-1 sm:pr-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block truncate">
              {yr} Inflow
            </span>
            <span
              className="text-base sm:text-lg font-bold text-[#00756e] truncate block"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(yrRevenue)}
            </span>
          </div>

          <div className="border-r sm:border-r-0 border-[#d4a55a]/20 pr-1 sm:pr-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block truncate">
              {yr} Expenses
            </span>
            <span
              className="text-base sm:text-lg font-bold text-rose-700 truncate block"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(yrExpenses)}
            </span>
          </div>

          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block truncate">
              {yr} Net Profit
            </span>
            <span
              className={`text-base sm:text-lg font-bold truncate block ${
                yrProfit >= 0 ? "text-[#005a55]" : "text-rose-700"
              }`}
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(yrProfit)}
            </span>
          </div>
        </div>

        {/* Action Button: Full-width on mobile, auto on sm */}
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl py-2.5 px-4 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation active:scale-[0.98]"
        >
          <span className="text-[#d4a55a] text-sm leading-none">+</span>
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Month Selector Pills — Smooth Momentum Scroll for iOS */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider shrink-0 mr-1 hidden xs:inline">
          Period:
        </span>
        {allMonths.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shrink-0 touch-manipulation ${
              selectedMonth === m
                ? "bg-[#005a55] border-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white border-[#d4a55a]/35 text-[#005a55] active:bg-[#F7F5EF]"
            }`}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>

      {/* iOS-Style 3-Segment Tab Bar (No wrapping, zero clipping) */}
      <div className="grid grid-cols-3 gap-1 bg-white border border-[#d4a55a]/30 p-1 rounded-2xl shadow-2xs">
        <button
          type="button"
          onClick={() => setSubView("expenses")}
          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer touch-manipulation truncate ${
            subView === "expenses"
              ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
              : "text-[#005a55]/70 active:text-[#005a55]"
          }`}
        >
          Expenses ({curExpenses.length})
        </button>
        <button
          type="button"
          onClick={() => setSubView("inflow")}
          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer touch-manipulation truncate ${
            subView === "inflow"
              ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
              : "text-[#005a55]/70 active:text-[#005a55]"
          }`}
        >
          Inflow ({curOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setSubView("statement")}
          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer touch-manipulation truncate ${
            subView === "statement"
              ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
              : "text-[#005a55]/70 active:text-[#005a55]"
          }`}
        >
          Statement
        </button>
      </div>

      {/* Sub-header net status */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="text-[11px] text-[#0d3b38]/60">
          Showing {monthLabel(selectedMonth)}
        </span>
        <span className="font-semibold text-[#8c6218]">
          Net Profit:{" "}
          <strong className={curSummary.profit >= 0 ? "text-[#00756e]" : "text-rose-700"}>
            {fmt(curSummary.profit)}
          </strong>
        </span>
      </div>

      {/* ─── SUB-VIEW 1: OPERATIONAL EXPENSES ───────────────────────────────── */}
      {subView === "expenses" && (
        <div className="space-y-2.5">
          {curExpenses.length > 0 ? (
            curExpenses.map((e) => (
              <div
                key={e.id}
                className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 shadow-2xs space-y-2.5"
              >
                {/* Top Row: Description on left, Cost in bold red on right */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[#005a55] leading-snug break-words flex-1">
                    {e.description}
                  </span>
                  <span className="text-base font-bold text-rose-700 shrink-0 ml-2">
                    {fmt(e.amount)}
                  </span>
                </div>

                {/* Bottom Row: Date Pill on left, Edit & Delete buttons on right (Never overlaps!) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#d4a55a]/15">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#8c6218]">Date:</span>
                    <InlineDatePickerDDMMYYYY
                      value={e.date || (e.createdAt ? e.createdAt.split("T")[0] : "")}
                      onChange={(val) => {
                        if (!val) return;
                        handleSaveExpense({
                          ...e,
                          date: val,
                          month: val.slice(0, 7),
                        });
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingExpense(e)}
                      className="text-xs text-[#005a55] font-bold px-3 py-1.5 rounded-lg border border-[#005a55]/30 bg-[#fdfcf7] active:bg-[#005a55]/10 touch-manipulation cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(e.id)}
                      className="text-xs text-rose-600 font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white active:bg-rose-50 touch-manipulation cursor-pointer"
                      title="Delete expense"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-8 text-center text-xs text-[#005a55]/60 shadow-2xs">
              No operational expenses logged for {monthLabel(selectedMonth)}.
            </div>
          )}
        </div>
      )}

      {/* ─── SUB-VIEW 2: COMMISSIONS INFLOW ─────────────────────────────────── */}
      {subView === "inflow" && (
        <div className="space-y-2.5">
          {curOrders.length > 0 ? (
            curOrders.map((o) => (
              <div
                key={o.id}
                className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 shadow-2xs space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div
                      className="text-sm font-semibold text-[#005a55]"
                      style={{ fontFamily: "'Antic Didone', serif" }}
                    >
                      {o.clientName}
                    </div>
                    <div className="text-[11px] text-[#8c6218] font-medium mt-0.5">
                      {o.projectType}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#00756e]">{fmt(o.amount)}</div>
                    <div className="text-[10px] font-semibold text-[#0d3b38]/60">
                      {o.fullPaid ? "✓ Full Paid" : o.advancePaid ? `Adv: ${fmt(o.advance)}` : "Due"}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#0d3b38]/50 pt-1 border-t border-[#d4a55a]/15">
                  Date: {formatDisplayDate(o.date || o.createdAt, o.month)}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-8 text-center text-xs text-[#005a55]/60 shadow-2xs">
              No client commissions billed in {monthLabel(selectedMonth)}.
            </div>
          )}
        </div>
      )}

      {/* ─── SUB-VIEW 3: STATEMENT BREAKDOWN ───────────────────────────────── */}
      {subView === "statement" && (
        <div className="bg-white border border-[#d4a55a]/35 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="border-b border-[#d4a55a]/20 pb-3">
            <div className="text-[10px] font-bold text-[#8c6218] uppercase tracking-[0.25em] mb-0.5">
              Monthly Statement
            </div>
            <h3
              className="text-xl sm:text-2xl text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {monthLabel(selectedMonth)} Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-3 text-center">
              <div className="text-base sm:text-xl font-bold text-[#00756e] truncate">
                {fmt(curSummary.revenue)}
              </div>
              <div className="text-[9.5px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
                Inflow
              </div>
            </div>

            <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-3 text-center">
              <div className="text-base sm:text-xl font-bold text-rose-700 truncate">
                {fmt(curSummary.expenses)}
              </div>
              <div className="text-[9.5px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
                Expenses
              </div>
            </div>

            <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-3 text-center">
              <div
                className={`text-base sm:text-xl font-bold truncate ${
                  curSummary.profit >= 0 ? "text-[#005a55]" : "text-rose-700"
                }`}
              >
                {fmt(curSummary.profit)}
              </div>
              <div className="text-[9.5px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
                Net Profit
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
