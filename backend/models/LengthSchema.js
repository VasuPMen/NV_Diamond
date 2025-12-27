import mongoose from "mongoose";

const lengthSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    code: { type: String, required: true , unique: true },
    order: { type: Number, required: true , unique: true },
})

const Color = mongoose.model("Length", lengthSchema);