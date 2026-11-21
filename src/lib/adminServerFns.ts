/**
 * TanStack Start Server Functions for Zauqode Studio Desk.
 * Connects directly to Vercel Blob storage for real persistence in both dev & production.
 */

import { createServerFn } from "@tanstack/react-start";
import { put, head } from "@vercel/blob";
import { PORTFOLIO_WORKS } from "@/components/zauqode/portfolioData";

export interface AdminWork {
  id: string;
  name: string;
  category: string;
  label: string;
  sub?: string;
  thumbUrl: string;
  liveUrl?: string;
  videoUrl?: string;
  mobileImg?: string;
  galleryUrls?: string[];
  story?: string;
  occasion?: string;
  style?: string;
  included?: string[];
  hidden: boolean;
  addedAt: string;
}

export interface Order {
  id: string;
  clientName: string;
  projectType: string;
  amount: number;
  advance: number;
  advancePaid: boolean;
  fullPaid: boolean;
  completed: boolean;
  date?: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
  month: string;
}

export interface MonthlyExpense {
  id: string;
  month: string;
  description: string;
  amount: number;
  date?: string;
  createdAt: string;
}

export interface AdminData {
  works: AdminWork[];
  orders: Order[];
  expenses: MonthlyExpense[];
  featuredHomeIds?: string[];
  seeded?: boolean;
}

export function getDefaultAdminWorks(): AdminWork[] {
  return PORTFOLIO_WORKS.map((w) => ({
    id: w.id,
    name: w.name,
    category: w.category,
    label: w.label || (w.category === "websites" ? "WEDDING WEBSITE" : w.category.toUpperCase()),
    sub: w.sub || "",
    thumbUrl: w.thumb,
    liveUrl: w.url || "",
    videoUrl: w.videoUrl || "",
    mobileImg: w.mobileImg || "",
    story: w.story || "",
    occasion: w.occasion || "",
    style: w.style || "",
    included: w.included || [],
    hidden: false,
    addedAt: "2026-01-01T00:00:00.000Z",
  }));
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const BLOB_DATA_KEY = "zauqode-admin/zauqode-admin-data.json";

function getBlobToken(): string {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    "vercel_blob_rw_nyOpmuYbjguN5st5_51QwDPvYDxZuMziyMe1gYlgadaDPAp"
  );
}

// ─── 1. Load Admin Data ───────────────────────────────────────────────────────
export const getAdminDataFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminData> => {
    const token = getBlobToken();
    try {
      const blobInfo = await head(BLOB_DATA_KEY, { token });
      const cacheBustUrl = `${blobInfo.url}?_t=${Date.now()}`;
      const res = await fetch(cacheBustUrl, { cache: "no-store" });
      if (!res.ok) {
        return {
          works: getDefaultAdminWorks(),
          orders: [],
          expenses: [],
          featuredHomeIds: ["01", "06", "11", "12"],
          seeded: true,
        };
      }
      const data = (await res.json()) as AdminData;

      let works = data.works || [];
      let seeded = data.seeded ?? false;
      let featuredHomeIds = data.featuredHomeIds;

      // Seed earlier website catalogue if not yet seeded
      if (!seeded) {
        const defaults = getDefaultAdminWorks();
        const existingIds = new Set(works.map((w) => w.id));
        const missingDefaults = defaults.filter((d) => !existingIds.has(d.id));
        works = [...works, ...missingDefaults];
        seeded = true;
      }

      if (!featuredHomeIds || featuredHomeIds.length === 0) {
        featuredHomeIds = [
          ...works.filter((w) => !w.hidden && !["01", "06", "11", "12"].includes(w.id)).map((w) => w.id),
          "01",
          "06",
          "11",
          "12",
        ];
      }

      return {
        works,
        orders: data.orders || [],
        expenses: data.expenses || [],
        featuredHomeIds,
        seeded,
      };
    } catch {
      // First run before any data has been saved
      return {
        works: getDefaultAdminWorks(),
        orders: [],
        expenses: [],
        featuredHomeIds: ["01", "06", "11", "12"],
        seeded: true,
      };
    }
  }
);

// ─── 2. Save Admin Data ───────────────────────────────────────────────────────
export const saveAdminDataFn = createServerFn({ method: "POST" })
  .validator((d: AdminData) => d)
  .handler(async ({ data }): Promise<{ success: boolean; url?: string }> => {
    const token = getBlobToken();
    try {
      let existing: AdminData = { works: [], orders: [], expenses: [] };
      try {
        const blobInfo = await head(BLOB_DATA_KEY, { token });
        const res = await fetch(`${blobInfo.url}?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          existing = (await res.json()) as AdminData;
        }
      } catch {
        // First run
      }

      const merged: AdminData = {
        works: data.works ?? existing.works ?? [],
        orders: data.orders ?? existing.orders ?? [],
        expenses: data.expenses ?? existing.expenses ?? [],
        featuredHomeIds:
          data.featuredHomeIds !== undefined
            ? data.featuredHomeIds
            : existing.featuredHomeIds,
        seeded: data.seeded ?? existing.seeded ?? true,
      };

      const blob = await put(BLOB_DATA_KEY, JSON.stringify(merged, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });
      return { success: true, url: blob.url };
    } catch (err) {
      console.error("Failed to save admin data to Blob:", err);
      return { success: false };
    }
  });

// ─── 3. Upload Artwork Image ──────────────────────────────────────────────────
export interface UploadPayload {
  filename: string;
  contentType: string;
  base64: string;
}

export const uploadArtworkFn = createServerFn({ method: "POST" })
  .validator((d: UploadPayload) => d)
  .handler(async ({ data }): Promise<{ url: string }> => {
    try {
      const token = getBlobToken();
      const cleanName = (data.filename || "artwork.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
      const rawBase64 = data.base64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(rawBase64, "base64");

      const blob = await put(`portfolio/${Date.now()}-${cleanName}`, buffer, {
        access: "public",
        contentType: data.contentType || "image/jpeg",
        token,
      });

      return { url: blob.url };
    } catch (err: any) {
      console.error("Vercel Blob upload failed:", err);
      throw new Error(err?.message || "Failed to store image in cloud storage.");
    }
  });

