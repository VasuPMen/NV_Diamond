import express from 'express';
const router = express.Router();
import SymmetrySchema from '../models/SymmetrySchema.js';

router.get('/symmetry', async (req, res) => {
  try {
    const Symmetry = await SymmetrySchema.find();
    res.status(200).json(Symmetry);
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from get SymmetryRoutes.js'
    });
  }
});

router.post('/symmetry', async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const SymmetryFind = await SymmetrySchema.findOne({ name: req.body.name });
    if (SymmetryFind) {
      return res.status(400).json({ message: 'Symmetry already exists' });
    }

    const Symmetry = new SymmetrySchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Symmetry.save();

    res.status(201).json({
      message: 'Symmetry added successfully',
      Symmetry
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add SymmetryRoutes.js'
    });
  }
});

router.put('/symmetry/:id', async (req, res) => {
  try {
    const Symmetry = await SymmetrySchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Symmetry) {
      return res.status(404).json({ message: 'Symmetry not found' });
    }

    res.status(200).json({
      message: 'Symmetry updated successfully',
      Symmetry
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put SymmetryRoutes.js'
    });
  }
});

router.delete('/symmetry/:id', async (req, res) => {
  try {
    const Symmetry = await SymmetrySchema.findByIdAndDelete(req.params.id);

    if (!Symmetry) {
      return res.status(404).json({ message: 'Symmetry not found' });
    }

    res.status(200).json({
      message: 'Symmetry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete SymmetryRoutes.js'
    });
  }
});

export default router;
