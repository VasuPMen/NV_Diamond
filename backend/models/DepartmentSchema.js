import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true , unique: true },
    shortName: { type: String, required: true , unique: true },
    managerName: { type: String}
})

export default mongoose.model("Department", departmentSchema);
