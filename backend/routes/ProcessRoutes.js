import express from "express";
import Process from "../models/ProcessSchema.js";

const router = express.Router();

router.get("/process", async (req, res) => {
    try {
        const processes = await Process.find();
        res.status(200).json(processes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/process", async (req, res) => {
    try {
        const process = new Process(req.body);
        await process.save();
        res.status(201).json(process);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
