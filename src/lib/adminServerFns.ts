/**
 * TanStack Start Server Functions for Zauqode Studio Desk.
 * Connects directly to Vercel Blob storage for real persistence in both dev & production.
 */

import { createServerFn } from "@tanstack/react-start";
import { put, head } from "@vercel/blob";

export interface AdminWork {
  id: string;
  name: string;
  category: string;
  label: string;
  thumbUrl: string;
  liveUrl?: string;
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
  createdAt: string;
}

export interface AdminData {
  works: AdminWork[];
  orders: Order[];
  expenses: MonthlyExpense[];
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
      const res = await fetch(blobInfo.url, { cache: "no-store" });
      if (!res.ok) {
        return { works: [], orders: [], expenses: [] };
      }
      const data = (await res.json()) as AdminData;
      return {
        works: data.works || [],
        orders: data.orders || [],
        expenses: data.expenses || [],
      };
    } catch {
      // First run before any data has been saved
      return { works: [], orders: [], expenses: [] };
    }
  }
);

// ─── 2. Save Admin Data ───────────────────────────────────────────────────────
export const saveAdminDataFn = createServerFn({ method: "POST" })
  .validator((d: AdminData) => d)
  .handler(async ({ data }): Promise<{ success: boolean; url?: string }> => {
    const token = getBlobToken();
    try {
      const blob = await put(BLOB_DATA_KEY, JSON.stringify(data, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
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
    const token = getBlobToken();
    const cleanName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const rawBase64 = data.base64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(rawBase64, "base64");

    const blob = await put(`portfolio/${Date.now()}-${cleanName}`, buffer, {
      access: "public",
      contentType: data.contentType || "image/jpeg",
      token,
    });

    return { url: blob.url };
  });

