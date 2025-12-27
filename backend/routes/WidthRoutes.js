import WidthSchema from '../models/WidthSchema.js';
import router from './Route.js';

router.get('/width', async (req, res) => {
  try {
    const Width = await WidthSchema.find();
    res.status(200).json(Width);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/width', async (req, res) => {
  try {
    const WidthFind = await WidthSchema.findOne({ name: req.body.name });
    if (WidthFind) {
      return res.status(400).json({ message: 'Width already exists' });
    }

    const Width = new WidthSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Width.save();

    res.status(201).json({
      message: 'Width added successfully',
      Width
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add WidthRoutes.js'
    });
  }
});

router.put('/width/:id', async (req, res) => {
  try {
    const Width = await WidthSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Width) {
      return res.status(404).json({ message: 'Width not found' });
    }

    res.status(200).json({
      message: 'Width updated successfully',
      Width
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put WidthRoutes.js'
    });
  }
});

router.delete('/width/:id', async (req, res) => {
  try {
    const Width = await WidthSchema.findByIdAndDelete(req.params.id);

    if (!Width) {
      return res.status(404).json({ message: 'Width not found' });
    }

    res.status(200).json({
      message: 'Width deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete WidthRoutes.js'
    });
  }
});

export default router;
