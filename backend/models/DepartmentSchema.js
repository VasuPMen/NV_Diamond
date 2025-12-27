import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    shortName: { type: String, required: true , unique: true },
    managerName: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Manager"
    }
})

export default mongoose.model("Department", departmentSchema);
