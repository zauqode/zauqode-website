/**
 * Finance Tab — Monthly revenue, expenses & profit tracker.
 * Styled in Zauqode's signature luxury atelier aesthetic.
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
  return `${months[parseInt(mo, 10) - 1]} ${y}`;
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

function AddExpenseForm({
  month,
  onAdd,
}: {
  month: string;
  onAdd: (e: MonthlyExpense) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ description: "", amount: "", date: today });
  const [error, setError] = useState("");

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.description.trim()) {
      setError("Expense description is required.");
      return;
    }
    const amount = parseFloat(form.amount) || 0;
    if (amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    const chosenDate = form.date || today;
    const targetMonth = chosenDate.slice(0, 7) || month;
    onAdd({
      id: uid(),
      month: targetMonth,
      description: form.description.trim(),
      amount,
      date: chosenDate,
      createdAt: new Date().toISOString(),
    });
    setForm({ description: "", amount: "", date: today });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
      <div className="flex-1">
        <label className="block text-[11px] font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
          New Expense Item
        </label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="e.g. Meta Ads, Hosting, Domain renewal, Fonts license..."
          className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
        />
        {error && <p className="text-rose-600 text-xs mt-1">{error}</p>}
      </div>

      <div className="w-full sm:w-40 shrink-0">
        <label className="block text-[11px] font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
          Expense Date
        </label>
        <DatePickerDDMMYYYY
          value={form.date}
          onChange={(d) => setForm({ ...form, date: d })}
        />
      </div>

      <div className="w-full sm:w-32 shrink-0">
        <label className="block text-[11px] font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
          Cost (₹)
        </label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="500"
          min="0"
          className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
        />
      </div>

      <button
        type="submit"
        className="shrink-0 bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-5 py-2.5 text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        Record Expense +
      </button>
    </form>
  );
}

interface MonthSummary {
  month: string;
  revenue: number; // sum of fullPaid orders + advance received for this month
  expenses: number; // sum of monthly expenses
  profit: number; // revenue - expenses
  orderCount: number;
}

export function FinanceTab({ orders, expenses, onUpdate }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());

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

      // Revenue collected: settled full orders + any advance received
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

  const handleAddExpense = (e: MonthlyExpense) => {
    onUpdate([...expenses, e]);
  };

  const handleDeleteExpense = (id: string) => {
    if (!confirm("Remove this expense record?")) return;
    onUpdate(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Year-at-a-glance totals */}
      {(() => {
        const yr = new Date().getFullYear().toString();
        const yrSummaries = summaries.filter((s) => s.month.startsWith(yr));
        const yrRevenue = yrSummaries.reduce((s, m) => s + m.revenue, 0);
        const yrExpenses = yrSummaries.reduce((s, m) => s + m.expenses, 0);
        const yrProfit = yrRevenue - yrExpenses;

        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-5 shadow-xs">
              <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-1">
                {yr} Studio Gross Inflow
              </div>
              <div
                className="text-2xl sm:text-3xl font-bold text-[#00756e]"
                style={{ fontFamily: "'Antic Didone', serif" }}
              >
                {fmt(yrRevenue)}
              </div>
              <div className="text-[11px] text-[#0d3b38]/50 mt-1">Total revenue collected</div>
            </div>

            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-5 shadow-xs">
              <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-1">
                {yr} Studio Expenses
              </div>
              <div
                className="text-2xl sm:text-3xl font-bold text-rose-700"
                style={{ fontFamily: "'Antic Didone', serif" }}
              >
                {fmt(yrExpenses)}
              </div>
              <div className="text-[11px] text-[#0d3b38]/50 mt-1">Infrastructure & operational costs</div>
            </div>

            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-5 shadow-xs">
              <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-1">
                {yr} Net Studio Profit
              </div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  yrProfit >= 0 ? "text-[#005a55]" : "text-rose-700"
                }`}
                style={{ fontFamily: "'Antic Didone', serif" }}
              >
                {fmt(yrProfit)}
              </div>
              <div className="text-[11px] text-[#0d3b38]/50 mt-1">After operational deductions</div>
            </div>
          </div>
        );
      })()}

      {/* Month selector */}
      <div>
        <label className="block text-xs font-bold text-[#8c6218] tracking-widest uppercase mb-3">
          Select Fiscal Period
        </label>
        <div className="flex flex-wrap gap-2">
          {allMonths.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMonth(m)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                selectedMonth === m
                  ? "bg-[#005a55] border-[#005a55] text-[#F7F5EF] shadow-xs"
                  : "bg-white border-[#d4a55a]/40 text-[#005a55] hover:border-[#005a55]"
              }`}
            >
              {monthLabel(m)}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Month Detail Card */}
      <div className="bg-white border border-[#d4a55a]/35 rounded-3xl p-6 sm:p-8 shadow-[0_6px_30px_rgba(0,90,85,0.04)] space-y-7">
        <div className="flex items-center justify-between border-b border-[#d4a55a]/20 pb-4 flex-wrap gap-2">
          <div>
            <div className="text-[10px] font-bold text-[#8c6218] tracking-[0.25em] uppercase mb-1">
              Monthly Statement
            </div>
            <h3
              className="text-2xl text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {monthLabel(selectedMonth)} Financial Breakdown
            </h3>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-[#00756e]">{fmt(curSummary.revenue)}</div>
            <div className="text-[11px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
              Period Inflow
            </div>
          </div>

          <div className="bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-rose-700">{fmt(curSummary.expenses)}</div>
            <div className="text-[11px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
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
            <div className="text-[11px] text-[#0d3b38]/50 mt-1 uppercase tracking-wider font-semibold">
              Net Profit
            </div>
          </div>
        </div>

        {/* Commissions Recorded this Month */}
        {(() => {
          const mo = orders.filter((o) => o.month === selectedMonth);
          return (
            <div>
              <h4 className="text-xs font-bold text-[#8c6218] tracking-widest uppercase mb-3">
                Commissions Logged this Month ({mo.length})
              </h4>
              {mo.length > 0 ? (
                <div className="space-y-2">
                  {mo.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-[#fdfcf7] border border-[#d4a55a]/20 rounded-xl"
                    >
                      <div>
                        <div
                          className="text-sm font-semibold text-[#005a55]"
                          style={{ fontFamily: "'Antic Didone', serif" }}
                        >
                          {o.clientName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-[#8c6218] font-medium">{o.projectType}</span>
                          <span className="text-[10px] text-[#0d3b38]/30">·</span>
                          <span className="text-[11px] text-[#005a55]/80 font-semibold">
                            Date: {formatDisplayDate(o.date || o.createdAt, o.month)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#005a55]">{fmt(o.amount)}</div>
                        <div className="text-[10px] text-[#0d3b38]/50 font-semibold">
                          {o.fullPaid ? "✓ Full Paid" : o.advancePaid ? `Adv: ${fmt(o.advance)}` : "Due"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#fdfcf7] border border-[#d4a55a]/20 rounded-xl p-4 text-center text-xs text-[#005a55]/60">
                  No commissions billed in this period.
                </div>
              )}
            </div>
          );
        })()}

        {/* Expense Registry */}
        <div className="pt-2 border-t border-[#d4a55a]/20">
          <h4 className="text-xs font-bold text-[#8c6218] tracking-widest uppercase mb-3">
            Operational Expenses ({curExpenses.length})
          </h4>

          <div className="space-y-2 mb-5">
            {curExpenses.length === 0 ? (
              <p className="text-xs text-[#005a55]/50 italic py-2">
                No expenses logged for this month yet.
              </p>
            ) : (
              curExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-[#fdfcf7] border border-[#d4a55a]/20 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#005a55] block truncate">
                      {e.description}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#8c6218] font-semibold">
                        Date:
                      </span>
                      <InlineDatePickerDDMMYYYY
                        value={e.date || (e.createdAt ? e.createdAt.split("T")[0] : "")}
                        onChange={(val) => {
                          if (!val) return;
                          onUpdate(
                            expenses.map((item) =>
                              item.id === e.id
                                ? { ...item, date: val, month: val.slice(0, 7) }
                                : item
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-rose-700">{fmt(e.amount)}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(e.id)}
                      className="text-rose-400 hover:text-rose-700 text-xs font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
                      title="Remove expense"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#fdfcf7] border border-[#d4a55a]/30 rounded-2xl p-4">
            <AddExpenseForm month={selectedMonth} onAdd={handleAddExpense} />
          </div>
        </div>
      </div>
    </div>
  );
}
