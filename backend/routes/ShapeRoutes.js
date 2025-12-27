import express from 'express';
const router = express.Router();
import ShapeSchema from '../models/ShapeSchema.js';

router.get('/shape', async (req, res) => {
  try {
    const Shape = await ShapeSchema.find();
    res.status(200).json(Shape);
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from get ShapeRoutes.js'
    });
  }
});

router.post('/shape', async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const ShapeFind = await ShapeSchema.findOne({ name: req.body.name });
    if (ShapeFind) {
      return res.status(400).json({ message: 'Shape already exists' });
    }

    const Shape = new ShapeSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order,
      advisoryShape: req.body.advisoryShape,
      shortGroup: req.body.shortGroup
    });

    await Shape.save();

    res.status(201).json({
      message: 'Shape added successfully',
      Shape
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add ShapeRoutes.js'
    });
  }
});

router.put('/shape/:id', async (req, res) => {
  try {
    const Shape = await ShapeSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }

    res.status(200).json({
      message: 'Shape updated successfully',
      Shape
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put ShapeRoutes.js'
    });
  }
});

router.delete('/shape/:id', async (req, res) => {
  try {
    const Shape = await ShapeSchema.findByIdAndDelete(req.params.id);

    if (!Shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }

    res.status(200).json({
      message: 'Shape deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete ShapeRoutes.js'
    });
  }
});

export default router;
