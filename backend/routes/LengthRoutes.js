import express from 'express';
const router = express.Router();
import LengthSchema from '../models/LengthSchema.js';
router.get('/length', async (req, res) => {
  try {
    const Length = await LengthSchema.find();
    res.status(200).json(Length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/length', async (req, res) => {
  try {
    const LengthFind = await LengthSchema.findOne({ name: req.body.name });
    if (LengthFind) {
      return res.status(400).json({ message: 'Length already exists' });
    }

    const Length = new LengthSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Length.save();

    res.status(201).json({
      message: 'Length added successfully',
      Length
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add LengthRoutes.js'
    });
  }
});

router.put('/length/:id', async (req, res) => {
  try {
    const Length = await LengthSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Length) {
      return res.status(404).json({ message: 'Length not found' });
    }

    res.status(200).json({
      message: 'Length updated successfully',
      Length
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put LengthRoutes.js'
    });
  }
});

router.delete('/length/:id', async (req, res) => {
  try {
    const Length = await LengthSchema.findByIdAndDelete(req.params.id);

    if (!Length) {
      return res.status(404).json({ message: 'Length not found' });
    }

    res.status(200).json({
      message: 'Length deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete LengthRoutes.js'
    });
  }
});

export default router;
