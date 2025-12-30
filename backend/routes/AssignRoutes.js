// routes/assignRoute.js
import express from "express";
import Assign from "../models/AssignSchema.js";
import Transaction from "../models/TransactionSchema.js";

const router = express.Router();

router.post("/assign-packet", async (req, res) => {
    const transaction = await Transaction.create(req.body);
    const assign = await Assign.findOneAndUpdate(
        { PacketNo: req.body.PacketNo },
        { $push: { Transitions: transaction._id } },
        { new: true, upsert: true }
    );
    res.status(201).json({ transactionId: transaction._id, assignId: assign._id });
});

router.get("/assign/:packetNo", async (req, res) => {
    const assign = await Assign.findOne({ PacketNo: req.params.packetNo }).populate("Transitions");
    res.json(assign);
});

export default router;
