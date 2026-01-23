import express from "express";
import Transaction from "../models/TransactionSchema.js";
import Manager from "../models/ManagerSchema.js";
import Employee from "../models/EmployeeSchema.js";

const router = express.Router();

router.post("/transactions", async (req, res) => {
  try {
    const existingTransaction = await Transaction.findOne({ TransactionNo: req.body.TransactionNo });
    if (existingTransaction) {
      return res.status(400).json({ message: "Transaction with this TransactionNo already exists" });
    }
    if (!Process) {
      return res.status(400).json({ message: "Process field is required" });
    }
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const { userId, role } = req.query;
    let query = null; // Default null

    if (role === 'admin') {
         query = {};
    } else if (role === 'manager' && userId) {
      // Find all employees under this manager
      const subordinates = await Employee.find({ manager: userId }).distinct('_id');
      const allowedIds = [userId, ...subordinates];

      query = {
        $or: [
          { from: { $in: allowedIds } },
          { to: { $in: allowedIds } }
        ]
      };
    } else if (role === 'employee' && userId) {
         query = {
             $or: [
                 { from: userId },
                 { to: userId }
             ]
         };
    }

    if (!query) {
        return res.status(200).json([]);
    }

    const transactions = await Transaction.find(query)
      .populate("Process")
      .populate("from")
      .populate("to")
      .populate("Shape Color Purity Cut Polish Symmetry")
      .populate("cancelBy")
      .sort({ createdAt: -1 }); // Good practice to sort by newest

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
