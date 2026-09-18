import mongoose, { Schema, Document } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const ContactInfoSchema = new Schema(
  {
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },
    whatsappQrCode: {
      type: ImageSchema,
      default: () => ({ url: "", publicId: "" }),
    },
    wechat: {
      type: String,
      trim: true,
      default: "",
    },
    wechatQrCode: {
      type: ImageSchema,
      default: () => ({ url: "", publicId: "" }),
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

if (mongoose.models && mongoose.models.ContactInfo) {
  delete (mongoose.models as any).ContactInfo;
}

const ContactInfo =
  mongoose.models.ContactInfo ||
  mongoose.model("ContactInfo", ContactInfoSchema);

export default ContactInfo;

// TypeScript interface
export interface IContactInfo extends Document {
  whatsapp: string;
  whatsappQrCode: {
    url: string;
    publicId: string;
  };
  wechat: string;
  wechatQrCode: {
    url: string;
    publicId: string;
  };
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone: string;
  createdAt: Date;
  updatedAt: Date;
}
