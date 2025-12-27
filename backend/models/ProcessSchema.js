import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    labourType: {
        type : String,
        enum: ['singleTime', 'multiTime']
    },
    transactionType: {
        type : String,
        enum: ["Normal", "HPHT", "LAB", "FinalPolish", "MakableToPolish"]
    },
    shortCode: {
        type: String
    },
})

export default mongoose.model("Process", processSchema);