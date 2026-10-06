import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://fpeofcyzxbtqzkykglml.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_XuJUxPUNNTJg1h_ZNvH-tg_HGpQiDOw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET_NAME = "product-images";

/**
 * Uploads an image file from the local device to the Supabase Storage bucket 'product-images'
 * and retrieves the permanent public URL.
 *
 * @param {File} file - The image file from an <input type="file" /> or drag-and-drop
 * @returns {Promise<string>} The public hosted URL of the image
 */
export async function uploadProductImage(file) {
  if (!file) throw new Error("No file provided for upload.");

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!validTypes.includes(file.type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    throw new Error("Please upload a valid image file (.jpg, .png, or .webp).");
  }

  // Construct a clean, unique filename to prevent overwrites
  const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${Date.now()}-${sanitizedOriginal}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(error.message || "Failed to upload image to Supabase Storage.");
  }

  // Retrieve public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Failed to get public URL from Supabase Storage.");
  }

  return publicUrlData.publicUrl;
}
