import mongoose, { Schema, Document } from "mongoose";

const ExhibitionEventSchema = new Schema(
  {
    // Running Exhibition
    running: {
      exhibitionName: {
        type: String,
        trim: true,
        default: "",
      },
      location: {
        type: String,
        trim: true,
        default: "",
      },
      description: {
        type: String,
        trim: true,
        default: "",
      },
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },

    // Next Exhibition
    next: {
      exhibitionName: {
        type: String,
        trim: true,
        default: "",
      },
      location: {
        type: String,
        trim: true,
        default: "",
      },
      description: {
        type: String,
        trim: true,
        default: "",
      },
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const ExhibitionEvent =
  mongoose.models.ExhibitionEvent ||
  mongoose.model("ExhibitionEvent", ExhibitionEventSchema);

export default ExhibitionEvent;

// TypeScript interface
export interface IExhibitionEvent extends Document {
  running: {
    exhibitionName: string;
    location: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    isActive: boolean;
  };
  next: {
    exhibitionName: string;
    location: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
