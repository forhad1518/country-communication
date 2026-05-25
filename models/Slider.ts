// models/Slider.ts

import mongoose, { Schema, Document } from "mongoose";

const SliderSchema = new Schema(
  {
    image: {
      url: { type: String, required: [true, "Image URL is required"] },
      publicId: { type: String, default: "" },
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index for ordering
SliderSchema.index({ order: 1 });
SliderSchema.index({ isActive: 1 });

const Slider = mongoose.models.Slider || mongoose.model("Slider", SliderSchema);

export default Slider;

// TypeScript interface
export interface ISlider extends Document {
  image: {
    url: string;
    publicId: string;
  };
  comment: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
