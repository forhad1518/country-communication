import mongoose from 'mongoose';

const exhibitionSchema = new mongoose.Schema({
    exhibitionName: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.models.Exhibition || mongoose.model("Exhibition", exhibitionSchema);