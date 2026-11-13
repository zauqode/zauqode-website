/**
 * Orders Tab — Track client orders, payment & completion status.
 */

import React, { useState } from "react";
import { type Order, uid, currentMonth } from "../StudioDesk";

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
  "Custom",
];

const STATUS_COLORS = {
  completed: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40",
  pending: "text-amber-400 bg-amber-900/20 border-amber-800/40",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function OrderRow({ order, onUpdate, onDelete }: {
  order: Order;
  onUpdate: (o: Order) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggle = (field: keyof Order) => {
    onUpdate({ ...order, [field]: !order[field as keyof Order] });
  };

  const statusClass = order.completed ? STATUS_COLORS.completed : STATUS_COLORS.pending;

  return (
    <div className="border border-[#d4a55a]/20 rounded-xl overflow-hidden bg-[#0d2b29]">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#d4a55a]/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#f3e3c0] text-sm font-semibold truncate">{order.clientName}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${statusClass}`}
            >
              {order.completed ? "Complete" : "Pending"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-[#f3e3c0]/50 text-xs">{order.projectType}</span>
            <span className="text-[#d4a55a] text-xs font-semibold">{fmt(order.amount)}</span>
            {order.fullPaid && (
              <span className="text-emerald-400 text-[10px]">✓ Full paid</span>
            )}
            {!order.fullPaid && order.advancePaid && (
              <span className="text-amber-400 text-[10px]">Advance: {fmt(order.advance)}</span>
            )}
          </div>
        </div>
        <span className="text-[#f3e3c0]/30 text-xs shrink-0">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#d4a55a]/15 px-4 py-4 space-y-4">
          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(
              [
                { key: "advancePaid", label: "Advance Paid" },
                { key: "fullPaid", label: "Full Payment" },
                { key: "completed", label: "Completed" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  order[key]
                    ? "bg-emerald-900/30 border-emerald-700/50 text-emerald-400"
                    : "bg-[#0a1f1e] border-[#d4a55a]/20 text-[#f3e3c0]/50 hover:border-[#d4a55a]/40"
                }`}
              >
                <span>{order[key] ? "✓" : "○"}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            <div className="text-[#f3e3c0]/40">Total Amount</div>
            <div className="text-[#f3e3c0]">{fmt(order.amount)}</div>
            <div className="text-[#f3e3c0]/40">Advance</div>
            <div className="text-[#f3e3c0]">{fmt(order.advance)}</div>
            <div className="text-[#f3e3c0]/40">Remaining</div>
            <div className={`font-semibold ${order.fullPaid ? "text-emerald-400" : "text-amber-400"}`}>
              {order.fullPaid ? "—" : fmt(order.amount - order.advance)}
            </div>
            {order.deadline && (
              <>
                <div className="text-[#f3e3c0]/40">Deadline</div>
                <div className="text-[#f3e3c0]">{order.deadline}</div>
              </>
            )}
            {order.notes && (
              <>
                <div className="text-[#f3e3c0]/40 col-span-2 mt-1">Notes</div>
                <div className="text-[#f3e3c0]/70 col-span-2 text-xs leading-relaxed">{order.notes}</div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Delete order
          </button>
        </div>
      )}
    </div>
  );
}

function AddOrderForm({ onAdd }: { onAdd: (o: Order) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    projectType: PROJECT_TYPES[0],
    amount: "",
    advance: "",
    advancePaid: false,
    fullPaid: false,
    completed: false,
    deadline: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim()) { setError("Client name required."); return; }
    const amount = parseFloat(form.amount) || 0;
    const advance = parseFloat(form.advance) || 0;
    if (amount <= 0) { setError("Enter a valid amount."); return; }

    const order: Order = {
      id: uid(),
      clientName: form.clientName.trim(),
      projectType: form.projectType,
      amount,
      advance,
      advancePaid: form.advancePaid,
      fullPaid: form.fullPaid,
      completed: form.completed,
      deadline: form.deadline || undefined,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      month: currentMonth(),
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
        className="w-full border-2 border-dashed border-[#d4a55a]/30 rounded-xl py-4 text-sm text-[#d4a55a]/60 hover:border-[#d4a55a]/60 hover:text-[#d4a55a] transition-all"
      >
        + Add New Order
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d2b29] border border-[#d4a55a]/30 rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-[#d4a55a] text-xs tracking-[0.25em] uppercase font-semibold">
        New Order
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Client Name *</label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="e.g. Priya & Rahul"
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Project Type</label>
          <select
            value={form.projectType}
            onChange={(e) => setForm({ ...form, projectType: e.target.value })}
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] outline-none focus:border-[#d4a55a]/60 transition-colors"
          >
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Total Amount (₹) *</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 15000"
            min="0"
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Advance Received (₹)</label>
          <input
            type="number"
            value={form.advance}
            onChange={(e) => setForm({ ...form, advance: e.target.value })}
            placeholder="e.g. 5000"
            min="0"
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Deadline (optional)</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] outline-none focus:border-[#d4a55a]/60 transition-colors"
          />
        </div>
        <div className="flex flex-col justify-end gap-2">
          {(
            [
              { key: "advancePaid", label: "Advance Paid" },
              { key: "fullPaid", label: "Full Payment Received" },
              { key: "completed", label: "Completed" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="rounded border-[#d4a55a]/40 bg-[#0a1f1e] accent-[#d4a55a]"
              />
              <span className="text-xs text-[#f3e3c0]/70">{label}</span>
            </label>
          ))}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            placeholder="Any additional notes…"
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors resize-none"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-[#d4a55a] text-[#0a1f1e] rounded-lg py-3 text-sm font-semibold hover:bg-[#c49348] transition-colors"
        >
          Add Order
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 border border-[#d4a55a]/30 text-[#f3e3c0]/60 rounded-lg text-sm hover:border-[#d4a55a]/60 transition-colors"
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
    if (!confirm("Delete this order?")) return;
    onUpdate(orders.filter((o) => o.id !== id));
  };

  const pending = orders.filter((o) => !o.completed);
  const completed = orders.filter((o) => o.completed);
  const totalRevenue = orders.filter((o) => o.fullPaid).reduce((s, o) => s + o.amount, 0);
  const pendingRevenue = orders.filter((o) => !o.fullPaid).reduce((s, o) => s + (o.amount - o.advance), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[#f3e3c0] text-xl" style={{ fontFamily: "'Antic Didone', serif" }}>
          Orders
        </h2>
        <div className="flex gap-4 text-xs">
          <span className="text-emerald-400 font-semibold">
            Collected: ₹{totalRevenue.toLocaleString("en-IN")}
          </span>
          <span className="text-amber-400">
            Pending: ₹{pendingRevenue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <AddOrderForm onAdd={handleAdd} />

      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs text-[#f3e3c0]/50 tracking-widest uppercase">
            Active ({pending.length})
          </h3>
          {pending.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(o.id)}
            />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs text-[#f3e3c0]/50 tracking-widest uppercase">
            Completed ({completed.length})
          </h3>
          {completed.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(o.id)}
            />
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <p className="text-center text-[#f3e3c0]/30 text-sm py-12">
          No orders yet. Add your first one above.
        </p>
      )}
    </div>
  );
}
