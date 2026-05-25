// models/OfficeInfo.ts

import mongoose, { Schema, Document } from "mongoose";

const OfficeHoursSchema = new Schema(
  {
    days: {
      type: String,
      trim: true,
      default: "",
    },
    hours: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true },
);

const OfficeInfoSchema = new Schema(
  {
    streetAddress: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },
    postalCode: {
      type: String,
      trim: true,
      default: "",
    },
    googleMapUrl: {
      type: String,
      trim: true,
      default: "",
    },
    officeHours: [OfficeHoursSchema],
  },
  {
    timestamps: true,
  },
);

const OfficeInfo =
  mongoose.models.OfficeInfo || mongoose.model("OfficeInfo", OfficeInfoSchema);

export default OfficeInfo;

// TypeScript interfaces
export interface IOfficeHours {
  _id?: string;
  days: string;
  hours: string;
}

export interface IOfficeInfo extends Document {
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  googleMapUrl: string;
  officeHours: IOfficeHours[];
  createdAt: Date;
  updatedAt: Date;
}
