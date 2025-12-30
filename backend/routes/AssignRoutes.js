// routes/assignRoute.js
import express from "express";
import Assign from "../models/AssignSchema.js";
import Transaction from "../models/TransactionSchema.js";

import Admin from "../models/AdminSchema.js";
import Manager from "../models/ManagerSchema.js";
import Employee from "../models/EmployeeSchema.js";

const router = express.Router();

    router.post("/assign-packet", async (req, res) => {
    try {
        const { from, to, PacketNo, Process } = req.body;
        console.log("Assign Packet Request:", { from, to, PacketNo, Process });

        if (!from || !to) {
             return res.status(400).json({ message: "Missing Sender (from) or Receiver (to) ID" });
        }

        // Helper to determine model based on ID
        const getRole = async (id) => {
            if (!id) return null;
            try {
                // Check if ID is a valid ObjectId before querying to prevent cast errors
                if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                     console.log(`Invalid ObjectId format: ${id}`);
                     return null;
                }

                const admin = await Admin.findById(id);
                if (admin) return 'Admin';
                const manager = await Manager.findById(id);
                if (manager) return 'Manager';
                const employee = await Employee.findById(id);
                if (employee) return 'Employee';
            } catch (e) {
                console.log("Error in getRole for id", id, e.message);
            }
            return null;
        };

        const fromModel = await getRole(from);
        const toModel = await getRole(to);
        console.log(`Role Resolution: from=${from} -> ${fromModel}, to=${to} -> ${toModel}`);

        if (!fromModel) {
            return res.status(400).json({ message: `Invalid Sender ID: ${from}. User not found in Admin, Manager, or Employee.` });
        }
        if (!toModel) {
            return res.status(400).json({ message: `Invalid Receiver ID: ${to}. User not found in Admin, Manager, or Employee.` });
        }

        const transactionData = {
            ...req.body,
            fromModel,
            toModel
        };

        const transaction = await Transaction.create(transactionData);
        const assign = await Assign.findOneAndUpdate(
            { PacketNo },
            { $push: { Transitions: transaction._id } },
            { new: true, upsert: true }
        );
        res.status(201).json({ transactionId: transaction._id, assignId: assign._id });
    } catch (err) {
        console.error("Assignment Error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/assign/:packetNo", async (req, res) => {
    const assign = await Assign.findOne({ PacketNo: req.params.packetNo }).populate({
        path: "Transitions",
            // Dynamic refPath population doesn't need explicit model if refPath is correctly set in schema
            // But we need to select fields that exist in all models. 
            // Admin: username, email
            // Manager: firstName, lastName, emailId (Need to ensure we select these)
            // Employee: firstName, lastName, emailId
        populate: [
            { path: "from", select: "username email firstName lastName emailId" },
            { path: "to", select: "username email firstName lastName emailId" },
            { path: "Process", select: "name" }
        ]
    });
    res.json(assign);
});

export default router;
