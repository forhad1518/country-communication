// app/clients/add/page.tsx

"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import slugify from "@/utils/slugify";
import uploadFiles from "@/helpers/upload.image";

interface FormData {
  companyName: string;
  clientName: string;
  clientEmail: string;
}

export default function AddClientPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    clientName: "",
    clientEmail: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError("");
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate all fields
    const { companyName, clientName, clientEmail } = formData;
    if (!companyName || !clientName || !clientEmail) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(clientEmail)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!imageFile) {
      setError("Company logo is required");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Upload image
      const uploadResult = await uploadFiles({
        type: "single",
        files: imageFile,
        slug: slugify(companyName),
        api: "/api/upload/image",
      });

      // Expecting uploadResult to contain the uploaded image URL
      // Adjust according to your upload API response structure
      const logoUrl = uploadResult?.data?.url || uploadResult?.url;
      if (!logoUrl) {
        throw new Error("Failed to upload image");
      }

      // Step 2: Create client with the uploaded logo URL
      const clientData = {
        companyName,
        companyLogo: logoUrl,
        clientName,
        clientEmail,
      };

      const response = await fetch("/api/Our-Client/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create client");
      }

      // Success
      setSuccess(true);
      setFormData({ companyName: "", clientName: "", clientEmail: "" });
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/our_clients");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-4 md:py-8 bg-white">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/admin/our_clients"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Our Clients</span>
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Add New Client
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Fill in the details to add a new client to your list.
          </p>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✅ Client added successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter company name"
                disabled={loading || success}
                required
              />
            </div>

            {/* Company Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image
                      src={imagePreview}
                      alt="Logo preview"
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="logo-upload"
                    disabled={loading || success}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer transition-colors ${
                      loading || success ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, SVG (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Client Name */}
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter client name"
                disabled={loading || success}
                required
              />
            </div>

            {/* Client Email */}
            <div>
              <label
                htmlFor="clientEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Client Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="client@example.com"
                disabled={loading || success}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Adding Client...</span>
                  </>
                ) : (
                  <span>Add Client</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
