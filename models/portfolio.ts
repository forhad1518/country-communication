// models/Portfolio.ts

import mongoose, { Schema, Document } from "mongoose";

const ImageSchema = new Schema({
  url: { type: String },
  publicId: { type: String, default: "" },
});

// Portfolio Schema
const PortfolioSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    exhibition_name: {
      type: String,
      required: [true, "Exhibition name is required"],
      trim: true,
    },

    // PROJECT INFO
    projectInfo: {
      clientName: {
        type: String,
        required: [true, "Client name is required"],
        trim: true,
      },
      boothSize: {
        type: String,
        required: [true, "Booth size is required"],
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      buildTime: {
        type: String,
        trim: true,
      },
      overview: {
        type: String,
        trim: true,
      },
    },

    // BRIEF
    objective: {
      type: String,
      trim: true,
    },
    challenges: {
      type: String,
      trim: true,
    },

    // DESIGN PROCESS
    process: {
      rendersImages: [{ url: String, publicId: String }],
      realImages: [{ url: String, publicId: String }],
      moodboardImages: [{ url: String, publicId: String }],
      processText: {
        type: String,
        trim: true,
      },
    },

    // MATERIAL & TECH
    materials: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],

    // EXECUTION
    execution: {
      type: String,
      trim: true,
    },

    // RESULTS & TESTIMONIALS
    results: {
      visitors: { type: String, trim: true },
      engagement: { type: String, trim: true },
      testimonial: { type: String, trim: true },
      clientName: { type: String, trim: true },
      clientImage: { url: String, publicId: String },
    },

    // SEO
    keywords: [{ type: String, trim: true }],

    // STATUS
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // ===== VIEWS & LIKES =====
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },

    // SLUG (provided from frontend)
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Indexes for better query performance
PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ status: 1 });
PortfolioSchema.index({ exhibition_name: 1 });
PortfolioSchema.index({ "projectInfo.clientName": 1 });
PortfolioSchema.index({ createdAt: -1 });
PortfolioSchema.index({ views: -1 });
PortfolioSchema.index({ likes: -1 });

// Export the model
const Portfolio =
  mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;

// Type for TypeScript
export interface IImage {
  url: string;
  publicId?: string;
}
export interface IPortfolio extends Document {
  title: string;
  exhibition_name: string;
  projectInfo: {
    clientName: string;
    boothSize: string;
    location?: string;
    buildTime?: string;
    overview?: string;
  };
  objective?: string;
  challenges?: string;
  process: {
    rendersImages: [IImage];
    realImages: [IImage];
    moodboardImages: [IImage];
    processText?: string;
  };
  materials: string[];
  technologies: string[];
  execution?: string;
  results: {
    visitors?: string;
    engagement?: string;
    testimonial?: string;
    clientName?: string;
    clientImage?: IImage;
  };
  keywords: string[];
  status: "draft" | "published";
  views: number;
  likes: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
