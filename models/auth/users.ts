import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email:{type: String, required: true, unique: true, trim: true, lowercase: true},
    role: {type: String, required: true, enum: ["admin", "editor"]},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    lastLogin: {type: Date, default: Date.now},
}, {timestamps: true});

export default mongoose.models.User || mongoose.model("User", usersSchema);