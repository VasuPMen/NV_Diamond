import mongoose from "mongoose";

const tensionSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    code: { type: String, required: true , unique: true },
    order: { type: Number, required: true , unique: true },
})

export default mongoose.model("Tension", tensionSchema);