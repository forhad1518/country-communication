import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema({
  exhibitionName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.Exhibition ||
  mongoose.model("Exhibition", exhibitionSchema);
