/**
 * /api/admin-upload — Upload portfolio images to Vercel Blob.
 *
 * POST multipart/form-data: file, folder
 * Returns { url } of the uploaded image.
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { put } from "@vercel/blob";

const ADMIN_SECRET = process.env.ZAUQODE_ADMIN_SECRET ?? "";

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export const APIRoute = createAPIFileRoute("/api/admin-upload")({
  POST: async ({ request }) => {
    const secret = request.headers.get("x-admin-secret");
    if (ADMIN_SECRET && secret !== ADMIN_SECRET) return unauthorized();

    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        return new Response(JSON.stringify({ error: "BLOB_READ_WRITE_TOKEN not set" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "portfolio";

      if (!file || typeof file === "string") {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Sanitize filename
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const blob = await put(safeName, file, {
        access: "public",
        contentType: file.type || "image/jpeg",
        addRandomSuffix: false,
        token,
      });

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
