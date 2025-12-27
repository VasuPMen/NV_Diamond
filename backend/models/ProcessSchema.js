import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    labourType: {
        enum: ['singleTime', 'multiTime']
    },
    transactionType: {
        enum: ["Normal", "HPHT", "LAB", "FinalPolish", "MakableToPolish"]
    },
    shortCode: {
        type: String
    },
})

export default mongoose.model("Process", processSchema);