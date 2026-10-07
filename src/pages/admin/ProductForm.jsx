import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiX,
  FiUploadCloud,
  FiLoader,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import {
  addProduct,
  updateProduct,
  getProductById,
  SIZE_OPTIONS,
} from "../../firebase/productService";

import { uploadProductImage } from "../../services/supabaseStorage";

const CATEGORIES = [
  "nightwear",
  "abayas",
  "kaftans",
  "coord-sets",
];

const emptySizes = SIZE_OPTIONS.reduce((acc, size) => {
  acc[size] = { stock: 0 };
  return acc;
}, {});

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    fabric: "",
    careInstructions: "",
    category: CATEGORIES[0],
    sizes: emptySizes,
  });

  const [bestSeller, setBestSeller] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // Supabase Storage Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;

    async function loadProduct() {
      const product = await getProductById(id);

      if (product) {
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          costPrice: product.costPrice || "",
          fabric: product.fabric || "",
          careInstructions: product.careInstructions || "",
          category: product.category || CATEGORIES[0],
          sizes: product.sizes || emptySizes,
        });

        setImages(product.images || []);
        setBestSeller(product.bestSeller || false);
      }

      setLoading(false);
    }

    loadProduct();
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSizeChange = (size, stock) => {
    setForm((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          stock: Number(stock) || 0,
        },
      },
    }));
  };

  const removeExistingImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  // Direct File Upload to Supabase Storage
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const fileList = Array.from(files);
      const total = fileList.length;

      for (let i = 0; i < total; i++) {
        const file = fileList[i];
        setUploadProgressText(
          total > 1
            ? `Uploading (${i + 1}/${total}): ${file.name}...`
            : `Uploading ${file.name} to Supabase...`
        );

        const publicUrl = await uploadProductImage(file);

        // Assign Supabase URL to images list
        setImages((prev) => [...prev, publicUrl]);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError(
        err.message || "Failed to upload image to Supabase Storage."
      );
    } finally {
      setUploading(false);
      setUploadProgressText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleManualAddUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl("");
  };

  // Submit to Firebase Database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      alert("Please wait until the image upload completes.");
      return;
    }

    setSaving(true);

    try {
      const finalImages = imageUrl.trim()
        ? [...images, imageUrl.trim()]
        : images;

      const payload = {
        ...form,
        price: Number(form.price),
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        images: finalImages,
        bestSeller,
      };

      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await addProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-[#8A8178]">Loading product...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-serif text-[#2E2A27] mb-8">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
        <div className="bg-white p-6 rounded-2xl border border-[#ECE8E3] space-y-5">
          <div>
            <label className="text-sm text-[#6F6A65] mb-1 block">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-[#6F6A65] mb-1 block">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
            />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className="text-sm text-[#6F6A65] mb-1 block">
                Selling Price (AED) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#6F6A65] mb-1 block">
                Cost Price (AED)
              </label>
              <input
                type="number"
                value={form.costPrice}
                onChange={(e) => handleChange("costPrice", e.target.value)}
                placeholder="For profit tracking"
                className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
              />
            </div>

            <div>
              <label className="text-sm text-[#6F6A65] mb-1 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-[#6F6A65] mb-1 block">
                Fabric
              </label>
              <input
                type="text"
                value={form.fabric}
                onChange={(e) => handleChange("fabric", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
              />
            </div>

            <div>
              <label className="text-sm text-[#6F6A65] mb-1 block">
                Care Instructions
              </label>
              <input
                type="text"
                value={form.careInstructions}
                onChange={(e) =>
                  handleChange("careInstructions", e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="bestSeller"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
              className="w-5 h-5 accent-[#465348]"
            />
            <label htmlFor="bestSeller" className="text-[#2E2A27] text-sm">
              Mark as Best Seller
            </label>
          </div>
        </div>

        {/* Size-wise Stock */}
        <div className="bg-white p-6 rounded-2xl border border-[#ECE8E3]">
          <h3 className="font-medium text-[#2E2A27] mb-5">
            Size-wise Stock
          </h3>

          <div className="grid grid-cols-4 gap-4">
            {SIZE_OPTIONS.map((size) => (
              <div key={size}>
                <label className="text-sm text-[#6F6A65] block mb-2">
                  {size}
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.sizes[size]?.stock ?? 0}
                  onChange={(e) => handleSizeChange(size, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Images (Supabase Storage Direct Upload + Previews) */}
        <div className="bg-white p-6 rounded-2xl border border-[#ECE8E3] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[#2E2A27]">
                Product Images
              </h3>
              <p className="text-xs text-[#8A8178] mt-0.5">
                Upload images directly from your device to Supabase Storage (.jpg, .png, .webp).
              </p>
            </div>
            {images.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#465348] border border-[#ECE8E3] font-medium">
                {images.length} {images.length === 1 ? "Image" : "Images"}
              </span>
            )}
          </div>

          {/* Existing Image Gallery */}
          {images.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8A8178] mb-3 font-semibold">
                Uploaded Images
              </p>
              <div className="flex flex-wrap gap-4">
                {images.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative w-28 h-28 rounded-2xl border border-[#ECE8E3] overflow-hidden group shadow-sm bg-neutral-50"
                  >
                    <img
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-red-600 transition shadow"
                      title="Remove image"
                    >
                      <FiX size={13} />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag & Drop File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
              dragActive
                ? "border-[#465348] bg-[#F7F8F7]"
                : "border-[#ECE8E3] bg-[#FAF8F5] hover:border-[#465348]"
            } ${uploading ? "cursor-not-allowed opacity-75" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/jpg"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <div className="flex flex-col items-center justify-center py-4 text-[#465348]">
                <FiLoader className="text-3xl animate-spin mb-3" />
                <p className="text-sm font-medium">
                  {uploadProgressText || "Uploading to Supabase Storage..."}
                </p>
                <p className="text-xs text-[#8A8178] mt-1">
                  Please wait, saving public image URL...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#ECE8E3] flex items-center justify-center text-[#465348] mb-3">
                  <FiUploadCloud size={24} />
                </div>
                <p className="text-sm font-medium text-[#2E2A27]">
                  <span className="text-[#465348] underline">Click to upload</span> or drag and drop images
                </p>
                <p className="text-xs text-[#8A8178] mt-1.5">
                  Supports JPG, PNG, WEBP • Automatically stored in Supabase bucket <code className="bg-white px-1.5 py-0.5 rounded text-[11px] border">product-images</code>
                </p>
              </div>
            )}
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
              <FiAlertCircle className="flex-shrink-0" size={15} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Optional: Add via Manual URL */}
          <div className="pt-2 border-t border-[#ECE8E3]">
            <label className="text-xs font-medium text-[#6F6A65] mb-2 block">
              Or add image from existing URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleManualAddUrl();
                  }
                }}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#ECE8E3] outline-none focus:border-[#465348]"
              />
              <button
                type="button"
                onClick={handleManualAddUrl}
                disabled={!imageUrl.trim()}
                className="px-5 py-2.5 text-xs font-medium rounded-xl border border-[#465348] text-[#465348] hover:bg-[#465348] hover:text-white transition disabled:opacity-40"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3.5 rounded-full bg-[#465348] text-white hover:bg-[#39443A] transition disabled:opacity-50 font-medium flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" /> Saving to Database...
              </>
            ) : uploading ? (
              <>
                <FiLoader className="animate-spin" /> Waiting for Image Upload...
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>

          <button
            type="button"
            disabled={saving || uploading}
            onClick={() => navigate("/admin/products")}
            className="px-8 py-3.5 rounded-full border border-[#2E2A27] text-[#2E2A27] hover:bg-[#2E2A27] hover:text-white transition disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}