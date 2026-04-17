import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    exhibition_name: { type: String, required: true },

    // PROJECT INFO
    projectInfo: {
        clientName: { type: String, required: true },
        boothSize: { type: String, required: true },
        location: { type: String },
        buildTime: { type: String },
        overview: { type: String },  // Changed from projectOverview to match form
    },

    // BRIEF
    objective: { type: String },
    challenges: { type: String },

    // DESIGN PROCESS
    process: {
        renders: [{ type: String }],
        realImages: [{ type: String }],
        moodboard: [{ type: String }],
        processText: { type: String },
    },

    // MATERIAL & TECH
    materials: [{ type: String }],
    technologies: [{ type: String }],

    // EXECUTION
    execution: { type: String },

    // RESULTS
    results: {
        visitors: { type: String },  // Changed from Number to String to match form input
        engagement: { type: String },
        testimonial: { type: String },
        clientName: { type: String },
        clientImage: { type: String },
    },

    // SEO
    keywords: [{ type: String, required: true }],

    // IMAGES
    designImage: { type: String, required: true },
    liveImage: { type: String, required: true },
    gallery: [{ type: String }],  // Changed from galleryImage to gallery to match form

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