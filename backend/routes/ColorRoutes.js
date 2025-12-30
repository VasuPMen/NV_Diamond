import express from 'express';
const router = express.Router();
import ColorSchema from '../models/ColorSchema.js';

router.get("/color", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ColorSchema.countDocuments();
    const color = await ColorSchema.find()
      .skip(skip)
      .limit(limit)
      .sort({ order: 1 });

    res.status(200).json({
      data: color,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/color", async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const color = new ColorSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order,
    });
    const colorFind = await ColorSchema.findOne({ name: req.body.name });
    if (colorFind) {
      return res.status(400).json({ message: "Color already exists" });
    } else {
      await color.save();
      return res.status(201).json({ message: "Color added successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message + "error from add ColorRoutes.js" });
  }
});

router.put("/color/:id", async (req, res) => {
  try {
    const color = await ColorSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({
      message: "Color updated successfully",
      color,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from put ColorRoutes.js",
    });
  }
});

router.delete("/color/:id", async (req, res) => {
  try {
    const color = await ColorSchema.findByIdAndDelete(req.params.id);

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({
      message: "Color deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from delete ColorRoutes.js",
    });
  }
});

export default router;