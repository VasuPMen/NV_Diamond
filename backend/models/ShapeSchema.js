import mongoose from "mongoose";

const shapeSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    code: { type: String, required: true , unique: true },
    order: { type: Number, required: true , unique: true },
    advisoryShape:{
        type: String,
        required: true,
    },
    shortGroup:{
        type: String,   
        enum:["Round","Fancy"],
    }
})

export default mongoose.model("Shape", shapeSchema);