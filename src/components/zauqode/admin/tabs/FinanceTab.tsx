/**
 * Finance Tab — Monthly revenue, expenses & profit tracker.
 */

import React, { useState, useMemo } from "react";
import { type Order, type MonthlyExpense, uid, currentMonth } from "../StudioDesk";

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
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(mo, 10) - 1]} ${y}`;
}

function AddExpenseForm({ month, onAdd }: {
  month: string;
  onAdd: (e: MonthlyExpense) => void;
}) {
  const [form, setForm] = useState({ description: "", amount: "" });
  const [error, setError] = useState("");

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.description.trim()) { setError("Description required."); return; }
    const amount = parseFloat(form.amount) || 0;
    if (amount <= 0) { setError("Enter a valid amount."); return; }
    onAdd({
      id: uid(),
      month,
      description: form.description.trim(),
      amount,
      createdAt: new Date().toISOString(),
    });
    setForm({ description: "", amount: "" });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Expense description"
          className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
        />
        {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
      </div>
      <div className="w-28 shrink-0">
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount ₹"
          min="0"
          className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 bg-[#d4a55a] text-[#0a1f1e] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#c49348] transition-colors"
      >
        Add
      </button>
    </form>
  );
}

interface MonthSummary {
  month: string;
  revenue: number;        // sum of fullPaid orders
  advanceIn: number;      // sum of advance received
  expenses: number;       // sum of monthly expenses
  profit: number;         // revenue - expenses
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
      const revenue = mo.filter((o) => o.fullPaid).reduce((s, o) => s + o.amount, 0);
      const advanceIn = mo.reduce((s, o) => s + o.advance, 0);
      const expTotal = me.reduce((s, e) => s + e.amount, 0);
      return {
        month: m,
        revenue,
        advanceIn,
        expenses: expTotal,
        profit: revenue - expTotal,
        orderCount: mo.length,
      };
    });
  }, [allMonths, orders, expenses]);

  const curSummary = summaries.find((s) => s.month === selectedMonth) ?? {
    month: selectedMonth, revenue: 0, advanceIn: 0, expenses: 0, profit: 0, orderCount: 0,
  };
  const curExpenses = expenses.filter((e) => e.month === selectedMonth);

  const handleAddExpense = (e: MonthlyExpense) => {
    onUpdate([...expenses, e]);
  };

  const handleDeleteExpense = (id: string) => {
    if (!confirm("Delete this expense?")) return;
    onUpdate(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-[#f3e3c0] text-xl" style={{ fontFamily: "'Antic Didone', serif" }}>
        Finance
      </h2>

      {/* Year-at-a-glance totals */}
      {(() => {
        const yr = new Date().getFullYear().toString();
        const yrSummaries = summaries.filter((s) => s.month.startsWith(yr));
        const yrRevenue = yrSummaries.reduce((s, m) => s + m.revenue, 0);
        const yrExpenses = yrSummaries.reduce((s, m) => s + m.expenses, 0);
        const yrProfit = yrRevenue - yrExpenses;
        return (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: `${yr} Revenue`, value: fmt(yrRevenue), color: "text-emerald-400" },
              { label: `${yr} Expenses`, value: fmt(yrExpenses), color: "text-red-400" },
              { label: `${yr} Profit`, value: fmt(yrProfit), color: yrProfit >= 0 ? "text-[#d4a55a]" : "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#0d2b29] border border-[#d4a55a]/20 rounded-xl p-4 text-center">
                <div className={`text-lg font-bold ${color}`}>{value}</div>
                <div className="text-[10px] text-[#f3e3c0]/40 mt-0.5 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Month selector */}
      <div>
        <label className="block text-xs text-[#f3e3c0]/50 mb-2 tracking-widest uppercase">
          Select Month
        </label>
        <div className="flex flex-wrap gap-2">
          {allMonths.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedMonth === m
                  ? "bg-[#d4a55a] border-[#d4a55a] text-[#0a1f1e] font-bold"
                  : "border-[#d4a55a]/30 text-[#f3e3c0]/60 hover:border-[#d4a55a]/60"
              }`}
            >
              {monthLabel(m)}
            </button>
          ))}
        </div>
      </div>

      {/* Month detail */}
      <div className="bg-[#0d2b29] border border-[#d4a55a]/20 rounded-2xl p-6 space-y-6">
        <h3 className="text-[#d4a55a] font-semibold text-sm tracking-wide">
          {monthLabel(selectedMonth)}
        </h3>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Revenue", value: fmt(curSummary.revenue), color: "text-emerald-400" },
            { label: "Advance In", value: fmt(curSummary.advanceIn), color: "text-amber-400" },
            { label: "Expenses", value: fmt(curSummary.expenses), color: "text-red-400" },
            {
              label: "Net Profit",
              value: fmt(curSummary.profit),
              color: curSummary.profit >= 0 ? "text-[#d4a55a]" : "text-red-400",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0a1f1e] rounded-xl p-3 text-center">
              <div className={`text-base font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-[#f3e3c0]/40 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Orders for this month */}
        {(() => {
          const mo = orders.filter((o) => o.month === selectedMonth);
          return mo.length > 0 ? (
            <div>
              <h4 className="text-xs text-[#f3e3c0]/50 tracking-widest uppercase mb-3">
                Orders ({mo.length})
              </h4>
              <div className="space-y-2">
                {mo.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#0a1f1e] rounded-lg"
                  >
                    <div>
                      <div className="text-sm text-[#f3e3c0]">{o.clientName}</div>
                      <div className="text-[10px] text-[#f3e3c0]/40">{o.projectType}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-semibold ${o.fullPaid ? "text-emerald-400" : "text-amber-400"}`}>
                        {fmt(o.amount)}
                      </div>
                      <div className="text-[10px] text-[#f3e3c0]/40">
                        {o.fullPaid ? "✓ Full paid" : o.advancePaid ? `Adv: ${fmt(o.advance)}` : "Unpaid"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#f3e3c0]/30 text-center py-2">No orders for this month.</p>
          );
        })()}

        {/* Expenses */}
        <div>
          <h4 className="text-xs text-[#f3e3c0]/50 tracking-widest uppercase mb-3">
            Expenses
          </h4>
          <div className="space-y-2 mb-4">
            {curExpenses.length === 0 && (
              <p className="text-xs text-[#f3e3c0]/30 text-center py-2">No expenses logged yet.</p>
            )}
            {curExpenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#0a1f1e] rounded-lg"
              >
                <span className="text-sm text-[#f3e3c0]/80 flex-1 truncate">{e.description}</span>
                <span className="text-sm font-semibold text-red-400 shrink-0">{fmt(e.amount)}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteExpense(e.id)}
                  className="text-[#f3e3c0]/20 hover:text-red-400 text-xs transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <AddExpenseForm month={selectedMonth} onAdd={handleAddExpense} />
        </div>
      </div>
    </div>
  );
}
