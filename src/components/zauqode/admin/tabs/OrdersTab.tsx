/**
 * Orders Tab — Track client commissions, advance payments, deadlines & fulfillment.
 * Features:
 *  - Full CRUD: Create, Read (High-density rows/table), Update (Edit Order Modal), Delete.
 *  - Sub-views: Active Commissions vs Delivered Archive.
 *  - Compact single-row KPI ribbon (no massive bloated cards).
 *  - Strict dd/mm/yyyy date format.
 */

import React, { useState, useMemo } from "react";
import { type Order, uid, currentMonth } from "../StudioDesk";
import { formatDisplayDate } from "./FinanceTab";
import { DatePickerDDMMYYYY, toDDMMYYYY } from "../DatePickerDDMMYYYY";

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

// ─── Modal Dialog Wrapper ─────────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
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

// ─── Add Order Modal ──────────────────────────────────────────────────────────

function AddOrderModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (o: Order) => void;
}) {
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
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register Client Commission"
      subtitle="Client Registry"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Client / Couple Name *
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="e.g. Priya & Rahul"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <select
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55] cursor-pointer font-semibold"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Total Agreed Amount (₹) *
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 25000"
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Advance Received (₹)
            </label>
            <input
              type="number"
              value={form.advance}
              onChange={(e) => setForm({ ...form, advance: e.target.value })}
              placeholder="e.g. 10000"
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Order Date (dd/mm/yyyy)
            </label>
            <DatePickerDDMMYYYY
              value={form.date}
              onChange={(d) => setForm({ ...form, date: d })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Delivery Deadline
            </label>
            <DatePickerDDMMYYYY
              value={form.deadline}
              onChange={(d) => setForm({ ...form, deadline: d })}
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>

        {/* Status Toggles */}
        <div className="bg-white/70 border border-[#d4a55a]/30 rounded-xl p-3.5 space-y-2">
          <div className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider mb-1">
            Payment & Fulfillment Status:
          </div>
          <div className="flex flex-wrap gap-4">
            {(
              [
                { key: "advancePaid", label: "Advance Received" },
                { key: "fullPaid", label: "Full Payment Settled" },
                { key: "completed", label: "Delivered & Complete" },
              ] as const
            ).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#005a55]">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-[#d4a55a] text-[#005a55] focus:ring-[#005a55] cursor-pointer"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
            Internal Notes & Custom Requests
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            placeholder="Theme palette, special features, RSVP details..."
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2 text-sm text-[#005a55] outline-none focus:border-[#005a55] resize-none"
          />
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
            Save Order Record ✦
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit Order Modal ─────────────────────────────────────────────────────────

function EditOrderModal({
  order,
  open,
  onClose,
  onSave,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onSave: (o: Order) => void;
}) {
  const [form, setForm] = useState({
    clientName: "",
    projectType: PROJECT_TYPES[0],
    amount: "",
    advance: "",
    advancePaid: false,
    fullPaid: false,
    completed: false,
    date: "",
    deadline: "",
    notes: "",
  });
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (order) {
      setForm({
        clientName: order.clientName || "",
        projectType: order.projectType || PROJECT_TYPES[0],
        amount: order.amount ? String(order.amount) : "0",
        advance: order.advance ? String(order.advance) : "0",
        advancePaid: !!order.advancePaid,
        fullPaid: !!order.fullPaid,
        completed: !!order.completed,
        date: order.date || (order.createdAt ? order.createdAt.split("T")[0] : ""),
        deadline: order.deadline || "",
        notes: order.notes || "",
      });
      setError("");
    }
  }, [order]);

  if (!order) return null;

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

    const chosenDate = form.date || order.date || new Date().toISOString().split("T")[0];
    const targetMonth = chosenDate.slice(0, 7) || order.month || currentMonth();

    const updated: Order = {
      ...order,
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
      month: targetMonth,
    };

    onSave(updated);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Order: ${order.clientName}`}
      subtitle="Client Registry Editor"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Client / Couple Name *
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <select
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55] cursor-pointer font-semibold"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Total Project Amount (₹) *
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Advance Received (₹)
            </label>
            <input
              type="number"
              value={form.advance}
              onChange={(e) => setForm({ ...form, advance: e.target.value })}
              min="0"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Order Date (dd/mm/yyyy)
            </label>
            <DatePickerDDMMYYYY
              value={form.date}
              onChange={(d) => setForm({ ...form, date: d })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Delivery Deadline
            </label>
            <DatePickerDDMMYYYY
              value={form.deadline}
              onChange={(d) => setForm({ ...form, deadline: d })}
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>

        {/* Status Toggles */}
        <div className="bg-white/70 border border-[#d4a55a]/30 rounded-xl p-3.5 space-y-2">
          <div className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider mb-1">
            Payment & Fulfillment Status:
          </div>
          <div className="flex flex-wrap gap-4">
            {(
              [
                { key: "advancePaid", label: "Advance Received" },
                { key: "fullPaid", label: "Full Payment Settled" },
                { key: "completed", label: "Delivered & Complete" },
              ] as const
            ).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#005a55]">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-[#d4a55a] text-[#005a55] focus:ring-[#005a55] cursor-pointer"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
            Internal Notes & Custom Requests
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2 text-sm text-[#005a55] outline-none focus:border-[#005a55] resize-none"
          />
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

// ─── Compact Order Row ────────────────────────────────────────────────────────

function CompactOrderRow({
  order,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  order: Order;
  onEdit: () => void;
  onToggleStatus: (field: "advancePaid" | "fullPaid" | "completed") => void;
  onDelete: () => void;
}) {
  const pendingAmount = order.fullPaid ? 0 : order.amount - (order.advancePaid ? order.advance : 0);

  return (
    <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-4 shadow-2xs hover:border-[#005a55]/40 transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Client & Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-base sm:text-lg font-medium text-[#005a55] truncate"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            {order.clientName}
          </span>

          {/* Service badge */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#005a55] bg-[#eef8f3] border border-[#cdeee3] px-2 py-0.5 rounded-full">
            {order.projectType}
          </span>

          {/* Fulfillment Status */}
          <span
            className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              order.completed
                ? "bg-[#eef8f3] text-[#00756e] border-[#cdeee3]"
                : "bg-[#fef9ee] text-[#8c6218] border-[#f5e4bf]"
            }`}
          >
            {order.completed ? "Delivered" : "In Progress"}
          </span>

          {/* Payment Status */}
          {order.fullPaid ? (
            <span className="text-[9.5px] font-bold bg-[#eef8f3] text-[#00756e] border border-[#cdeee3] px-2 py-0.5 rounded-full">
              Full Paid
            </span>
          ) : order.advancePaid ? (
            <span className="text-[9.5px] font-bold bg-[#fef9ee] text-[#8c6218] border border-[#f5e4bf] px-2 py-0.5 rounded-full">
              Adv: {fmt(order.advance)}
            </span>
          ) : (
            <span className="text-[9.5px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
              Payment Due
            </span>
          )}
        </div>

        {/* Financial & Dates strip */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#0d3b38]/70 flex-wrap">
          <span>
            Total: <strong className="text-[#005a55]">{fmt(order.amount)}</strong>
          </span>
          <span>·</span>
          <span>
            Pending:{" "}
            <strong className={pendingAmount === 0 ? "text-[#00756e]" : "text-rose-600"}>
              {pendingAmount === 0 ? "₹0 (Settled)" : fmt(pendingAmount)}
            </strong>
          </span>
          <span>·</span>
          <span>
            Date:{" "}
            <strong className="text-[#005a55]">
              {formatDisplayDate(order.date || order.createdAt, order.month)}
            </strong>
          </span>
          {order.deadline && (
            <>
              <span>·</span>
              <span>
                Deadline: <strong className="text-[#8c6218]">{toDDMMYYYY(order.deadline)}</strong>
              </span>
            </>
          )}
          {order.notes && (
            <>
              <span>·</span>
              <span className="italic text-[#0d3b38]/50 truncate max-w-[200px]" title={order.notes}>
                "{order.notes}"
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quick Action Toggles & Edit/Delete Toolbar */}
      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d4a55a]/15">
        {/* Quick status checkboxes */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#fdfcf7] border border-[#d4a55a]/25 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-[#005a55]">
          <button
            type="button"
            onClick={() => onToggleStatus("advancePaid")}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              order.advancePaid ? "text-[#00756e] font-bold bg-[#eef8f3]" : "text-[#005a55]/40 hover:text-[#005a55]"
            }`}
            title="Toggle Advance Paid"
          >
            Adv {order.advancePaid ? "✓" : "○"}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onToggleStatus("fullPaid")}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              order.fullPaid ? "text-[#00756e] font-bold bg-[#eef8f3]" : "text-[#005a55]/40 hover:text-[#005a55]"
            }`}
            title="Toggle Full Paid"
          >
            Full {order.fullPaid ? "✓" : "○"}
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onToggleStatus("completed")}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              order.completed ? "text-[#00756e] font-bold bg-[#eef8f3]" : "text-[#005a55]/40 hover:text-[#005a55]"
            }`}
            title="Toggle Delivered"
          >
            Delivered {order.completed ? "✓" : "○"}
          </button>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-[#005a55] hover:text-[#00756e] font-bold px-3 py-1.5 rounded-xl border border-[#005a55]/30 hover:border-[#005a55] bg-white transition-colors cursor-pointer shadow-2xs"
        >
          ✏️ Edit
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2.5 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 bg-white transition-colors cursor-pointer shadow-2xs"
          title="Delete order"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// ─── Main Orders Tab ──────────────────────────────────────────────────────────

export function OrdersTab({ orders, onUpdate }: Props) {
  const [subView, setSubView] = useState<"active" | "completed" | "all">("active");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleAdd = (o: Order) => onUpdate([o, ...orders]);
  const handleSaveEdit = (updated: Order) =>
    onUpdate(orders.map((o) => (o.id === updated.id ? updated : o)));
  const handleDelete = (id: string) => {
    if (!confirm("Permanently delete this order record?")) return;
    onUpdate(orders.filter((o) => o.id !== id));
  };

  const handleToggleStatus = (order: Order, field: "advancePaid" | "fullPaid" | "completed") => {
    const updated = { ...order, [field]: !order[field] };
    handleSaveEdit(updated);
  };

  const pending = useMemo(() => orders.filter((o) => !o.completed), [orders]);
  const completed = useMemo(() => orders.filter((o) => o.completed), [orders]);

  const displayedOrders = useMemo(() => {
    if (subView === "active") return pending;
    if (subView === "completed") return completed;
    return orders;
  }, [subView, pending, completed, orders]);

  // Aggregate metrics
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
    <div className="space-y-5">
      {/* Modals */}
      <AddOrderModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <EditOrderModal
        order={editingOrder}
        open={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleSaveEdit}
      />

      {/* Sleek Horizontal KPI Ribbon (Replaces the 3 massive square boxes!) */}
      <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Inflow Collected
            </span>
            <span
              className="text-lg font-bold text-[#00756e]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(totalCollected)}
            </span>
          </div>

          <div className="h-7 w-px bg-[#d4a55a]/25 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Pending Balances
            </span>
            <span
              className={`text-lg font-bold ${pendingBalance > 0 ? "text-amber-700" : "text-[#00756e]"}`}
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(pendingBalance)}
            </span>
          </div>

          <div className="h-7 w-px bg-[#d4a55a]/25 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Active Commissions
            </span>
            <span
              className="text-lg font-bold text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {pending.length} Projects
            </span>
          </div>

          <div className="h-7 w-px bg-[#d4a55a]/25 hidden sm:block" />

          <div>
            <span className="text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Completed Archive
            </span>
            <span
              className="text-lg font-bold text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {completed.length} Delivered
            </span>
          </div>
        </div>

        {/* Register Order Action Button */}
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-4 py-2 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span className="text-[#d4a55a] text-sm leading-none">+</span>
          <span>Register New Client Order</span>
        </button>
      </div>

      {/* Sub-views Segmented Control */}
      <div className="flex items-center justify-between gap-3 border-b border-[#d4a55a]/20 pb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubView("active")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subView === "active"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white text-[#005a55]/70 border border-[#d4a55a]/30 hover:border-[#005a55]"
            }`}
          >
            ⚡ Active Commissions ({pending.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView("completed")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subView === "completed"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white text-[#005a55]/70 border border-[#d4a55a]/30 hover:border-[#005a55]"
            }`}
          >
            ✓ Delivered Archive ({completed.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView("all")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              subView === "all"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "bg-white text-[#005a55]/70 border border-[#d4a55a]/30 hover:border-[#005a55]"
            }`}
          >
            📋 All Orders ({orders.length})
          </button>
        </div>

        <span className="text-[11px] text-[#0d3b38]/50">
          Showing {displayedOrders.length} order{displayedOrders.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Orders List */}
      {displayedOrders.length > 0 ? (
        <div className="space-y-2.5">
          {displayedOrders.map((o) => (
            <CompactOrderRow
              key={o.id}
              order={o}
              onEdit={() => setEditingOrder(o)}
              onToggleStatus={(field) => handleToggleStatus(o, field)}
              onDelete={() => handleDelete(o.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-10 text-center text-xs text-[#005a55]/60 shadow-2xs">
          {subView === "active"
            ? "No active commissions in progress."
            : subView === "completed"
            ? "No completed orders archived yet."
            : "No client orders registered yet."}
        </div>
      )}
    </div>
  );
}
