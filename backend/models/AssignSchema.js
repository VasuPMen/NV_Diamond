import mongoose from "mongoose";

const AssignSchema = new mongoose.Schema({
    PacketNo: {
        type: String,
        required: true,
        unique: true,
    },
    Transitions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
    }]
});

export default mongoose.model("Assign", AssignSchema);