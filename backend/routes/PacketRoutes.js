import express from "express";
import PacketSchema from "../models/PacketSchema.js";

const router = express.Router();

router.get("/packet", async (req, res) => {
  try {
    const packets = await PacketSchema.find();
    res.status(200).json(packets);
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from GET PacketRoutes.js",
    });
  }
});

router.post("/packet", async (req, res) => {
  try {
    const {
      packetNo,
      stones,
      purchaseRate,
      estValue,
      rate,
      rapoRate,
      discount,
      table,
      fluorescence,
      symmetry,
      polish,
      stockWeight,
      cut,
      purity,
      color,
      pieces,
    } = req.body;

    if (
      !packetNo ||
      !stones ||
      !purchaseRate ||
      !estValue ||
      !rate ||
      !rapoRate ||
      !discount ||
      !table ||
      !fluorescence ||
      !symmetry ||
      !polish ||
      !stockWeight ||
      !cut ||
      !purity ||
      !color ||
      !pieces
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const packetExists = await PacketSchema.findOne({ packetNo });
    if (packetExists) {
      return res
        .status(400)
        .json({ message: "Packet with this Packet No already exists" });
    }

    const newPacket = new PacketSchema({
      packetNo,
      stones,
      purchaseRate,
      estValue,
      rate,
      rapoRate,
      discount,
      table,
      fluorescence,
      symmetry,
      polish,
      stockWeight,
      cut,
      purity,
      color,
      pieces,
    });

    const savedPacket = await newPacket.save();
    res.status(201).json(savedPacket);
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from POST PacketRoutes.js",
    });
  }
});

router.put("/packet/:id", async (req, res) => {
  try {
    const updatedPacket = await PacketSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPacket) {
      return res.status(404).json({ message: "Packet not found" });
    }

    res.status(200).json({
      message: "Packet updated successfully",
      packet: updatedPacket,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from PUT PacketRoutes.js",
    });
  }
});

router.delete("/packet/:id", async (req, res) => {
  try {
    const packetId = req.params.id;
    const deletedPacket = await PacketSchema.findByIdAndDelete(packetId);
    if (!deletedPacket) {
      return res.status(404).json({ message: "Packet not found" });
    }
    res.status(200).json({ message: "Packet deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from DELETE PacketRoutes.js",
    });
  }
});

export default router;
