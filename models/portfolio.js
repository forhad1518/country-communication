import mongoose from "mongoose";
import { type } from "os";
import { title } from "process";
const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,},
    exhibition_name: {
        type: String, 
        required: true,
    },
    projectInfo: {
        clientName: {type: String, required: true,},
        boothSize: {type: String, required: true,},
        projectOverview: {type: String, required: true}
    },
    keywords: [{type: String, required: true}],
    designImage: {
        type: String,
        required: true,
    },
    LiveImage: {
        type: String,
        required: true,
    },
    gallaryImage: [{type: String, required: true}],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);