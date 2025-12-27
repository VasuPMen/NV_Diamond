import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    purchaseType: {
        type: String,
        enum: ["roughPurchase", "rejectionPurchase"],
        required: true,
    },
    selectParty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Party",
        required: true,
    },
    janganNo: {
        type: String,
        required: true,
    },
    stone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stone",
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    packets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Packet",
        required: true,
    }],
    totalWeight: {
        type: Number,
        required: true,
    },

});

export default mongoose.model("Purchase", purchaseSchema);