import express from "express";
import PacketSchema from "../models/PacketSchema.js";

const router = express.Router();

router.get("/packet", async (req, res) => {
  try {
    const packets = await PacketSchema.find()
      .populate('shape')
      .populate('color')
      .populate('purity')
      .populate('cut')
      .populate('polish')
      .populate('symmetry')
      .populate('fluorescence')
      .populate('table')
      .populate('currentOwner');
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
      polishWeight,
      cut,
      purity,
      color,
      shape,
      pieces,
      status,
      currentOwner,
    } = req.body;

    if (
      !packetNo ||
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
      !polishWeight ||
      !cut ||
      !purity ||
      !color ||
      !shape
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
      polishWeight,
      cut,
      purity,
      color,
      shape,
      pieces: pieces || 1,
      currentOwner: currentOwner || undefined,
      status: status || "hold",
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

router.get("/packet/:id", async (req, res) => {
  try {
    const packetId = req.params.id;
    const packet = await PacketSchema.findById(packetId)
      .populate('shape')
      .populate('color')
      .populate('purity')
      .populate('cut')
      .populate('polish')
      .populate('symmetry')
      .populate('fluorescence')
      .populate('table')
      .populate('currentOwner');
    if (!packet) {
      return res.status(404).json({ message: "Packet not found" });
    }
    res.status(200).json(packet);
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from GET Packet by ID PacketRoutes.js",
    });
  }
});

export default router;
