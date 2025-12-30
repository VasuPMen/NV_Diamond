import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    TransactionNo: {
        type: String,
        required: true,
        unique: true,
    },
    PacketNo: {
        type: String,
        required: true,
    },
    Process: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Process",
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    prevWeight: {
        type: Number,
    },
    newWeight: {
        type: Number,
    },
    Shape: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shape",
    },
    Color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
    },
    Purity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purity",
    },
    Cut: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cut",
    },
    Polish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Polish",
    },
    Symmetry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Symmetry",
    },
    cancelBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

export default mongoose.model("Transaction", TransactionSchema);