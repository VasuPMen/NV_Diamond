import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.post("/transactions", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("Process")
      .populate("from")
      .populate("to")
      .populate("Shape Color Purity Cut Polish Symmetry")
      .populate("cancelBy");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("Process from to Shape Color Purity Cut Polish Symmetry cancelBy");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
