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

        if (!from || !to) {
            return res.status(400).json({ message: "Missing Sender (from) or Receiver (to) ID" });
        }

        // Helper to determine model based on ID
        const getRole = async (id) => {
            if (!id) return null;
            try {
                // Check if ID is a valid ObjectId before querying to prevent cast errors
                if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                    return null;
                }

                const admin = await Admin.findById(id);
                if (admin) return 'Admin';
                const manager = await Manager.findById(id);
                if (manager) return 'Manager';
                const employee = await Employee.findById(id);
                if (employee) return 'Employee';
            } catch (e) {
                // Silent catch
            }
            return null;
        };

        const fromModel = await getRole(from);
        const toModel = await getRole(to);

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

// Helper to get allowed IDs (Manager + Subordinates) or just User ID
const getAllowedIds = async (userId, role) => {
    if (role === 'manager') {
        const subordinates = await Employee.find({ manager: userId }).distinct('_id');
        return [userId, ...subordinates.map(id => id.toString())];
    }
    return [userId];
};

import PacketSchema from "../models/PacketSchema.js";

router.get("/assign/:packetNo", async (req, res) => {
    try {
        const { userId, role } = req.query;
        // Check Access Control
        if (role === 'manager' || role === 'employee') {
            // 1. Find the packet to check current owner
            const packet = await PacketSchema.findOne({ packetNo: req.params.packetNo });
            if (!packet) {
                // Packet doesn't exist, so no history either.
                return res.status(404).json({ message: "Packet not found" });
            }

            const allowedIds = await getAllowedIds(userId, role);
            // 2. Check if current owner is in allowed list
            // Ensure string comparison
            const ownerId = packet.currentOwner ? packet.currentOwner.toString() : null;

            if (ownerId && !allowedIds.includes(ownerId)) {
                // Access Denied
                return res.status(403).json({ message: "Access Denied: You do not have permission to view this packet's history" });
            }
        }

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
        if (!assign) return res.status(404).json({ message: "History not found" });
        res.json(assign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
