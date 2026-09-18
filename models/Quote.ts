import mongoose, { Schema, Document } from "mongoose";

export interface IQuote extends Document {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  exhibitionName: string;
  stallNumber?: string;
  boothSize: string;
  boothType?: string;
  budget?: string;
  services: string[];
  eventDate?: string;
  message?: string;
  attachment?: {
    url: string;
    publicId: string;
  };
  status: "pending" | "reviewed" | "contacted" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    exhibitionName: {
      type: String,
      required: [true, "Exhibition name is required"],
      trim: true,
    },
    stallNumber: {
      type: String,
      trim: true,
      default: "",
    },
    boothSize: {
      type: String,
      required: [true, "Booth size is required"],
      trim: true,
    },
    boothType: {
      type: String,
      trim: true,
      default: "Standard / Custom",
    },
    budget: {
      type: String,
      trim: true,
      default: "",
    },
    services: {
      type: [String],
      default: [],
    },
    eventDate: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    attachment: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "contacted", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Quote) {
  delete (mongoose.models as any).Quote;
}

const Quote = mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);

export default Quote;
