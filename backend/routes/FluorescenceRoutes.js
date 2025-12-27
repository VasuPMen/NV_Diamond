import FluorescenceSchema from '../models/FluorescenceSchema.js';
import router from './Route.js';

router.get('/fluorescence', async (req, res) => {
  try {
    const Fluorescence = await FluorescenceSchema.find();
    res.status(200).json(Fluorescence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/fluorescence', async (req, res) => {
  try {
    const FluorescenceFind = await FluorescenceSchema.findOne({ name: req.body.name });
    if (FluorescenceFind) {
      return res.status(400).json({ message: 'Fluorescence already exists' });
    }

    const Fluorescence = new FluorescenceSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Fluorescence.save();

    res.status(201).json({
      message: 'Fluorescence added successfully',
      Fluorescence
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add FluorescenceRoutes.js'
    });
  }
});

router.put('/fluorescence/:id', async (req, res) => {
  try {
    const Fluorescence = await FluorescenceSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Fluorescence) {
      return res.status(404).json({ message: 'Fluorescence not found' });
    }

    res.status(200).json({
      message: 'Fluorescence updated successfully',
      Fluorescence
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put FluorescenceRoutes.js'
    });
  }
});

router.delete('/fluorescence/:id', async (req, res) => {
  try {
    const Fluorescence = await FluorescenceSchema.findByIdAndDelete(req.params.id);

    if (!Fluorescence) {
      return res.status(404).json({ message: 'Fluorescence not found' });
    }

    res.status(200).json({
      message: 'Fluorescence deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete FluorescenceRoutes.js'
    });
  }
});

export default router;
