import mongoose from "mongoose";
import slugify from "@/utils/slugify";

const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },

    exhibition_name: { type: String, required: true },

    projectInfo: {
        clientName: { type: String, required: true },
        boothSize: { type: String, required: true },
        projectOverview: { type: String, required: true },
    },

    keywords: [{ type: String, required: true }],

    designImage: { type: String, required: true },
    liveImage: { type: String, required: true },
    galleryImage: [{ type: String, required: true }],

    slug: {
        type: String,
        required: true,
        unique: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Portfolio ||
    mongoose.model("Portfolio", portfolioSchema);