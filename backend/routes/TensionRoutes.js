import express from 'express';
const router = express.Router();
import TensionSchema from '../models/TensionSchema.js';

router.get('/tension', async (req, res) => {
  try {
    const Tension = await TensionSchema.find();
    res.status(200).json(Tension);
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from get TensionRoutes.js'
    });
  }
});

router.post('/tension', async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const TensionFind = await TensionSchema.findOne({ name: req.body.name });
    if (TensionFind) {
      return res.status(400).json({ message: 'Tension already exists' });
    }

    const Tension = new TensionSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Tension.save();

    res.status(201).json({
      message: 'Tension added successfully',
      Tension
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add TensionRoutes.js'
    });
  }
});

router.put('/tension/:id', async (req, res) => {
  try {
    const Tension = await TensionSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Tension) {
      return res.status(404).json({ message: 'Tension not found' });
    }

    res.status(200).json({
      message: 'Tension updated successfully',
      Tension
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put TensionRoutes.js'
    });
  }
});

router.delete('/tension/:id', async (req, res) => {
  try {
    const Tension = await TensionSchema.findByIdAndDelete(req.params.id);

    if (!Tension) {
      return res.status(404).json({ message: 'Tension not found' });
    }

    res.status(200).json({
      message: 'Tension deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete TensionRoutes.js'
    });
  }
});

export default router;
