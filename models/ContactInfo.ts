import mongoose, { Schema, Document } from "mongoose";

const ContactInfoSchema = new Schema(
  {
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },
    wechat: {
      type: String,
      trim: true,
      default: "",
    },
    primaryEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    primaryPhone: {
      type: String,
      trim: true,
      default: "",
    },
    secondaryPhone: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const ContactInfo =
  mongoose.models.ContactInfo ||
  mongoose.model("ContactInfo", ContactInfoSchema);

export default ContactInfo;

// TypeScript interface
export interface IContactInfo extends Document {
  whatsapp: string;
  wechat: string;
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone: string;
  createdAt: Date;
  updatedAt: Date;
}
