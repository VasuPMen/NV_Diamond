import PuritySchema from '../models/PuritySchema.js';
import router from './Route.js';

router.get('/purity', async (req, res) => {
  try {
    const Purity = await PuritySchema.find();
    res.status(200).json(Purity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/purity', async (req, res) => {
  try {
    const find = await PuritySchema.findOne({ name: req.body.name });
    if (find) {
      return res.status(400).json({ message: 'Purity already exists' });
    }

    const purity = new PuritySchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await purity.save();

    res.status(201).json({
      message: 'Purity added successfully',
      purity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/purity/:id', async (req, res) => {
  try {
    const Purity = await PuritySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!Purity) return res.status(404).json({ message: 'Purity not found' });
    res.status(200).json({ message: 'Purity updated successfully', Purity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/purity/:id', async (req, res) => {
  try {
    const Purity = await PuritySchema.findByIdAndDelete(req.params.id);
    if (!Purity) return res.status(404).json({ message: 'Purity not found' });
    res.status(200).json({ message: 'Purity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
