/**
 * Finance Tab — Monthly revenue, operational expenses & net profit tracker.
 * Features:
 *  - Full CRUD: Create, Read (Compact Atelier Rows), Update (Edit Expense Modal), Delete.
 *  - High-density KPI strip (eliminates stacked massive boxes).
 *  - Sub-views: Operational Expenses, Commissions Inflow, Statement Breakdown.
 *  - Strict dd/mm/yyyy date formatting.
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

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#005a55]/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} bg-[#F7F5EF] border border-[#d4a55a]/45 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,90,85,0.18)] z-10 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between border-b border-[#d4a55a]/25 pb-4 mb-6">
          <div>
            {subtitle && (
              <div className="text-[10px] font-bold text-[#8c6218] tracking-[0.25em] uppercase mb-1">
                {subtitle}
              </div>
            )}
            <h3
              className="text-2xl text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#d4a55a]/40 text-[#005a55] hover:bg-[#005a55] hover:text-[#F7F5EF] flex items-center justify-center text-sm font-semibold transition-all cursor-pointer shadow-2xs"
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
            placeholder="e.g. Meta Ads, Cloud Hosting, Font Licenses..."
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
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
            className="px-5 py-2.5 text-xs font-semibold text-[#005a55] hover:bg-white rounded-xl border border-[#d4a55a]/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-6 py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
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
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Cost (₹) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
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
            className="px-5 py-2.5 text-xs font-semibold text-[#005a55] hover:bg-white rounded-xl border border-[#d4a55a]/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-6 py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
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
    <div className="space-y-5">
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

      {/* Sleek Horizontal Year KPI Ribbon (Replaces massive stacked boxes) */}
      <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              {yr} Gross Inflow
            </span>
            <span
              className="text-lg font-bold text-[#00756e]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(yrRevenue)}
            </span>
          </div>

          <div className="h-7 w-px bg-[#d4a55a]/25 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              {yr} Expenses
            </span>
            <span
              className="text-lg font-bold text-rose-700"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(yrExpenses)}
            </span>
          </div>

          <div className="h-7 w-px bg-[#d4a55a]/25 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              {yr} Net Profit
            </span>
            <span
              className={`text-lg font-bold ${yrProfit >= 0 ? "text-[#005a55]" : "text-rose-700"}`}
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(yrProfit)}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-4 py-2 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span className="text-[#d4a55a] text-sm leading-none">+</span>
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Month Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider shrink-0 mr-1">
          Fiscal Period:
        </span>
        {allMonths.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shrink-0 ${
              selectedMonth === m
                ? "bg-[#005a55] border-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white border-[#d4a55a]/35 text-[#005a55] hover:border-[#005a55]"
            }`}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>

      {/* Sub-view Segmented Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[#d4a55a]/20 pb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubView("expenses")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subView === "expenses"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white text-[#005a55]/70 border border-[#d4a55a]/30 hover:border-[#005a55]"
            }`}
          >
            💸 Operational Expenses ({curExpenses.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView("inflow")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subView === "inflow"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white text-[#005a55]/70 border border-[#d4a55a]/30 hover:border-[#005a55]"
            }`}
          >
            💰 Commissions Inflow ({curOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView("statement")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subView === "statement"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white text-[#005a55]/70 border border-[#d4a55a]/30 hover:border-[#005a55]"
            }`}
          >
            📊 Statement Breakdown
          </button>
        </div>

        <span className="text-[11px] font-semibold text-[#8c6218]">
          {monthLabel(selectedMonth)} Net: <strong>{fmt(curSummary.profit)}</strong>
        </span>
      </div>

      {/* ─── SUB-VIEW 1: OPERATIONAL EXPENSES ───────────────────────────────── */}
      {subView === "expenses" && (
        <div className="space-y-3">
          {curExpenses.length > 0 ? (
            <div className="space-y-2">
              {curExpenses.map((e) => (
                <div
                  key={e.id}
                  className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 shadow-2xs hover:border-[#005a55]/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[#005a55] block truncate">
                      {e.description}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#8c6218] font-bold">Date:</span>
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
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-bold text-rose-700">{fmt(e.amount)}</span>
                    <button
                      type="button"
                      onClick={() => setEditingExpense(e)}
                      className="text-xs text-[#005a55] hover:text-[#00756e] font-bold px-2.5 py-1 rounded-lg border border-[#005a55]/30 bg-[#fdfcf7] cursor-pointer"
                      title="Edit expense description or amount"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(e.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg border border-rose-200 bg-white cursor-pointer"
                      title="Delete expense"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-8 text-center text-xs text-[#005a55]/60 shadow-2xs">
              No operational expenses logged for {monthLabel(selectedMonth)}.
            </div>
          )}
        </div>
      )}

      {/* ─── SUB-VIEW 2: COMMISSIONS INFLOW ─────────────────────────────────── */}
      {subView === "inflow" && (
        <div className="space-y-3">
          {curOrders.length > 0 ? (
            <div className="space-y-2">
              {curOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold text-[#005a55] truncate"
                      style={{ fontFamily: "'Antic Didone', serif" }}
                    >
                      {o.clientName}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#0d3b38]/70 flex-wrap">
                      <span className="text-[#8c6218] font-semibold">{o.projectType}</span>
                      <span>·</span>
                      <span>Date: {formatDisplayDate(o.date || o.createdAt, o.month)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#00756e]">{fmt(o.amount)}</div>
                    <div className="text-[10px] font-semibold text-[#0d3b38]/60">
                      {o.fullPaid ? "✓ Full Paid" : o.advancePaid ? `Adv: ${fmt(o.advance)}` : "Payment Due"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-8 text-center text-xs text-[#005a55]/60 shadow-2xs">
              No client commissions billed in {monthLabel(selectedMonth)}.
            </div>
          )}
        </div>
      )}

      {/* ─── SUB-VIEW 3: STATEMENT BREAKDOWN ───────────────────────────────── */}
      {subView === "statement" && (
        <div className="bg-white border border-[#d4a55a]/35 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#d4a55a]/20 pb-4">
            <div className="text-[10px] font-bold text-[#8c6218] uppercase tracking-[0.25em] mb-1">
              Monthly Statement
            </div>
            <h3
              className="text-2xl text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {monthLabel(selectedMonth)} Statement Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-[#00756e]">{fmt(curSummary.revenue)}</div>
              <div className="text-[10.5px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
                Period Inflow
              </div>
            </div>

            <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-rose-700">{fmt(curSummary.expenses)}</div>
              <div className="text-[10.5px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
                Total Expenses
              </div>
            </div>

            <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-4 text-center">
              <div
                className={`text-xl font-bold ${
                  curSummary.profit >= 0 ? "text-[#005a55]" : "text-rose-700"
                }`}
              >
                {fmt(curSummary.profit)}
              </div>
              <div className="text-[10.5px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
                Net Profit
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
