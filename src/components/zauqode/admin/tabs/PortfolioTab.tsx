/**
 * Portfolio Tab — Add, manage, and hide portfolio work entries.
 * Features dynamic category-adaptive fields for Invitations, Websites, Stalls & Videos.
 */

import React, { useState, useRef } from "react";
import { type AdminWork, uid } from "../StudioDesk";
import { uploadArtworkFn } from "@/lib/adminServerFns";

interface Props {
  works: AdminWork[];
  onUpdate: (works: AdminWork[]) => void;
}

const CATEGORIES = [
  { value: "websites", label: "Wedding Website" },
  { value: "invitations", label: "Invitation Suite" },
  { value: "stalls", label: "Stall Board" },
  { value: "videos", label: "Video Reel" },
  { value: "business", label: "Business Website" },
];

const CATEGORY_LABELS: Record<string, string> = {
  websites: "WEDDING WEBSITE",
  invitations: "INVITATION SUITE",
  stalls: "STALL BOARD",
  videos: "VIDEO REEL",
  business: "BUSINESS WEBSITE",
};

function WorkCard({
  work,
  onToggleHide,
  onDelete,
}: {
  work: AdminWork;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden bg-white transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
        work.hidden
          ? "border-[#d4a55a]/20 opacity-60"
          : "border-[#d4a55a]/35 hover:border-[#005a55]/40"
      }`}
    >
      <div>
        {work.thumbUrl ? (
          <div className="aspect-[4/3] bg-[#eef8f3] overflow-hidden relative">
            <img
              src={work.thumbUrl}
              alt={work.name}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            {work.hidden && (
              <span className="absolute top-2.5 right-2.5 bg-neutral-900/80 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full">
                Hidden
              </span>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-[#eef8f3] flex items-center justify-center text-[#005a55]/30 text-xs">
            No artwork uploaded
          </div>
        )}

        <div className="p-4 bg-white">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[#8c6218] text-[10px] sm:text-[10.5px] font-bold tracking-[0.18em] uppercase">
              {work.label}
            </span>
            {work.occasion && (
              <span className="text-[10px] text-[#00756e] font-semibold bg-[#eef8f3] px-2 py-0.5 rounded-full truncate max-w-[140px]">
                {work.occasion}
              </span>
            )}
          </div>

          <div
            className="text-[#005a55] text-lg font-medium leading-snug truncate"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            {work.name}
          </div>

          {work.sub && (
            <div className="text-[11px] text-[#8c6218] font-medium truncate mt-0.5">
              {work.sub}
            </div>
          )}

          {work.story && (
            <p className="text-[11.5px] text-[#0d3b38]/70 italic line-clamp-2 mt-2 leading-relaxed">
              "{work.story}"
            </p>
          )}

          {work.liveUrl && (
            <a
              href={work.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#00756e] hover:text-[#005a55] hover:underline truncate block mt-2 font-medium"
            >
              ↗ {work.liveUrl.replace(/^https?:\/\//, "")}
            </a>
          )}

          {work.videoUrl && (
            <div className="text-[11px] text-[#8c6218] truncate mt-2 font-medium">
              🎬 {work.videoUrl.replace(/^https?:\/\//, "")}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 bg-white">
        <div className="flex gap-2 pt-3 border-t border-[#d4a55a]/15">
          <button
            type="button"
            onClick={onToggleHide}
            className={`flex-1 text-xs py-1.5 px-3 rounded-lg border font-semibold transition-colors cursor-pointer ${
              work.hidden
                ? "border-[#005a55]/30 text-[#005a55] hover:bg-[#eef8f3]"
                : "border-[#d4a55a]/40 text-[#8c6218] hover:bg-[#fef9ee]"
            }`}
          >
            {work.hidden ? "Unhide" : "Hide from Site"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-3 text-xs py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors font-medium cursor-pointer"
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
    sub: "",
    occasion: "",
    story: "",
    liveUrl: "",
    videoUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isStationery = form.category === "invitations" || form.category === "stalls";
  const isVideo = form.category === "videos";
  const isWebsite = form.category === "websites" || form.category === "business";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    // Read base64
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setPreviewUrl(base64);

      setUploading(true);
      try {
        const res = await uploadArtworkFn({
          data: {
            filename: file.name,
            contentType: file.type || "image/jpeg",
            base64,
          },
        });
        setUploadedUrl(res.url);
      } catch (err) {
        console.error("Artwork upload error:", err);
        setError("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Project or couple name is required.");
      return;
    }
    if (!uploadedUrl && !previewUrl) {
      setError("Please select and upload an image preview.");
      return;
    }

    const work: AdminWork = {
      id: uid(),
      name: form.name.trim(),
      category: form.category,
      label: CATEGORY_LABELS[form.category] || form.category.toUpperCase(),
      sub: form.sub.trim() || undefined,
      occasion: form.occasion.trim() || undefined,
      story: form.story.trim() || undefined,
      liveUrl: isWebsite && form.liveUrl.trim() ? form.liveUrl.trim() : undefined,
      videoUrl: isVideo && form.videoUrl.trim() ? form.videoUrl.trim() : undefined,
      thumbUrl: uploadedUrl || previewUrl || "",
      hidden: false,
      addedAt: new Date().toISOString(),
    };

    onAdd(work);

    // Reset
    setForm({
      name: "",
      category: form.category,
      sub: "",
      occasion: "",
      story: "",
      liveUrl: "",
      videoUrl: "",
    });
    setPreviewUrl(null);
    setUploadedUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#d4a55a]/35 rounded-3xl p-6 sm:p-8 shadow-[0_6px_30px_rgba(0,90,85,0.04)] space-y-6"
    >
      <div>
        <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.25em] uppercase mb-1">
          Atelier Works Curator
        </div>
        <h3
          className="text-xl sm:text-2xl text-[#005a55]"
          style={{ fontFamily: "'Antic Didone', serif" }}
        >
          Add New Portfolio Creation
        </h3>
        <p className="text-xs text-[#0d3b38]/60 mt-1">
          Fields automatically adapt to match what appears on the website for each category.
        </p>
      </div>

      {/* Artwork upload area */}
      <div>
        <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
          Artwork / Thumbnail Preview *
        </label>
        <div
          className="relative border-2 border-dashed border-[#d4a55a]/50 hover:border-[#005a55]/70 rounded-2xl overflow-hidden cursor-pointer transition-all bg-[#F7F5EF]/60 hover:bg-[#F7F5EF]"
          style={{ aspectRatio: "4/3", maxWidth: "260px" }}
          onClick={() => fileRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#005a55]/50 text-xs gap-2 p-4 text-center">
              <span className="text-3xl text-[#d4a55a] font-light">+</span>
              <span className="font-medium text-[#005a55]">Click to upload artwork</span>
              <span className="text-[10px] text-[#0d3b38]/40">PNG, WebP or JPG up to 10MB</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
              <span className="text-[#005a55] text-xs font-semibold animate-pulse">
                Uploading to Cloud Storage…
              </span>
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
          <p className="text-[#00756e] text-xs font-semibold mt-1.5 flex items-center gap-1">
            <span>✓</span> Uploaded to Vercel Storage
          </p>
        )}
      </div>

      {/* Core Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Project / Couple Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={isStationery ? "e.g. Kaadhalum Valaiyalum" : "e.g. Sonali & Pallav"}
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Category Type *
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all cursor-pointer font-semibold"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Occasion — Relevant for ALL categories (especially Invitations & Stalls) */}
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Occasion *
          </label>
          <input
            type="text"
            value={form.occasion}
            onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            placeholder={
              form.category === "stalls"
                ? "e.g. Wedding Event Bangle Stall"
                : form.category === "invitations"
                ? "e.g. Sacred Temple Wedding"
                : "e.g. Grand Celebration & Itinerary Portal"
            }
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
          />
        </div>

        {/* Subtitle / Eyebrow */}
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Subtitle / Theme Eyebrow (Optional)
          </label>
          <input
            type="text"
            value={form.sub}
            onChange={(e) => setForm({ ...form, sub: e.target.value })}
            placeholder={
              isStationery
                ? "e.g. Bangle Stall Counter Board"
                : "e.g. Occasion Website & RSVP Concierge"
            }
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
          />
        </div>

        {/* Design Story — Required for Invitations & Stalls modal */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Design Story {isStationery && "*"}
          </label>
          <textarea
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            rows={3}
            placeholder={
              isStationery
                ? "e.g. Bespoke event stall board crafted for a traditional wedding bangle counter. Combines nostalgic Tamil lyrical charm with illustrated bangle stand artwork, temple bells, and festive borders."
                : "Describe the aesthetic inspiration, mood, and crafted details of this digital creation..."
            }
            className="w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Dynamic Category Specific: Live Website URL for Websites */}
        {isWebsite && (
          <div className="sm:col-span-2 bg-[#F7F5EF]/60 border border-[#d4a55a]/30 rounded-2xl p-4 space-y-1.5">
            <label className="block text-xs font-semibold text-[#005a55] uppercase tracking-wider">
              Live Website URL *
            </label>
            <input
              type="url"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="https://joel-weds-tanvi.vercel.app/"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
            />
            <p className="text-[11px] text-[#0d3b38]/50">
              This link is rendered inside the live mobile device frame when clicked on the website.
            </p>
          </div>
        )}

        {/* Dynamic Category Specific: Video URL for Video Reels */}
        {isVideo && (
          <div className="sm:col-span-2 bg-[#F7F5EF]/60 border border-[#d4a55a]/30 rounded-2xl p-4 space-y-1.5">
            <label className="block text-xs font-semibold text-[#005a55] uppercase tracking-wider">
              Video File / Stream URL *
            </label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://.../video.mp4"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-3 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 transition-all"
            />
            <p className="text-[11px] text-[#0d3b38]/50">
              Direct MP4, WebM, or HLS stream link that plays inside the phone mockup.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-rose-600 text-xs font-medium bg-rose-50 border border-rose-200 rounded-lg p-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl py-3.5 text-sm font-semibold tracking-wide shadow-md hover:shadow-lg disabled:opacity-40 transition-all cursor-pointer"
      >
        {uploading ? "Uploading Artwork…" : "Publish to Portfolio ✦"}
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
    if (!confirm("Permanently delete this artwork entry?")) return;
    onUpdate(works.filter((w) => w.id !== id));
  };

  const visible = works.filter((w) => !w.hidden).length;

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2 border-b border-[#d4a55a]/25 pb-4">
        <div>
          <div className="text-[10.5px] font-bold text-[#8c6218] tracking-[0.25em] uppercase mb-1">
            Curated Creations
          </div>
          <h2
            className="text-2xl sm:text-3xl text-[#005a55]"
            style={{ fontFamily: "'Antic Didone', serif" }}
          >
            Portfolio Showcase
          </h2>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[#d4a55a]/30 text-[#005a55]">
          {visible} Live on Website · {works.length - visible} Hidden
        </span>
      </div>

      <AddWorkForm onAdd={handleAdd} />

      <div>
        <div className="text-xs font-bold text-[#8c6218] tracking-widest uppercase mb-4">
          All Studio Works ({works.length})
        </div>

        {works.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
          <div className="bg-white border border-[#d4a55a]/30 rounded-3xl p-12 text-center shadow-xs">
            <span
              className="text-3xl text-[#8c6218] block mb-2"
              style={{ fontFamily: "'Sacramento', cursive" }}
            >
              Empty Canvas
            </span>
            <p className="text-sm text-[#005a55]/60 max-w-sm mx-auto">
              No bespoke works cataloged in the cloud yet. Use the form above to upload your first signature piece.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
