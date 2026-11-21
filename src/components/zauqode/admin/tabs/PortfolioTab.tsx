/**
 * Portfolio Tab — Manage, edit, hide, and curate portfolio works.
 * Features:
 *  - Full CRUD: Create, Read (Grid & Compact Table), Update (Edit Modal), Delete.
 *  - Sub-views: "All Portfolio Works" vs "Home Showcase Curator" (no infinite scrolling).
 *  - Search & Category filtering.
 *  - Pre-seeded with all earlier website catalogue works.
 */

import React, { useState, useRef, useMemo } from "react";
import { type AdminWork, uid } from "../StudioDesk";
import { uploadArtworkFn, getDefaultAdminWorks } from "@/lib/adminServerFns";
import { compressImage } from "@/lib/imageUtils";

interface Props {
  works: AdminWork[];
  featuredHomeIds?: string[];
  onUpdate: (works: AdminWork[], featuredHomeIds?: string[]) => void;
  onUpdateFeatured?: (featuredHomeIds: string[]) => void;
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

// ─── Modal Dialog Wrapper ─────────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-2xl",
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

      {/* Sheet Content — Bottom Sheet on Mobile, Centered on sm+ */}
      <div
        className={`relative w-full ${maxWidth} bg-[#F7F5EF] border-t sm:border border-[#d4a55a]/45 rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,90,85,0.22)] z-10 max-h-[92dvh] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,20px)]`}
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

// ─── Add Creation Modal ───────────────────────────────────────────────────────

function AddWorkModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (work: AdminWork, featureOnHome: boolean) => void;
}) {
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
  const [featureOnHome, setFeatureOnHome] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingMulti, setUploadingMulti] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const multiFileRef = useRef<HTMLInputElement>(null);

  const isStationery = form.category === "invitations" || form.category === "stalls";
  const isVideo = form.category === "videos";
  const isWebsite = form.category === "websites" || form.category === "business";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      // 1. Instant client-side compression: resizes phone camera photos (5MB-15MB) to ~150KB-250KB
      const compressed = await compressImage(file, 1400, 0.85);
      setPreviewUrl(compressed.base64);

      // 2. Upload lightweight optimized image to Vercel Blob
      const res = await uploadArtworkFn({
        data: {
          filename: file.name,
          contentType: compressed.contentType,
          base64: compressed.base64,
        },
      });
      if (res?.url) {
        setUploadedUrl(res.url);
        setGalleryUrls((prev) => (prev.length === 0 ? [res.url] : prev));
      } else if (compressed.base64) {
        setGalleryUrls((prev) => (prev.length === 0 ? [compressed.base64] : prev));
      }
    } catch (err: any) {
      console.error("Artwork upload error:", err);
      // Keep local compressed preview so the creator is never blocked from saving their work
      setError("Cloud storage upload warning: artwork preview stored locally.");
    } finally {
      setUploading(false);
    }
  };

  const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setError("");
    setUploadingMulti(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Optimizing ${i + 1} of ${files.length}…`);
        const compressed = await compressImage(file, 1400, 0.85);
        const res = await uploadArtworkFn({
          data: {
            filename: file.name,
            contentType: compressed.contentType,
            base64: compressed.base64,
          },
        });
        if (res?.url) {
          newUrls.push(res.url);
        } else if (compressed.base64) {
          newUrls.push(compressed.base64);
        }
      }
      setGalleryUrls((prev) => {
        const combined = [...prev, ...newUrls];
        if (!uploadedUrl && !previewUrl && combined.length > 0) {
          setUploadedUrl(combined[0]);
          setPreviewUrl(combined[0]);
        }
        return combined;
      });
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      setError("Cloud storage upload warning: some images stored locally.");
    } finally {
      setUploadingMulti(false);
      setUploadProgress("");
      if (multiFileRef.current) multiFileRef.current.value = "";
    }
  };

  const handleSetCover = (url: string) => {
    setUploadedUrl(url);
    setPreviewUrl(url);
    setGalleryUrls((prev) => [url, ...prev.filter((u) => u !== url)]);
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const active = uploadedUrl || previewUrl;
      if (prev[index] === active) {
        setUploadedUrl(updated[0] || null);
        setPreviewUrl(updated[0] || null);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Project or couple name is required.");
      return;
    }
    const finalCover = uploadedUrl || previewUrl || galleryUrls[0];
    if (!finalCover) {
      setError("Please select and upload at least one artwork preview.");
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
      thumbUrl: finalCover,
      galleryUrls: galleryUrls.length > 0 ? galleryUrls : [finalCover],
      hidden: false,
      addedAt: new Date().toISOString(),
    };

    onAdd(work, featureOnHome);

    // Reset & close
    setForm({
      name: "",
      category: "websites",
      sub: "",
      occasion: "",
      story: "",
      liveUrl: "",
      videoUrl: "",
    });
    setPreviewUrl(null);
    setUploadedUrl(null);
    setGalleryUrls([]);
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Portfolio Creation"
      subtitle="Atelier Works Curator"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Artwork upload area */}
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Artwork / Thumbnail Preview *
          </label>
          <div className="flex items-center gap-4">
            <div
              className="relative border-2 border-dashed border-[#d4a55a]/50 hover:border-[#005a55]/70 rounded-2xl overflow-hidden cursor-pointer transition-all bg-white hover:bg-white/80 shrink-0 shadow-2xs"
              style={{ width: "160px", height: "100px" }}
              onClick={() => fileRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#005a55]/50 text-xs p-2 text-center">
                  <span className="text-xl text-[#d4a55a] font-light leading-none">+</span>
                  <span className="font-semibold text-[11px] text-[#005a55] mt-1">Upload Artwork</span>
                  <span className="text-[9px] text-[#0d3b38]/40">PNG, WebP, JPG</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-[#005a55] text-[10px] font-semibold animate-pulse">
                    Uploading…
                  </span>
                </div>
              )}
            </div>

            <div className="text-xs text-[#0d3b38]/70 leading-relaxed">
              <p className="font-semibold text-[#005a55]">Select image file from your device</p>
              <p className="text-[11px] text-[#0d3b38]/50 mt-0.5">
                Recommended aspect: 16:9 or 4:3 landscape artwork.
              </p>
              {uploadedUrl && (
                <p className="text-[#00756e] font-bold text-xs mt-1.5 flex items-center gap-1">
                  <span>✓</span> Uploaded to Cloud Storage
                </p>
              )}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Gallery / Suite Photos Section */}
        <div className="bg-white/80 border border-[#d4a55a]/35 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-[#005a55] uppercase tracking-wider">
                Suite Gallery / Additional Photos
              </label>
              <p className="text-[11px] text-[#0d3b38]/60 mt-0.5">
                Upload multiple cards, stationery pieces, or views. The photo marked "★ Cover" appears as the main card thumbnail.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#8c6218] bg-[#f9f4ea] border border-[#d4a55a]/40 px-2.5 py-0.5 rounded-full shrink-0">
              {galleryUrls.length} {galleryUrls.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {galleryUrls.map((url, idx) => {
              const currentCover = uploadedUrl || previewUrl || galleryUrls[0];
              const isCover = url === currentCover || (idx === 0 && !currentCover);
              return (
                <div
                  key={idx}
                  className={`relative group rounded-xl overflow-hidden border bg-white aspect-[4/3] shadow-2xs transition-all ${
                    isCover
                      ? "border-[#d4a55a] ring-2 ring-[#d4a55a]/70 shadow-sm"
                      : "border-[#d4a55a]/30 hover:border-[#005a55]/50"
                  }`}
                >
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Cover Badge */}
                  {isCover && (
                    <span className="absolute top-1.5 left-1.5 bg-[#8c6218] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                      ★ Cover
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(url)}
                        className="w-full py-1 px-1.5 bg-[#d4a55a] hover:bg-[#b8893c] text-[#021816] text-[10px] font-bold rounded cursor-pointer transition-colors"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="w-full py-1 px-1.5 bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] font-semibold rounded cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add More Photos Card */}
            <div
              onClick={() => multiFileRef.current?.click()}
              className="border-2 border-dashed border-[#d4a55a]/50 hover:border-[#005a55] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-white/60 hover:bg-white transition-all aspect-[4/3] group"
              title="Upload multiple photos"
            >
              {uploadingMulti ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="w-5 h-5 border-2 border-[#005a55] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-semibold text-[#005a55] leading-tight">
                    {uploadProgress || "Uploading…"}
                  </span>
                </div>
              ) : (
                <>
                  <span className="w-7 h-7 rounded-full bg-[#eef8f3] text-[#005a55] flex items-center justify-center font-bold text-base mb-1 group-hover:scale-110 transition-transform">
                    +
                  </span>
                  <span className="text-[11px] font-bold text-[#005a55]">Add Photos</span>
                  <span className="text-[9px] text-[#0d3b38]/50">Select 1 or more</span>
                </>
              )}
            </div>
          </div>

          <input
            ref={multiFileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleMultiFileChange}
            className="hidden"
          />
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Project / Couple Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={isStationery ? "e.g. Kaadhalum Valaiyalum" : "e.g. Sonali & Pallav"}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Category Type *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 cursor-pointer font-semibold"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Occasion
            </label>
            <input
              type="text"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              placeholder="e.g. Sacred Temple Wedding"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Subtitle / Theme Eyebrow
            </label>
            <input
              type="text"
              value={form.sub}
              onChange={(e) => setForm({ ...form, sub: e.target.value })}
              placeholder="e.g. Four-Ceremony Royal Folio Suite"
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10"
            />
          </div>

          {/* Website URL */}
          {isWebsite && (
            <div className="sm:col-span-2 bg-white/70 border border-[#d4a55a]/30 rounded-xl p-3.5">
              <label className="block text-xs font-semibold text-[#005a55] uppercase tracking-wider mb-1">
                Live Website URL *
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://client-weds.vercel.app/"
                className="w-full bg-white border border-[#d4a55a]/40 rounded-lg px-3 py-2 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55]"
              />
              <p className="text-[10.5px] text-[#0d3b38]/50 mt-1">
                Rendered live in interactive device frame on the website.
              </p>
            </div>
          )}

          {/* Video URL */}
          {isVideo && (
            <div className="sm:col-span-2 bg-white/70 border border-[#d4a55a]/30 rounded-xl p-3.5">
              <label className="block text-xs font-semibold text-[#005a55] uppercase tracking-wider mb-1">
                Video File / Stream URL *
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://.../video.mp4"
                className="w-full bg-white border border-[#d4a55a]/40 rounded-lg px-3 py-2 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55]"
              />
            </div>
          )}

          {/* Story */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Design Story & Details
            </label>
            <textarea
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              rows={2}
              placeholder="Describe the aesthetic, colors, crafted details..."
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2 text-sm text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55] resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="modal-featureOnHome"
            checked={featureOnHome}
            onChange={(e) => setFeatureOnHome(e.target.checked)}
            className="w-4 h-4 rounded border-[#d4a55a] text-[#005a55] focus:ring-[#005a55] cursor-pointer"
          />
          <label
            htmlFor="modal-featureOnHome"
            className="text-xs font-semibold text-[#005a55] cursor-pointer select-none"
          >
            Feature this creation in Home Selected Portfolio ("Meaningful stories, thoughtfully shaped")
          </label>
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
            disabled={uploading}
            className="bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-6 py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md disabled:opacity-40 transition-all cursor-pointer"
          >
            {uploading ? "Uploading Artwork…" : "Publish to Portfolio ✦"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit Creation Modal ──────────────────────────────────────────────────────

function EditWorkModal({
  work,
  open,
  isFeatured,
  onClose,
  onSave,
}: {
  work: AdminWork | null;
  open: boolean;
  isFeatured: boolean;
  onClose: () => void;
  onSave: (updated: AdminWork, featureOnHome: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    category: "websites",
    sub: "",
    occasion: "",
    story: "",
    liveUrl: "",
    videoUrl: "",
    hidden: false,
  });
  const [featureOnHome, setFeatureOnHome] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbUrl, setThumbUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingMulti, setUploadingMulti] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");

  // Sync form when work changes
  React.useEffect(() => {
    if (work) {
      setForm({
        name: work.name || "",
        category: work.category || "websites",
        sub: work.sub || "",
        occasion: work.occasion || "",
        story: work.story || "",
        liveUrl: work.liveUrl || "",
        videoUrl: work.videoUrl || "",
        hidden: !!work.hidden,
      });
      const initialGallery =
        work.galleryUrls && work.galleryUrls.length > 0
          ? work.galleryUrls
          : work.thumbUrl
          ? [work.thumbUrl]
          : [];
      setGalleryUrls(initialGallery);
      setThumbUrl(work.thumbUrl || initialGallery[0] || "");
      setFeatureOnHome(isFeatured);
      setError("");
    }
  }, [work, isFeatured]);

  if (!work) return null;

  const isStationery = form.category === "invitations" || form.category === "stalls";
  const isVideo = form.category === "videos";
  const isWebsite = form.category === "websites" || form.category === "business";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const compressed = await compressImage(file, 1400, 0.85);
      setThumbUrl(compressed.base64);

      const res = await uploadArtworkFn({
        data: {
          filename: file.name,
          contentType: compressed.contentType,
          base64: compressed.base64,
        },
      });
      if (res?.url) {
        setThumbUrl(res.url);
        setGalleryUrls((prev) => {
          if (prev.length === 0) return [res.url];
          return [res.url, ...prev.filter((u) => u !== res.url)];
        });
      }
    } catch (err: any) {
      console.error("Artwork upload error:", err);
      setError("Cloud storage upload warning: artwork preview stored locally.");
    } finally {
      setUploading(false);
    }
  };

  const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setError("");
    setUploadingMulti(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Optimizing ${i + 1} of ${files.length}…`);
        const compressed = await compressImage(file, 1400, 0.85);
        const res = await uploadArtworkFn({
          data: {
            filename: file.name,
            contentType: compressed.contentType,
            base64: compressed.base64,
          },
        });
        if (res?.url) {
          newUrls.push(res.url);
        } else if (compressed.base64) {
          newUrls.push(compressed.base64);
        }
      }
      setGalleryUrls((prev) => {
        const updated = [...prev, ...newUrls];
        if (!thumbUrl && updated.length > 0) {
          setThumbUrl(updated[0]);
        }
        return updated;
      });
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      setError("Cloud storage upload warning: some images stored locally.");
    } finally {
      setUploadingMulti(false);
      setUploadProgress("");
      if (multiFileRef.current) multiFileRef.current.value = "";
    }
  };

  const handleSetCover = (url: string) => {
    setThumbUrl(url);
    setGalleryUrls((prev) => [url, ...prev.filter((u) => u !== url)]);
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index] === thumbUrl) {
        setThumbUrl(updated[0] || "");
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Project or couple name is required.");
      return;
    }
    const finalCover = thumbUrl || galleryUrls[0];
    if (!finalCover) {
      setError("Artwork image is required.");
      return;
    }

    const updated: AdminWork = {
      ...work,
      name: form.name.trim(),
      category: form.category,
      label: CATEGORY_LABELS[form.category] || form.category.toUpperCase(),
      sub: form.sub.trim() || undefined,
      occasion: form.occasion.trim() || undefined,
      story: form.story.trim() || undefined,
      liveUrl: isWebsite && form.liveUrl.trim() ? form.liveUrl.trim() : undefined,
      videoUrl: isVideo && form.videoUrl.trim() ? form.videoUrl.trim() : undefined,
      thumbUrl: finalCover,
      galleryUrls: galleryUrls.length > 0 ? galleryUrls : [finalCover],
      hidden: form.hidden,
    };

    onSave(updated, featureOnHome);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Creation: ${work.name}`}
      subtitle="Atelier Work Editor"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Artwork replace area */}
        <div>
          <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-2">
            Artwork / Thumbnail
          </label>
          <div className="flex items-center gap-4">
            <div
              className="relative border-2 border-dashed border-[#d4a55a]/50 hover:border-[#005a55]/70 rounded-2xl overflow-hidden cursor-pointer transition-all bg-white shrink-0 shadow-2xs"
              style={{ width: "160px", height: "100px" }}
              onClick={() => fileRef.current?.click()}
              title="Click to replace artwork"
            >
              {thumbUrl ? (
                <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-[#005a55]/50">
                  No image
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9.5px] text-center py-0.5 font-medium">
                Click to change
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-[#005a55] text-[10px] font-semibold animate-pulse">
                    Uploading…
                  </span>
                </div>
              )}
            </div>

            <div className="text-xs text-[#0d3b38]/70 leading-relaxed">
              <p className="font-semibold text-[#005a55]">Change creation preview artwork</p>
              <p className="text-[11px] text-[#0d3b38]/50 mt-0.5">
                Upload a new image to replace the current thumbnail.
              </p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Gallery / Suite Photos Section */}
        <div className="bg-white/80 border border-[#d4a55a]/35 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-[#005a55] uppercase tracking-wider">
                Suite Gallery / Additional Photos
              </label>
              <p className="text-[11px] text-[#0d3b38]/60 mt-0.5">
                Upload multiple cards, stationery pieces, or views. The photo marked "★ Cover" appears as the main card thumbnail.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#8c6218] bg-[#f9f4ea] border border-[#d4a55a]/40 px-2.5 py-0.5 rounded-full shrink-0">
              {galleryUrls.length} {galleryUrls.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {galleryUrls.map((url, idx) => {
              const currentCover = thumbUrl || galleryUrls[0];
              const isCover = url === currentCover || (idx === 0 && !currentCover);
              return (
                <div
                  key={idx}
                  className={`relative group rounded-xl overflow-hidden border bg-white aspect-[4/3] shadow-2xs transition-all ${
                    isCover
                      ? "border-[#d4a55a] ring-2 ring-[#d4a55a]/70 shadow-sm"
                      : "border-[#d4a55a]/30 hover:border-[#005a55]/50"
                  }`}
                >
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Cover Badge */}
                  {isCover && (
                    <span className="absolute top-1.5 left-1.5 bg-[#8c6218] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                      ★ Cover
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(url)}
                        className="w-full py-1 px-1.5 bg-[#d4a55a] hover:bg-[#b8893c] text-[#021816] text-[10px] font-bold rounded cursor-pointer transition-colors"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="w-full py-1 px-1.5 bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] font-semibold rounded cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add More Photos Card */}
            <div
              onClick={() => multiFileRef.current?.click()}
              className="border-2 border-dashed border-[#d4a55a]/50 hover:border-[#005a55] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-white/60 hover:bg-white transition-all aspect-[4/3] group"
              title="Upload multiple photos"
            >
              {uploadingMulti ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="w-5 h-5 border-2 border-[#005a55] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-semibold text-[#005a55] leading-tight">
                    {uploadProgress || "Uploading…"}
                  </span>
                </div>
              ) : (
                <>
                  <span className="w-7 h-7 rounded-full bg-[#eef8f3] text-[#005a55] flex items-center justify-center font-bold text-base mb-1 group-hover:scale-110 transition-transform">
                    +
                  </span>
                  <span className="text-[11px] font-bold text-[#005a55]">Add Photos</span>
                  <span className="text-[9px] text-[#0d3b38]/50">Select 1 or more</span>
                </>
              )}
            </div>
          </div>

          <input
            ref={multiFileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleMultiFileChange}
            className="hidden"
          />
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Project / Couple Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Category Type *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55] cursor-pointer font-semibold"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Occasion
            </label>
            <input
              type="text"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Subtitle / Theme Eyebrow
            </label>
            <input
              type="text"
              value={form.sub}
              onChange={(e) => setForm({ ...form, sub: e.target.value })}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#005a55] outline-none focus:border-[#005a55]"
            />
          </div>

          {/* Website URL */}
          {isWebsite && (
            <div className="sm:col-span-2 bg-white/70 border border-[#d4a55a]/30 rounded-xl p-3.5">
              <label className="block text-xs font-semibold text-[#005a55] uppercase tracking-wider mb-1">
                Live Website URL
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className="w-full bg-white border border-[#d4a55a]/40 rounded-lg px-3 py-2 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
              />
            </div>
          )}

          {/* Video URL */}
          {isVideo && (
            <div className="sm:col-span-2 bg-white/70 border border-[#d4a55a]/30 rounded-xl p-3.5">
              <label className="block text-xs font-semibold text-[#005a55] uppercase tracking-wider mb-1">
                Video File / Stream URL
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                className="w-full bg-white border border-[#d4a55a]/40 rounded-lg px-3 py-2 text-sm text-[#005a55] outline-none focus:border-[#005a55]"
              />
            </div>
          )}

          {/* Story */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#005a55]/80 uppercase tracking-wider mb-1.5">
              Design Story & Details
            </label>
            <textarea
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              rows={2}
              className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-3.5 py-2 text-sm text-[#005a55] outline-none focus:border-[#005a55] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 space-y-2 border-t border-[#d4a55a]/20">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-featureOnHome"
              checked={featureOnHome}
              onChange={(e) => setFeatureOnHome(e.target.checked)}
              className="w-4 h-4 rounded border-[#d4a55a] text-[#005a55] focus:ring-[#005a55] cursor-pointer"
            />
            <label
              htmlFor="edit-featureOnHome"
              className="text-xs font-semibold text-[#005a55] cursor-pointer select-none"
            >
              Feature this creation on Home Selected Portfolio ("Meaningful stories, thoughtfully shaped")
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-hidden"
              checked={form.hidden}
              onChange={(e) => setForm({ ...form, hidden: e.target.checked })}
              className="w-4 h-4 rounded border-[#d4a55a] text-neutral-800 focus:ring-neutral-800 cursor-pointer"
            />
            <label
              htmlFor="edit-hidden"
              className="text-xs font-semibold text-[#0d3b38]/80 cursor-pointer select-none"
            >
              Hide this creation from public website (Draft mode)
            </label>
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
            disabled={uploading}
            className="bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-6 py-2.5 text-xs font-bold tracking-wide shadow-sm hover:shadow-md disabled:opacity-40 transition-all cursor-pointer"
          >
            {uploading ? "Uploading…" : "Save Changes ✦"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Compact Work Card ────────────────────────────────────────────────────────

function CompactWorkCard({
  work,
  isFeatured,
  onEdit,
  onToggleFeatured,
  onToggleHide,
  onDelete,
}: {
  work: AdminWork;
  isFeatured: boolean;
  onEdit: () => void;
  onToggleFeatured: () => void;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden bg-white transition-all shadow-2xs hover:shadow-md flex flex-col justify-between ${
        work.hidden
          ? "border-[#d4a55a]/20 opacity-60"
          : "border-[#d4a55a]/35 hover:border-[#005a55]/40"
      }`}
    >
      <div>
        {/* Compact 16:9 Thumbnail preview */}
        <div className="aspect-[16/10] bg-[#eef8f3] overflow-hidden relative group">
          {work.thumbUrl ? (
            <img
              src={work.thumbUrl}
              alt={work.name}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#005a55]/30 text-xs">
              No artwork
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 pointer-events-none">
            <span className="bg-[#005a55]/90 backdrop-blur-xs text-[#F7F5EF] text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-2xs">
              {work.label}
            </span>

            <div className="flex items-center gap-1">
              {work.galleryUrls && work.galleryUrls.length > 1 && (
                <span className="bg-[#021816]/85 backdrop-blur-xs text-[#ecd08b] border border-[#d4a55a]/40 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  {work.galleryUrls.length} Photos
                </span>
              )}
              {isFeatured && (
                <span className="bg-[#8c6218] text-[#F7F5EF] text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  ★ On Home
                </span>
              )}
              {work.hidden && (
                <span className="bg-neutral-900/80 text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full">
                  Hidden
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 bg-white">
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <div
              className="text-[#005a55] text-base font-medium truncate flex-1"
              style={{ fontFamily: "'Antic Didone', serif" }}
              title={work.name}
            >
              {work.name}
            </div>
            {work.occasion && (
              <span className="text-[9.5px] text-[#00756e] font-semibold bg-[#eef8f3] px-2 py-0.5 rounded-full truncate max-w-[110px]">
                {work.occasion}
              </span>
            )}
          </div>

          {work.sub && (
            <div className="text-[11px] text-[#8c6218] font-medium truncate">
              {work.sub}
            </div>
          )}

          {work.liveUrl && (
            <a
              href={work.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10.5px] text-[#00756e] hover:text-[#005a55] hover:underline truncate block mt-1.5 font-medium"
            >
              ↗ {work.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="p-3 pt-0 bg-white border-t border-[#d4a55a]/15 mt-1">
        <div className="grid grid-cols-4 gap-1.5 pt-2">
          <button
            type="button"
            onClick={onEdit}
            className="text-[11px] py-1 px-1.5 rounded-lg border border-[#005a55]/30 text-[#005a55] hover:bg-[#eef8f3] font-semibold transition-colors cursor-pointer text-center"
            title="Edit all fields & artwork"
          >
            ✏️ Edit
          </button>

          <button
            type="button"
            onClick={onToggleHide}
            className={`text-[11px] py-1 px-1.5 rounded-lg border font-semibold transition-colors cursor-pointer text-center ${
              work.hidden
                ? "border-[#005a55]/30 text-[#005a55] bg-[#eef8f3]"
                : "border-[#d4a55a]/40 text-[#8c6218] hover:bg-[#fef9ee]"
            }`}
            title={work.hidden ? "Make visible on website" : "Hide from website"}
          >
            {work.hidden ? "Show" : "Hide"}
          </button>

          <button
            type="button"
            onClick={onToggleFeatured}
            className={`text-[11px] py-1 px-1.5 rounded-lg border font-semibold transition-colors cursor-pointer text-center ${
              isFeatured
                ? "bg-[#8c6218] border-[#8c6218] text-white"
                : "border-[#d4a55a]/40 text-[#8c6218] hover:bg-[#fef9ee]"
            }`}
            title={isFeatured ? "Remove from Home Reel" : "Feature in Home Reel"}
          >
            {isFeatured ? "★ Home" : "☆ Reel"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="text-[11px] py-1 px-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-center"
            title="Permanently delete creation"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Table View Row ───────────────────────────────────────────────────

function CompactWorkTableRow({
  work,
  isFeatured,
  onEdit,
  onToggleFeatured,
  onToggleHide,
  onDelete,
}: {
  work: AdminWork;
  isFeatured: boolean;
  onEdit: () => void;
  onToggleFeatured: () => void;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <tr
      className={`border-b border-[#d4a55a]/15 hover:bg-[#fdfcf7] transition-colors ${
        work.hidden ? "opacity-60 bg-neutral-50/50" : ""
      }`}
    >
      {/* Thumbnail */}
      <td className="py-2.5 px-3">
        <div className="w-12 h-9 rounded-lg overflow-hidden bg-[#eef8f3] shrink-0 border border-[#d4a55a]/30">
          {work.thumbUrl ? (
            <img src={work.thumbUrl} alt={work.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] text-[#005a55]/30">
              —
            </div>
          )}
        </div>
      </td>

      {/* Name & Subtitle */}
      <td className="py-2.5 px-3 min-w-[160px]">
        <div
          className="text-sm font-semibold text-[#005a55] truncate"
          style={{ fontFamily: "'Antic Didone', serif" }}
        >
          {work.name}
        </div>
        {work.sub && (
          <div className="text-[10.5px] text-[#8c6218] truncate">{work.sub}</div>
        )}
      </td>

      {/* Category */}
      <td className="py-2.5 px-3">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#005a55] bg-[#eef8f3] border border-[#cdeee3] px-2 py-0.5 rounded-full inline-block">
          {work.label}
        </span>
      </td>

      {/* Occasion */}
      <td className="py-2.5 px-3 text-xs text-[#0d3b38]/70 truncate max-w-[140px]">
        {work.occasion || "—"}
      </td>

      {/* Link */}
      <td className="py-2.5 px-3 max-w-[160px] truncate text-xs">
        {work.liveUrl ? (
          <a
            href={work.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00756e] hover:underline font-medium truncate block text-[11px]"
          >
            ↗ {work.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        ) : work.videoUrl ? (
          <span className="text-[#8c6218] text-[11px]">🎬 Video</span>
        ) : (
          <span className="text-[#0d3b38]/30">—</span>
        )}
      </td>

      {/* Home Reel Status */}
      <td className="py-2.5 px-3 text-center">
        <button
          type="button"
          onClick={onToggleFeatured}
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
            isFeatured
              ? "bg-[#8c6218] text-white border-[#8c6218]"
              : "bg-white text-[#8c6218] border-[#d4a55a]/40 hover:border-[#8c6218]"
          }`}
          title={isFeatured ? "Featured on Home Reel" : "Add to Home Reel"}
        >
          {isFeatured ? "★ Featured" : "+ Feature"}
        </button>
      </td>

      {/* Visibility Status */}
      <td className="py-2.5 px-3 text-center">
        <button
          type="button"
          onClick={onToggleHide}
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
            work.hidden
              ? "bg-neutral-800 text-white border-neutral-800"
              : "bg-[#eef8f3] text-[#00756e] border-[#cdeee3]"
          }`}
        >
          {work.hidden ? "Hidden" : "Live"}
        </button>
      </td>

      {/* Actions */}
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-[#005a55] hover:text-[#00756e] font-semibold px-2 py-1 rounded border border-[#005a55]/20 hover:border-[#005a55]/50 bg-white cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded border border-rose-200 hover:bg-rose-50 bg-white cursor-pointer"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Portfolio Tab ───────────────────────────────────────────────────────

export function PortfolioTab({ works, featuredHomeIds, onUpdate, onUpdateFeatured }: Props) {
  // Sub-view: "catalogue" vs "curator"
  const [subView, setSubView] = useState<"catalogue" | "curator">("catalogue");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<AdminWork | null>(null);

  // Active Featured IDs
  const activeFeaturedIds = useMemo(() => {
    if (featuredHomeIds && featuredHomeIds.length > 0) {
      return featuredHomeIds;
    }
    return [
      ...works.filter((w) => !w.hidden && !["01", "06", "11", "12"].includes(w.id)).map((w) => w.id),
      "01",
      "06",
      "11",
      "12",
    ];
  }, [featuredHomeIds, works]);

  // Featured items in ordered list
  const featuredItems = useMemo(() => {
    return activeFeaturedIds
      .map((id) => works.find((item) => item.id === id))
      .filter((item): item is AdminWork => Boolean(item));
  }, [activeFeaturedIds, works]);

  // Filtered catalogue works
  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      if (catFilter !== "all" && w.category !== catFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = w.name.toLowerCase().includes(q);
        const matchSub = (w.sub || "").toLowerCase().includes(q);
        const matchOccasion = (w.occasion || "").toLowerCase().includes(q);
        const matchLabel = (w.label || "").toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchOccasion && !matchLabel) return false;
      }
      return true;
    });
  }, [works, catFilter, search]);

  const toggleFeature = (id: string) => {
    if (!onUpdateFeatured) return;
    if (activeFeaturedIds.includes(id)) {
      onUpdateFeatured(activeFeaturedIds.filter((x) => x !== id));
    } else {
      onUpdateFeatured([...activeFeaturedIds, id]);
    }
  };

  const moveFeatured = (index: number, direction: -1 | 1) => {
    if (!onUpdateFeatured) return;
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= activeFeaturedIds.length) return;
    const next = [...activeFeaturedIds];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    onUpdateFeatured(next);
  };

  const handleAdd = (work: AdminWork, featureOnHome = true) => {
    const updatedWorks = [work, ...works];
    const updatedFeatured = featureOnHome
      ? [work.id, ...activeFeaturedIds.filter((id) => id !== work.id)]
      : activeFeaturedIds;
    onUpdate(updatedWorks, updatedFeatured);
  };

  const handleSaveEdit = (updated: AdminWork, featureOnHome: boolean) => {
    const updatedWorks = works.map((w) => (w.id === updated.id ? updated : w));
    const isNowFeatured = activeFeaturedIds.includes(updated.id);
    let updatedFeatured = activeFeaturedIds;
    if (featureOnHome && !isNowFeatured) {
      updatedFeatured = [updated.id, ...activeFeaturedIds];
    } else if (!featureOnHome && isNowFeatured) {
      updatedFeatured = activeFeaturedIds.filter((x) => x !== updated.id);
    }
    onUpdate(updatedWorks, updatedFeatured);
  };

  const handleToggleHide = (id: string) => {
    onUpdate(works.map((w) => (w.id === id ? { ...w, hidden: !w.hidden } : w)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Permanently delete this creation from your studio portfolio?")) return;
    const updatedWorks = works.filter((w) => w.id !== id);
    const updatedFeatured = activeFeaturedIds.filter((x) => x !== id);
    onUpdate(updatedWorks, updatedFeatured);
  };

  // Restore/Sync defaults utility
  const handleRestoreDefaults = () => {
    if (
      !confirm(
        "Import any missing built-in website works (Sonali & Pallav, Bala & Shahin, etc.) back into your desk?"
      )
    )
      return;
    const defaults = getDefaultAdminWorks();
    const existingIds = new Set(works.map((w) => w.id));
    const missing = defaults.filter((d) => !existingIds.has(d.id));
    if (missing.length === 0) {
      alert("All default website works are already present in your desk.");
      return;
    }
    onUpdate([...works, ...missing]);
    alert(`Successfully imported ${missing.length} creations into your Studio Desk!`);
  };

  const visibleCount = works.filter((w) => !w.hidden).length;

  return (
    <div className="space-y-6">
      {/* Modals */}
      <AddWorkModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <EditWorkModal
        work={editingWork}
        open={!!editingWork}
        isFeatured={editingWork ? activeFeaturedIds.includes(editingWork.id) : false}
        onClose={() => setEditingWork(null)}
        onSave={handleSaveEdit}
      />

      {/* Top Studio Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#d4a55a]/30 rounded-2xl p-2.5 sm:p-4 shadow-2xs">
        {/* Sub-view Segmented Toggle */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-xl border border-[#d4a55a]/25 shrink-0">
          <button
            type="button"
            onClick={() => setSubView("catalogue")}
            className={`px-3 py-2 sm:py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center truncate touch-manipulation ${
              subView === "catalogue"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "text-[#005a55]/70 active:text-[#005a55]"
            }`}
          >
            📁 Works ({works.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView("curator")}
            className={`px-3 py-2 sm:py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center truncate touch-manipulation ${
              subView === "curator"
                ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                : "text-[#005a55]/70 active:text-[#005a55]"
            }`}
          >
            ★ Home Reel ({activeFeaturedIds.length})
          </button>
        </div>

        {/* Action Button & Utilities */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex-1 sm:flex-none text-[11px] font-semibold text-[#8c6218] border border-[#d4a55a]/40 rounded-xl px-3 py-2 bg-[#fdfcf7] transition-all cursor-pointer shadow-2xs text-center touch-manipulation active:bg-[#F7F5EF]"
            title="Import or restore default website creations"
          >
            ↺ Sync Defaults
          </button>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="flex-1 sm:flex-none bg-[#005a55] hover:bg-[#00756e] text-[#F7F5EF] rounded-xl px-4 py-2 text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation active:scale-[0.98]"
          >
            <span className="text-[#d4a55a] text-sm leading-none">+</span>
            <span>Add Creation</span>
          </button>
        </div>
      </div>

      {/* ─── SUB-VIEW 1: CATALOGUE WORKS ───────────────────────────────────── */}
      {subView === "catalogue" && (
        <div className="space-y-4">
          {/* Filter & Density Ribbon */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#d4a55a]/25 rounded-2xl p-3 text-xs shadow-2xs">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, occasion, style..."
                className="w-full bg-[#fdfcf7] border border-[#d4a55a]/35 rounded-xl px-3.5 py-1.5 text-xs text-[#005a55] placeholder-[#005a55]/30 outline-none focus:border-[#005a55]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#005a55]/40 hover:text-[#005a55] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills / Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="bg-[#fdfcf7] border border-[#d4a55a]/35 rounded-xl px-3 py-1.5 text-xs text-[#005a55] font-semibold outline-none focus:border-[#005a55] cursor-pointer"
              >
                <option value="all">All Categories ({works.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} ({works.filter((w) => w.category === c.value).length})
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#fdfcf7] border border-[#d4a55a]/35 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                      : "text-[#005a55]/60 hover:text-[#005a55]"
                  }`}
                  title="Grid View"
                >
                  ▦ Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-[#005a55] text-[#F7F5EF] shadow-2xs"
                      : "text-[#005a55]/60 hover:text-[#005a55]"
                  }`}
                  title="Table View"
                >
                  ☰ Table
                </button>
              </div>

              {/* Quick Counter */}
              <span className="text-[11px] font-bold text-[#8c6218] bg-[#fdfcf7] px-2.5 py-1 rounded-full border border-[#d4a55a]/25">
                {visibleCount} Live · {works.length - visibleCount} Hidden
              </span>
            </div>
          </div>

          {/* Works Collection */}
          {filteredWorks.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredWorks.map((work) => (
                  <CompactWorkCard
                    key={work.id}
                    work={work}
                    isFeatured={activeFeaturedIds.includes(work.id)}
                    onEdit={() => setEditingWork(work)}
                    onToggleFeatured={() => toggleFeature(work.id)}
                    onToggleHide={() => handleToggleHide(work.id)}
                    onDelete={() => handleDelete(work.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#d4a55a]/30 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#fdfcf7] border-b border-[#d4a55a]/25 text-[#8c6218] uppercase text-[10px] font-bold tracking-wider">
                        <th className="py-3 px-3">Artwork</th>
                        <th className="py-3 px-3">Creation Name</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Occasion</th>
                        <th className="py-3 px-3">Live Link</th>
                        <th className="py-3 px-3 text-center">Home Reel</th>
                        <th className="py-3 px-3 text-center">Visibility</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorks.map((work) => (
                        <CompactWorkTableRow
                          key={work.id}
                          work={work}
                          isFeatured={activeFeaturedIds.includes(work.id)}
                          onEdit={() => setEditingWork(work)}
                          onToggleFeatured={() => toggleFeature(work.id)}
                          onToggleHide={() => handleToggleHide(work.id)}
                          onDelete={() => handleDelete(work.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white border border-[#d4a55a]/30 rounded-2xl p-12 text-center text-xs text-[#005a55]/60 shadow-2xs">
              No creations matching your filter.
            </div>
          )}
        </div>
      )}

      {/* ─── SUB-VIEW 2: HOME REEL CURATOR ─────────────────────────────────── */}
      {subView === "curator" && (
        <div className="bg-white border border-[#d4a55a]/40 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap border-b border-[#d4a55a]/25 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#8c6218] tracking-[0.25em] uppercase">
                  Home Page Selected Portfolio
                </span>
                <span className="text-[9.5px] uppercase tracking-wider font-bold bg-[#eef8f3] text-[#00756e] px-2 py-0.5 rounded-full border border-[#cdeee3]">
                  Horizontal Scroll Reel
                </span>
              </div>
              <h3
                className="text-xl sm:text-2xl text-[#005a55] mt-1"
                style={{ fontFamily: "'Antic Didone', serif" }}
              >
                "Meaningful stories, thoughtfully shaped" Reel Curator
              </h3>
              <p className="text-xs text-[#0d3b38]/70 mt-1 max-w-2xl leading-relaxed">
                Reorder the exact sequence of items shown in the horizontal swipe carousel on your home page.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#fdfcf7] border border-[#d4a55a]/40 text-[#005a55]">
              {featuredItems.length} Featured in Reel
            </span>
          </div>

          {/* Reel Sequence */}
          <div>
            <div className="text-[11px] font-bold text-[#8c6218] tracking-widest uppercase mb-3 flex items-center justify-between">
              <span>Live Sequence on Homepage:</span>
              <span className="text-[10px] text-[#0d3b38]/50 normal-case font-medium">Use ← → to reorder</span>
            </div>

            {featuredItems.length > 0 ? (
              <div className="flex overflow-x-auto gap-4 pb-3 no-scrollbar">
                {featuredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="w-[200px] shrink-0 bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-[#eef8f3] overflow-hidden relative">
                        {item.thumbUrl ? (
                          <img
                            src={item.thumbUrl}
                            alt={item.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#005a55]/30">
                            No image
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-[#005a55] text-[#F7F5EF] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="p-3">
                        <div className="text-[9.5px] font-bold text-[#8c6218] uppercase tracking-wider truncate">
                          {item.label}
                        </div>
                        <div
                          className="text-sm font-semibold text-[#005a55] truncate"
                          style={{ fontFamily: "'Antic Didone', serif" }}
                        >
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 pt-0 flex items-center justify-between gap-1.5 border-t border-[#d4a55a]/20 mt-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveFeatured(idx, -1)}
                        className="px-2 py-1 text-xs border border-[#d4a55a]/40 rounded bg-white text-[#005a55] hover:bg-[#eef8f3] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move earlier in reel"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFeature(item.id)}
                        className="flex-1 text-[10.5px] font-semibold text-rose-600 hover:text-rose-800 py-1 transition-colors cursor-pointer text-center"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        disabled={idx === featuredItems.length - 1}
                        onClick={() => moveFeatured(idx, 1)}
                        className="px-2 py-1 text-xs border border-[#d4a55a]/40 rounded bg-white text-[#005a55] hover:bg-[#eef8f3] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Move later in reel"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#005a55]/60 bg-[#fdfcf7] rounded-2xl border border-[#d4a55a]/20">
                No creations featured on home reel yet. You can feature any creation directly from the Portfolio Works catalogue using the ★ Home button.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
