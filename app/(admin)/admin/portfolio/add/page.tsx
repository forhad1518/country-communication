"use client";

import Image from "next/image";
import { useState } from "react";
import slugify from "@/utils/slugify";
import axios from "axios";
export default function AddPortfolio() {
  const [preview, setPreview] = useState<{ design: string | null; live: string | null; gallery: string[] }>({
    design: null,
    live: null,
    gallery: []
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, type: "design" | "live" | "gallery") => {
    const files = e.target.files;

    if (!files) return;

    if (type === "gallery") {
      const images = Array.from(files).map(file =>
        URL.createObjectURL(file)
      );

      setPreview(prev => ({ ...prev, gallery: images }));

    } else {
      const file = files[0];

      setPreview(prev => ({
        ...prev,
        [type]: URL.createObjectURL(file)
      }));
    }
  }
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      title: formData.get("title"),
      exhibition: formData.get("exhibition"),
      clientName: formData.get("clientName"),
      boothSize: formData.get("boothSize"),
      overview: formData.get("overview"),
      keywords: formData.get("keywords"),
      designImage: formData.get("designImage"),
      liveImage: formData.get("liveImage"),
      galleryImages: formData.getAll("galleryImages"),
    };
    try{
      const slug = slugify(formData.get("title") as string);
      
      // Design image upload
      const uploadImageData = new FormData();
      const uploadDesign = formData.get("designImage") as File;
      uploadImageData.append("file", uploadDesign);
      uploadImageData.append("fileName", `${Date.now()}_${slug}_design`);
      const resDesign = await axios.post("/api/portfolio/upload", uploadImageData);
      const designImageUrl = resDesign.data.url;
      // live image upload
      const uploadLiveData = new FormData();
      const uploadLive = formData.get("liveImage") as File;
      uploadLiveData.append("file", uploadLive);
      uploadLiveData.append("fileName", `${Date.now()}_${slug}_live`);
      const resLive = await axios.post("/api/portfolio/upload", uploadLiveData);
      const liveImageUrl = resLive.data.url;
      // gallery images upload
      const uploadGalleryData = new FormData();
      const uploadGallery = formData.getAll("galleryImages") as File[];
      uploadGallery.forEach((file, index) => {
        uploadGalleryData.append("files", file);
        uploadGalleryData.append("fileNames", `${Date.now()}_${slug}_gallery_${index}`);
      });
      const resGallery = await axios.post("/api/portfolio/upload/multiple", uploadGalleryData);
      const galleryImageUrls = resGallery.data.urls;
      // Future: Upload images to server and get URLs

    }catch(err){ 
      console.error("Error submitting form:", err);
    }

    // future form submission logic
    console.log("Form submitted");
  }


  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-2xl border shadow-sm space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Add Portfolio
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill all required information about the project
        </p>
      </div>
      <form onSubmit={handleFormSubmit} action="" method="post">

        {/* BASIC INFO */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* TITLE */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter portfolio title"
                className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* EXHIBITION */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Exhibition Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="exhibition"
                placeholder="Ex: Dhaka Expo"
                className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

          </div>
        </div>

        {/* PROJECT INFO */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-2">
            Project Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-medium text-gray-600">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientName"
                placeholder="Client company name"
                className="mt-1 w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Booth Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="boothSize"
                placeholder="Ex: 36 sqm"
                className="mt-1 w-full border p-3 rounded-lg"
              />
            </div>

          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Project Overview <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="overview"
              placeholder="Describe the project..."
              className="mt-1 w-full border p-3 rounded-lg"
            />
          </div>
        </div>

        {/* KEYWORDS */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            SEO & Keywords
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Keywords
            </label>
            <input
              type="text"
              name="keywords"
              placeholder="design, booth, exhibition"
              className="mt-1 w-full border p-3 rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate keywords with comma
            </p>
          </div>
        </div>

        {/* IMAGES */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Images
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-medium text-gray-600">
                Design Image <span className="text-red-500">*</span>
              </label>
              <input type="file" onChange={(e) => handleImage(e, "design")} name="designImage" className="mt-1 w-full border p-3 rounded-lg" />
              {preview.design && (
                <Image
                  src={preview.design}
                  alt="preview"
                  width={100}
                  height={80}
                  className="rounded object-cover mt-1"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Live Image <span className="text-red-500">*</span>
              </label>
              <input type="file" onChange={(e) => handleImage(e, "live")} name="liveImage" className="mt-1 w-full border p-3 rounded-lg" />
              {preview.live && (
                <Image
                  src={preview.live}
                  alt="preview"
                  width={100}
                  height={80}
                  className="rounded object-cover mt-1"
                />
              )}
            </div>

          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Gallery Images
            </label>
            <input type="file" onChange={(e) => handleImage(e, "gallery")} name="galleryImages" multiple className="mt-1 w-full border p-3 rounded-lg" />
            <div className="flex flex-wrap">
              {
                preview.gallery.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`gallery-${index}`}
                    width={100}
                    height={80}
                    className="rounded object-cover mt-1 mr-2"
                  />
                ))
              }
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end mt-4">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition">
            Submit Portfolio
          </button>
        </div>
      </form>
    </div>
  );
}