/**
 * Orders Tab — Track client orders, payment & completion status.
 * Styled in Zauqode's signature luxury atelier aesthetic.
 */

import React, { useState } from "react";
import { type Order, uid, currentMonth } from "../StudioDesk";
import { formatDisplayDate } from "./FinanceTab";

interface Props {
  orders: Order[];
  onUpdate: (orders: Order[]) => void;
}

const PROJECT_TYPES = [
  "Wedding Website",
  "Invitation Suite",
  "Video Reel",
  "Stall Design",
  "Business Website",
  "Custom Experience",
];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function OrderRow({
  order,
  onUpdate,
  onDelete,
}: {
  order: Order;
  onUpdate: (o: Order) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggle = (field: keyof Order) => {
    onUpdate({ ...order, [field]: !order[field as keyof Order] });
  };

  return (
    <div className="border border-[#d4a55a]/30 rounded-2xl overflow-hidden bg-white shadow-xs transition-all hover:border-[#005a55]/40">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F7F5EF]/40 transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="text-[#005a55] text-base sm:text-lg font-medium truncate"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {order.clientName}
            </span>
            <span
              className={`text-[10px] sm:text-[10.5px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                order.completed
                  ? "bg-[#eef8f3] text-[#00756e] border-[#cdeee3]"
                  : "bg-[#fef9ee] text-[#8c6218] border-[#f5e4bf]"
              }`}
            >
              {order.completed ? "Delivered" : "In Progress"}
            </span>
            {order.fullPaid ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#eef8f3] text-[#00756e] border border-[#cdeee3]">
                Full Paid
              </span>
            ) : order.advancePaid ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#fef9ee] text-[#8c6218] border border-[#f5e4bf]">
                Advance Recv.
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-600 border border-rose-200">
                Payment Due
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 mt-1.5 flex-wrap text-xs text-[#0d3b38]/60">
            <span className="text-[#8c6218] font-semibold">{order.projectType}</span>
            <span>·</span>
            <span className="text-[#005a55] font-bold">{fmt(order.amount)}</span>
            <span>·</span>
            <span className="text-[11px] text-[#005a55]/80 font-medium">
              {formatDisplayDate(order.date || order.createdAt, order.month)}
            </span>
            {order.deadline && (
              <>
                <span>·</span>
                <span className="text-[11px]">Due: {order.deadline}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#005a55]/60 text-xs font-semibold shrink-0">
          <span>{expanded ? "Hide Details" : "View"}</span>
          <span className="text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#d4a55a]/20 px-5 py-5 space-y-5 bg-[#fdfcf7]/60">
          {/* Status Checkbox Pills */}
          <div>
            <div className="text-[10px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-2">
              Update Order Status
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { key: "advancePaid", label: "Advance Paid" },
                  { key: "fullPaid", label: "Full Payment Settled" },
                  { key: "completed", label: "Project Completed" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    order[key]
                      ? "bg-[#eef8f3] border-[#00756e]/40 text-[#00756e]"
                      : "bg-white border-[#d4a55a]/30 text-[#005a55]/50 hover:border-[#005a55]/40"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-sm">{order[key] ? "✓" : "○"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Financial Breakdown Grid */}
          <div className="bg-white border border-[#d4a55a]/25 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#0d3b38]/50 block mb-0.5">Total Agreed</span>
              <span className="text-sm font-bold text-[#005a55]">{fmt(order.amount)}</span>
            </div>
            <div>
              <span className="text-[#0d3b38]/50 block mb-0.5">Advance Received</span>
              <span className="text-sm font-bold text-[#8c6218]">{fmt(order.advance)}</span>
            </div>
            <div>
              <span className="text-[#0d3b38]/50 block mb-0.5">Pending Balance</span>
              <span
                className={`text-sm font-bold ${
                  order.fullPaid ? "text-[#00756e]" : "text-rose-600"
                }`}
              >
                {order.fullPaid ? "₹0 (Settled)" : fmt(order.amount - order.advance)}
              </span>
            </div>
            <div>
              <span className="text-[#0d3b38]/50 block mb-0.5">Target Delivery</span>
              <span className="text-sm font-semibold text-[#005a55]">
                {order.deadline || "Flexible"}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white border border-[#d4a55a]/20 rounded-xl p-3.5 text-xs">
              <span className="text-[#8c6218] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                Internal Notes & Client Requirements:
              </span>
              <p className="text-[#0d3b38]/80 leading-relaxed">{order.notes}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold transition-colors cursor-pointer"
            >
              Remove Order Record ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddOrderForm({ onAdd }: { onAdd: (o: Order) => void }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    clientName: "",
    projectType: PROJECT_TYPES[0],
    amount: "",
    advance: "",
    advancePaid: false,
    fullPaid: false,
    completed: false,
    date: today,
    deadline: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim()) {
      setError("Client name is required.");
      return;
    }
    const amount = parseFloat(form.amount) || 0;
    const advance = parseFloat(form.advance) || 0;
    if (amount <= 0) {
      setError("Please enter a valid total project amount.");
      return;
    }

    const chosenDate = form.date || today;
    const targetMonth = chosenDate.slice(0, 7) || currentMonth();

    const order: Order = {
      id: uid(),
      clientName: form.clientName.trim(),
      projectType: form.projectType,
      amount,
      advance,
      advancePaid: form.advancePaid,
      fullPaid: form.fullPaid,
      completed: form.completed,
      date: chosenDate,
      deadline: form.deadline || undefined,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      month: targetMonth,
    };
    onAdd(order);
    setForm({
      clientName: "",
      projectType: PROJECT_TYPES[0],
      amount: "",
      advance: "",
      advancePaid: false,
      fullPaid: false,
      completed: false,
      date: today,
      deadline: "",
      notes: "",
    });
    setOpen(false);
    setError("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-white border-2 border-dashed border-[#d4a55a]/45 hover:border-[#005a55] rounded-2xl py-4.5 px-6 text-sm font-semibold text-[#005a55] hover:text-[#00756e] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
      >
        <span className="text-lg text-[#8c6218] font-bold">+</span>
        <span>Register New Client Order</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#d4a55a]/35 rounded-3xl p-6 sm:p-8 shadow-[0_6px_30px_rgba(0,90,85,0.04)] space-y-6"
    >
      <div>
        <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.25em] uppercase mb-1">
          Client Registry
        </div>
        <h3
          className="text-xl sm:text-2xl text-[#005a55]"
          style={{ fontFamily: "'Antic Didone', serif" }}
        >
          New Client Order Record
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Client / Couple Name *
          </label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="e.g. Priya & Rahul"
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Bespoke Service Type
          </label>
          <select
            value={form.projectType}
            onChange={(e) => setForm({ ...form, projectType: e.target.value })}
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all cursor-pointer"
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Total Project Amount (₹) *
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 25000"
            min="0"
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Advance Received (₹)
          </label>
          <input
            type="number"
            value={form.advance}
            onChange={(e) => setForm({ ...form, advance: e.target.value })}
            placeholder="e.g. 10000"
            min="0"
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Order / Commission Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all cursor-pointer font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Delivery Deadline
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all cursor-pointer"
          />
        </div>

        <div className="flex flex-col justify-end gap-2.5">
          {(
            [
              { key: "advancePaid", label: "Advance Payment Received" },
              { key: "fullPaid", label: "Full Payment Received" },
              { key: "completed", label: "Project Finished & Delivered" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="w-4 h-4 rounded border-[#d4a55a] text-[#005a55] focus:ring-[#005a55] cursor-pointer"
              />
              <span className="text-xs font-semibold text-[#005a55]/80">{label}</span>
            </label>
          ))}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Notes & Custom Requests
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            placeholder="Theme palette, special features, RSVP details..."
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-rose-600 text-xs font-medium bg-rose-50 border border-rose-200 rounded-lg p-2.5">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl py-3.5 text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Save Order Record ✦
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 border border-[#d4a55a]/50 text-[#005a55] rounded-xl text-sm font-semibold hover:bg-[#F7F5EF] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function OrdersTab({ orders, onUpdate }: Props) {
  const handleAdd = (o: Order) => onUpdate([o, ...orders]);
  const handleUpdate = (updated: Order) =>
    onUpdate(orders.map((o) => (o.id === updated.id ? updated : o)));
  const handleDelete = (id: string) => {
    if (!confirm("Permanently delete this order record?")) return;
    onUpdate(orders.filter((o) => o.id !== id));
  };

  const pending = orders.filter((o) => !o.completed);
  const completed = orders.filter((o) => o.completed);
  const totalCollected = orders
    .filter((o) => o.fullPaid)
    .reduce((s, o) => s + o.amount, 0) +
    orders
      .filter((o) => !o.fullPaid && o.advancePaid)
      .reduce((s, o) => s + o.advance, 0);

  const pendingBalance = orders
    .filter((o) => !o.fullPaid)
    .reduce((s, o) => s + (o.amount - (o.advancePaid ? o.advance : 0)), 0);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-5 shadow-xs">
          <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-1">
            Total Inflow Collected
          </div>
          <div
            className="text-2xl sm:text-3xl font-bold text-[#00756e]"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            {fmt(totalCollected)}
          </div>
          <div className="text-[11px] text-[#0d3b38]/50 mt-1">Settled payments & advances</div>
        </div>

        <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-5 shadow-xs">
          <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-1">
            Pending Balances
          </div>
          <div
            className="text-2xl sm:text-3xl font-bold text-amber-700"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            {fmt(pendingBalance)}
          </div>
          <div className="text-[11px] text-[#0d3b38]/50 mt-1">Outstanding receivable</div>
        </div>

        <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-5 shadow-xs">
          <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.2em] uppercase mb-1">
            Active Commissions
          </div>
          <div
            className="text-2xl sm:text-3xl font-bold text-[#005a55]"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            {pending.length} Projects
          </div>
          <div className="text-[11px] text-[#0d3b38]/50 mt-1">{completed.length} completed & delivered</div>
        </div>
      </div>

      <AddOrderForm onAdd={handleAdd} />

      {/* Pending Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4a55a]/25 pb-2">
          <h3 className="text-xs font-bold text-[#8c6218] tracking-widest uppercase">
            Active Commissions ({pending.length})
          </h3>
        </div>

        {pending.length > 0 ? (
          <div className="space-y-3">
            {pending.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                onUpdate={handleUpdate}
                onDelete={() => handleDelete(o.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#d4a55a]/25 rounded-2xl p-8 text-center text-xs text-[#005a55]/60">
            No pending commissions currently active.
          </div>
        )}
      </div>

      {/* Completed Orders List */}
      {completed.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#d4a55a]/25 pb-2">
            <h3 className="text-xs font-bold text-[#8c6218] tracking-widest uppercase">
              Completed & Delivered Archive ({completed.length})
            </h3>
          </div>

          <div className="space-y-3 opacity-90">
            {completed.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                onUpdate={handleUpdate}
                onDelete={() => handleDelete(o.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
