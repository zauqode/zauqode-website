/**
 * /api/admin-blob — Read and write admin JSON data to Vercel Blob.
 *
 * GET  ?key=<blob-key>   → returns JSON blob content
 * POST body: { key, data } → upserts JSON to blob, returns { url }
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { put, head } from "@vercel/blob";

const ADMIN_SECRET = process.env.ZAUQODE_ADMIN_SECRET ?? "";

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export const APIRoute = createAPIFileRoute("/api/admin-blob")({
  GET: async ({ request }) => {
    // Validate secret from header
    const secret = request.headers.get("x-admin-secret");
    if (ADMIN_SECRET && secret !== ADMIN_SECRET) return unauthorized();

    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response(JSON.stringify({ error: "key required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Try to fetch the blob by its stable pathname
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        return new Response(JSON.stringify({ works: [], orders: [], expenses: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Use @vercel/blob head to get URL, then fetch content
      const blobInfo = await head(`zauqode-admin/${key}`, { token });
      const dataRes = await fetch(blobInfo.url);
      const json = await dataRes.json();
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Blob doesn't exist yet — return empty
      return new Response(JSON.stringify({ works: [], orders: [], expenses: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  POST: async ({ request }) => {
    const secret = request.headers.get("x-admin-secret");
    if (ADMIN_SECRET && secret !== ADMIN_SECRET) return unauthorized();

    try {
      const body = await request.json() as { key: string; data: unknown };
      const { key, data } = body;

      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        return new Response(JSON.stringify({ error: "BLOB_READ_WRITE_TOKEN not set" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      const blob = await put(
        `zauqode-admin/${key}`,
        JSON.stringify(data),
        {
          access: "public",
          contentType: "application/json",
          addRandomSuffix: false,
          token,
        }
      );

      return new Response(JSON.stringify({ url: blob.url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
