"use client";

import { useState } from "react";

export default function AddPortfolio() {

  const [form, setForm] = useState({
    title: "",
    exhibition_name: "",
    clientName: "",
    boothSize: "",
    projectOverview: "",
    keywords: "",
  });

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
              placeholder="Ex: Dhaka Expo"
              className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

        </div>
      </div>

      {/* PROJECT INFO */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Project Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="text-sm font-medium text-gray-600">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
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
            <input type="file" className="mt-1 w-full border p-3 rounded-lg" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Live Image <span className="text-red-500">*</span>
            </label>
            <input type="file" className="mt-1 w-full border p-3 rounded-lg" />
          </div>

        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Gallery Images
          </label>
          <input type="file" multiple className="mt-1 w-full border p-3 rounded-lg" />
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition">
          Submit Portfolio
        </button>
      </div>

    </div>
  );
}