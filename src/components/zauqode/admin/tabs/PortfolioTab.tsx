/**
 * Portfolio Tab — Add, manage, and hide portfolio work entries.
 * Images upload to Vercel Blob via /api/admin-upload endpoint.
 */

import React, { useState, useRef } from "react";
import { type AdminWork, uid } from "../StudioDesk";

const ADMIN_SECRET = import.meta.env.VITE_ZAUQODE_ADMIN_SECRET || "";

interface Props {
  works: AdminWork[];
  onUpdate: (works: AdminWork[]) => void;
}

const CATEGORIES = [
  { value: "websites", label: "Wedding Website" },
  { value: "invitations", label: "Invitation Suite" },
  { value: "videos", label: "Video Reel" },
  { value: "stalls", label: "Stall Design" },
  { value: "business", label: "Business Website" },
];

const CATEGORY_LABELS: Record<string, string> = {
  websites: "WEDDING WEBSITE",
  invitations: "INVITATION SUITE",
  videos: "VIDEO REEL",
  stalls: "STALL DESIGN",
  business: "BUSINESS WEBSITE",
};

function WorkCard({ work, onToggleHide, onDelete }: {
  work: AdminWork;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        work.hidden
          ? "border-[#d4a55a]/10 opacity-50"
          : "border-[#d4a55a]/30"
      }`}
    >
      {work.thumbUrl ? (
        <div className="aspect-[4/3] bg-[#0d2b29] overflow-hidden">
          <img
            src={work.thumbUrl}
            alt={work.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-[#0d2b29] flex items-center justify-center text-[#f3e3c0]/20 text-xs">
          No image
        </div>
      )}
      <div className="p-3 bg-[#0d2b29]">
        <div className="text-[#d4a55a] text-[10px] tracking-widest uppercase mb-0.5">
          {work.label}
        </div>
        <div className="text-[#f3e3c0] text-sm font-semibold truncate">{work.name}</div>
        {work.liveUrl && (
          <a
            href={work.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#00756e] hover:underline truncate block mt-1"
          >
            {work.liveUrl}
          </a>
        )}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onToggleHide}
            className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
              work.hidden
                ? "border-[#d4a55a]/40 text-[#d4a55a] hover:bg-[#d4a55a]/10"
                : "border-[#f3e3c0]/20 text-[#f3e3c0]/60 hover:border-[#f3e3c0]/40"
            }`}
          >
            {work.hidden ? "Show" : "Hide"}
          </button>
          <button
            onClick={onDelete}
            className="px-3 text-xs py-1.5 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-900/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddWorkForm({ onAdd }: { onAdd: (work: AdminWork) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    category: "websites",
    liveUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "portfolio");
      const res = await fetch("/api/admin-upload", {
        method: "POST",
        headers: { "x-admin-secret": ADMIN_SECRET },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setUploadedUrl(json.url);
    } catch (err) {
      setError("Image upload failed. Check API route.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!uploadedUrl && !previewUrl) { setError("Upload an image first."); return; }

    const work: AdminWork = {
      id: uid(),
      name: form.name.trim(),
      category: form.category,
      label: CATEGORY_LABELS[form.category] || form.category.toUpperCase(),
      thumbUrl: uploadedUrl || previewUrl || "",
      liveUrl: form.liveUrl.trim() || undefined,
      hidden: false,
      addedAt: new Date().toISOString(),
    };
    onAdd(work);
    setForm({ name: "", category: "websites", liveUrl: "" });
    setPreviewUrl(null);
    setUploadedUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d2b29] border border-[#d4a55a]/30 rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-[#d4a55a] text-xs tracking-[0.25em] uppercase font-semibold">
        Add New Work
      </h3>

      {/* Image upload */}
      <div>
        <label className="block text-xs text-[#f3e3c0]/60 mb-2">Thumbnail Image *</label>
        <div
          className="relative border-2 border-dashed border-[#d4a55a]/30 rounded-xl overflow-hidden cursor-pointer hover:border-[#d4a55a]/60 transition-colors"
          style={{ aspectRatio: "4/3", maxWidth: "240px" }}
          onClick={() => fileRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#f3e3c0]/30 text-xs gap-2">
              <span className="text-2xl">+</span>
              <span>Click to upload</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-[#0a1f1e]/70 flex items-center justify-center">
              <span className="text-[#d4a55a] text-xs animate-pulse">Uploading…</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploadedUrl && (
          <p className="text-emerald-400 text-[10px] mt-1 truncate">✓ Uploaded</p>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Project / Couple Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sonali & Pallav"
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] outline-none focus:border-[#d4a55a]/60 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-[#f3e3c0]/60 mb-1.5">Live URL (optional)</label>
          <input
            type="url"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            placeholder="https://…"
            className="w-full bg-[#0a1f1e] border border-[#d4a55a]/30 rounded-lg px-3 py-2.5 text-sm text-[#f3e3c0] placeholder-[#f3e3c0]/20 outline-none focus:border-[#d4a55a]/60 transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-[#d4a55a] text-[#0a1f1e] rounded-lg py-3 text-sm font-semibold hover:bg-[#c49348] disabled:opacity-40 transition-colors"
      >
        Add to Portfolio
      </button>
    </form>
  );
}

export function PortfolioTab({ works, onUpdate }: Props) {
  const handleAdd = (work: AdminWork) => {
    onUpdate([work, ...works]);
  };

  const handleToggleHide = (id: string) => {
    onUpdate(works.map((w) => (w.id === id ? { ...w, hidden: !w.hidden } : w)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this work permanently?")) return;
    onUpdate(works.filter((w) => w.id !== id));
  };

  const visible = works.filter((w) => !w.hidden).length;

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[#f3e3c0] text-xl" style={{ fontFamily: "'Antic Didone', serif" }}>
          Portfolio Works
        </h2>
        <span className="text-xs text-[#f3e3c0]/40">
          {visible} visible · {works.length - visible} hidden
        </span>
      </div>

      <AddWorkForm onAdd={handleAdd} />

      {works.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onToggleHide={() => handleToggleHide(work.id)}
              onDelete={() => handleDelete(work.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#f3e3c0]/30 text-sm py-12">
          No works yet. Add your first one above.
        </p>
      )}
    </div>
  );
}
