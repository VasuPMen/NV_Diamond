import express from 'express';
const router = express.Router();
import PuritySchema from '../models/PuritySchema.js';
router.get('/purity', async (req, res) => {
  try {
    const Purity = await PuritySchema.find();
    res.status(200).json(Purity);
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from get PurityRoutes.js'
    });
  }
});

router.post('/purity', async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const PurityFind = await PuritySchema.findOne({ name: req.body.name });
    if (PurityFind) {
      return res.status(400).json({ message: 'Purity already exists' });
    }

    const Purity = new PuritySchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Purity.save();

    res.status(201).json({
      message: 'Purity added successfully',
      Purity
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add PurityRoutes.js'
    });
  }
});

router.put('/purity/:id', async (req, res) => {
  try {
    const Purity = await PuritySchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Purity) {
      return res.status(404).json({ message: 'Purity not found' });
    }

    res.status(200).json({
      message: 'Purity updated successfully',
      Purity
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put PurityRoutes.js'
    });
  }
});

router.delete('/purity/:id', async (req, res) => {
  try {
    const Purity = await PuritySchema.findByIdAndDelete(req.params.id);

    if (!Purity) {
      return res.status(404).json({ message: 'Purity not found' });
    }

    res.status(200).json({
      message: 'Purity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete PurityRoutes.js'
    });
  }
});

export default router;
