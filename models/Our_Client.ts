// models/Client.ts

import mongoose, { Schema, Document, Model } from "mongoose";

// Client Interface for TypeScript
export interface IClient extends Document {
  companyName: string;
  companyLogo: string;
  clientName: string;
  clientEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Client Schema
const ClientSchema: Schema<IClient> = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },
    companyLogo: {
      type: String,
      required: [true, "Company logo URL is required"],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
    },
    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Create index for faster searches
ClientSchema.index({ companyName: 1, clientEmail: 1 });

// Prevent model recompilation error in development
const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;
