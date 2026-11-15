/**
 * Orders Tab — Track client commissions, advance payments, deadlines & fulfillment.
 * Fully optimized for mobile & iOS Safari with responsive cards and touch manipulation.
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

// ─── iOS Mobile Sheet Modal ───────────────────────────────────────────────────

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#005a55]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Client / Couple Name *
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="e.g. Priya & Rahul"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <select
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55] cursor-pointer font-semibold"
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
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
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
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
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
                { key: "fullPaid", label: "Full Paid" },
                { key: "completed", label: "Delivered & Complete" },
              ] as const
            ).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#005a55] touch-manipulation">
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
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55] resize-none"
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
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 text-xs font-semibold text-[#005a55] hover:bg-white rounded-xl border border-[#d4a55a]/40 transition-colors cursor-pointer touch-manipulation text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-5 py-3 sm:py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer touch-manipulation text-center"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Client / Couple Name *
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <select
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55] cursor-pointer font-semibold"
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
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
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
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-3 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
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
                { key: "fullPaid", label: "Full Paid" },
                { key: "completed", label: "Delivered & Complete" },
              ] as const
            ).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#005a55] touch-manipulation">
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
            className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55] resize-none"
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
    <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-[#005a55]/40 transition-all space-y-2.5">
      {/* Row 1: Client Name, Project Type on left, Total Amount & Status on right */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          <span
            className="text-base font-semibold text-[#005a55] truncate"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            {order.clientName}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#005a55] bg-[#eef8f3] border border-[#cdeee3] px-2 py-0.5 rounded-full">
            {order.projectType}
          </span>
          <span
            className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              order.completed
                ? "bg-[#eef8f3] text-[#00756e] border-[#cdeee3]"
                : "bg-[#fef9ee] text-[#8c6218] border-[#f5e4bf]"
            }`}
          >
            {order.completed ? "Delivered" : "In Progress"}
          </span>
        </div>

        <div className="text-right shrink-0">
          <div className="text-sm sm:text-base font-bold text-[#005a55]">{fmt(order.amount)}</div>
          <div className="text-[10px] font-semibold text-[#0d3b38]/60">
            {order.fullPaid ? (
              <span className="text-[#00756e]">✓ Full Paid</span>
            ) : order.advancePaid ? (
              <span className="text-[#8c6218]">Adv: {fmt(order.advance)}</span>
            ) : (
              <span className="text-rose-600">Payment Due</span>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Financial & Dates Strip */}
      <div className="flex items-center gap-2.5 text-xs text-[#0d3b38]/70 flex-wrap pt-1 border-t border-[#d4a55a]/15">
        <span>
          Date: <strong className="text-[#005a55]">{formatDisplayDate(order.date || order.createdAt, order.month)}</strong>
        </span>
        {order.deadline && (
          <>
            <span>·</span>
            <span>
              Deadline: <strong className="text-[#8c6218]">{toDDMMYYYY(order.deadline)}</strong>
            </span>
          </>
        )}
        {pendingAmount > 0 && (
          <>
            <span>·</span>
            <span>
              Pending: <strong className="text-rose-600">{fmt(pendingAmount)}</strong>
            </span>
          </>
        )}
      </div>

      {/* Row 3: Status Checkbox Pills on left, Edit & Delete on right */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#d4a55a]/15 flex-wrap">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#005a55]">
          <button
            type="button"
            onClick={() => onToggleStatus("advancePaid")}
            className={`px-2 py-1 rounded-lg border text-xs cursor-pointer touch-manipulation ${
              order.advancePaid
                ? "bg-[#eef8f3] border-[#00756e]/40 text-[#00756e] font-bold"
                : "border-[#d4a55a]/30 text-[#005a55]/60"
            }`}
            title="Toggle Advance Received"
          >
            Adv {order.advancePaid ? "✓" : "○"}
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus("fullPaid")}
            className={`px-2 py-1 rounded-lg border text-xs cursor-pointer touch-manipulation ${
              order.fullPaid
                ? "bg-[#eef8f3] border-[#00756e]/40 text-[#00756e] font-bold"
                : "border-[#d4a55a]/30 text-[#005a55]/60"
            }`}
            title="Toggle Full Paid"
          >
            Full {order.fullPaid ? "✓" : "○"}
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus("completed")}
            className={`px-2 py-1 rounded-lg border text-xs cursor-pointer touch-manipulation ${
              order.completed
                ? "bg-[#eef8f3] border-[#00756e]/40 text-[#00756e] font-bold"
                : "border-[#d4a55a]/30 text-[#005a55]/60"
            }`}
            title="Toggle Delivered"
          >
            Delivered {order.completed ? "✓" : "○"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-[#005a55] font-bold px-3 py-1.5 rounded-lg border border-[#005a55]/30 bg-[#fdfcf7] active:bg-[#005a55]/10 touch-manipulation cursor-pointer"
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-rose-600 font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white active:bg-rose-50 touch-manipulation cursor-pointer"
            title="Delete order"
          >
            ✕
          </button>
        </div>
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
    <div className="space-y-4">
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

      {/* Mobile-Optimized KPI Card */}
      <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center sm:text-left">
          <div className="border-r border-[#d4a55a]/20 pr-1">
            <span className="text-[9.5px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Inflow Collected
            </span>
            <span
              className="text-base sm:text-lg font-bold text-[#00756e]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(totalCollected)}
            </span>
          </div>

          <div className="sm:border-r border-[#d4a55a]/20 pr-1">
            <span className="text-[9.5px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Pending Balances
            </span>
            <span
              className={`text-base sm:text-lg font-bold ${pendingBalance > 0 ? "text-amber-700" : "text-[#00756e]"}`}
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {fmt(pendingBalance)}
            </span>
          </div>

          <div className="border-r border-[#d4a55a]/20 pr-1">
            <span className="text-[9.5px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Active Projects
            </span>
            <span
              className="text-base sm:text-lg font-bold text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {pending.length}
            </span>
          </div>

          <div>
            <span className="text-[9.5px] sm:text-[10px] font-bold text-[#8c6218] uppercase tracking-wider block">
              Delivered
            </span>
            <span
              className="text-base sm:text-lg font-bold text-[#005a55]"
              style={{ fontFamily: "'Antic Didone', serif" }}
            >
              {completed.length}
            </span>
          </div>
        </div>

        {/* Register Order Action Button */}
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl py-2.5 px-4 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation active:scale-[0.98]"
        >
          <span className="text-[#d4a55a] text-sm leading-none">+</span>
          <span>Register New Client Order</span>
        </button>
      </div>

      {/* iOS-Style 3-Segment Tab Bar */}
      <div className="grid grid-cols-3 gap-1 bg-white border border-[#d4a55a]/30 p-1 rounded-2xl shadow-2xs">
        <button
          type="button"
          onClick={() => setSubView("active")}
          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer touch-manipulation truncate ${
            subView === "active"
              ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
              : "text-[#005a55]/70 active:text-[#005a55]"
          }`}
        >
          Active ({pending.length})
        </button>
        <button
          type="button"
          onClick={() => setSubView("completed")}
          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer touch-manipulation truncate ${
            subView === "completed"
              ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
              : "text-[#005a55]/70 active:text-[#005a55]"
          }`}
        >
          Archive ({completed.length})
        </button>
        <button
          type="button"
          onClick={() => setSubView("all")}
          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer touch-manipulation truncate ${
            subView === "all"
              ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
              : "text-[#005a55]/70 active:text-[#005a55]"
          }`}
        >
          All ({orders.length})
        </button>
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
        <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-8 text-center text-xs text-[#005a55]/60 shadow-2xs">
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
