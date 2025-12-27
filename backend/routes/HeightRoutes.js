import express from 'express';
const router = express.Router();
import HeightSchema from '../models/HeightSchema.js';

router.get('/height', async (req, res) => {
  try {
    const Height = await HeightSchema.find();
    res.status(200).json(Height);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/height', async (req, res) => {
  try {
    const HeightFind = await HeightSchema.findOne({ name: req.body.name });
    if (HeightFind) {
      return res.status(400).json({ message: 'Height already exists' });
    }

    const Height = new HeightSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Height.save();

    res.status(201).json({
      message: 'Height added successfully',
      Height
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add HeightRoutes.js'
    });
  }
});

router.put('/height/:id', async (req, res) => {
  try {
    const Height = await HeightSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Height) {
      return res.status(404).json({ message: 'Height not found' });
    }

    res.status(200).json({
      message: 'Height updated successfully',
      Height
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put HeightRoutes.js'
    });
  }
});

router.delete('/height/:id', async (req, res) => {
  try {
    const Height = await HeightSchema.findByIdAndDelete(req.params.id);

    if (!Height) {
      return res.status(404).json({ message: 'Height not found' });
    }

    res.status(200).json({
      message: 'Height deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete HeightRoutes.js'
    });
  }
});

export default router;
