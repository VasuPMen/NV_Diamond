import express from "express";
import PurchaseSchema from "../models/PurchaseSchema.js";

const router = express.Router();

router.get("/purchase", async (req, res) => {
  try {
    const purchases = await PurchaseSchema.find();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from GET PurchaseRoutes.js",
    });
  }
});

router.post("/purchase", async (req, res) => {
  try {
    const {
      purchaseType,
      selectParty,
      janganNo,
      stone,
      rate,
      duration,
      pieces,
      totalWeight,
      packets,
    } = req.body;

    if (
      !purchaseType ||
      !selectParty ||
      !janganNo ||
      !stone ||
      !rate ||
      !duration ||
      !totalWeight ||
      !packets
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const purchaseExists = await PurchaseSchema.findOne({ janganNo });
    if (purchaseExists) {
      return res
        .status(400)
        .json({ message: "Purchase with this Jangan No already exists" });
    }

    const purchase = await PurchaseSchema.create({
      purchaseType,
      selectParty,
      janganNo,
      stone,
      rate,
      duration,
      pieces,
      totalWeight,
      packets,
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from POST PurchaseRoutes.js",
    });
  }
});

router.put("/purchase/:id", async (req, res) => {
  try {
    const purchase = await PurchaseSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      message: "Purchase updated successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from PUT PurchaseRoutes.js",
    });
  }
});

router.delete("/purchase/:id", async (req, res) => {
  try {
    const purchase = await PurchaseSchema.findByIdAndDelete(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      message: "Purchase deleted successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from DELETE PurchaseRoutes.js",
    });
  }
});

export default router;
