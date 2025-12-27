import mongoose from "mongoose";

const packetSchema = new mongoose.Schema({
  packetNo: {
    type: String,
    required: true,
  },
  stockWeight: {
    type: Number,
    required: true,
  },
  polishWeight: {
    type: Number,
    required: true,
  },
  shape: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shape",
    required: true,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
  purity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purity",
    required: true,
  },
  cut: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cut",
    required: true,
  },
  polish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Polish",
    required: true,
  },
  symmetry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symmetry",
    required: true,
  },
  fluorescence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fluorescence",
    required: true,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  rapoRate: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  estValue: {
    type: Number,
    required: true,
  },
  purchaseRate: {
    type: Number,
    required: true,
  },
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "ownerModel",
  },
  ownerModel: {
    type: String,
    enum: ["Employee", "Manager"],
    required: true,
  },
});

export default mongoose.model("Packet", packetSchema);
