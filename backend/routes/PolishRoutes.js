import express from 'express';
const router = express.Router();
import PolishSchema from '../models/PolishSchema.js';
router.get('/polish', async (req, res) => {
  try {
    const Polish = await PolishSchema.find();
    res.status(200).json(Polish);
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from get PolishRoutes.js'
    });
  }
});

router.post('/polish', async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const PolishFind = await PolishSchema.findOne({ name: req.body.name });
    if (PolishFind) {
      return res.status(400).json({ message: 'Polish already exists' });
    }

    const Polish = new PolishSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Polish.save();

    res.status(201).json({
      message: 'Polish added successfully',
      Polish
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add PolishRoutes.js'
    });
  }
});

router.put('/polish/:id', async (req, res) => {
  try {
    const Polish = await PolishSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Polish) {
      return res.status(404).json({ message: 'Polish not found' });
    }

    res.status(200).json({
      message: 'Polish updated successfully',
      Polish
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put PolishRoutes.js'
    });
  }
});

router.delete('/polish/:id', async (req, res) => {
  try {
    const Polish = await PolishSchema.findByIdAndDelete(req.params.id);

    if (!Polish) {
      return res.status(404).json({ message: 'Polish not found' });
    }

    res.status(200).json({
      message: 'Polish deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete PolishRoutes.js'
    });
  }
});

export default router;
