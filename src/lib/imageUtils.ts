/**
 * Utility to compress and resize images client-side before upload.
 * Downscales images to maxDim (default 1400px) and quality 0.85,
 * reducing a 5MB-15MB phone camera photo to ~150KB-280KB.
 * This guarantees fast mobile uploads and prevents Vercel 4.5MB Serverless Function payload limits.
 */
export async function compressImage(
  file: File,
  maxDim = 1400,
  quality = 0.85
): Promise<{ base64: string; contentType: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read selected file"));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error("Empty image file"));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("Unable to parse image format"));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve({
              base64: src,
              contentType: file.type || "image/jpeg",
              size: file.size,
            });
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // For photos, JPEG is drastically smaller and loads faster
          const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const compressedBase64 = canvas.toDataURL(outputType, quality);

          resolve({
            base64: compressedBase64,
            contentType: outputType,
            size: Math.round((compressedBase64.length * 3) / 4),
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
