import mongoose from "mongoose";

const addmenuSchema = new mongoose.Schema({
    menuName: { type: String, required: true , unique: true},
    menuLogo: { type: String, required: true }
});

export default mongoose.models.Menu || mongoose.model("Menu", addmenuSchema);