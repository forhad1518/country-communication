import mongoose from "mongoose";

const addmenuSchema = new mongoose.Schema({
    menuName: { type: String, required: true },
    menuLogo: { type: String, required: true }
});

export default mongoose.Schema.Menu || mongoose.model("Menu", addmenuSchema);