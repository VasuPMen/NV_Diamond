import mongoose from "mongoose";

const tensionSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    shortName: { type: String, required: true , unique: true },
    managerName: { type: String}
})

export default mongoose.model("Tension", tensionSchema);