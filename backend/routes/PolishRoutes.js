import PolishSchema from '../models/PolishSchema.js';
import router from './Route.js';

router.get('/polish', async (req, res) => {
  try {
    const Polish = await PolishSchema.find();
    res.status(200).json(Polish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/polish', async (req, res) => {
  try {
    const find = await PolishSchema.findOne({ name: req.body.name });
    if (find) return res.status(400).json({ message: 'Polish already exists' });

    const Polish = new PolishSchema(req.body);
    await Polish.save();

    res.status(201).json({ message: 'Polish added successfully', Polish });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/polish/:id', async (req, res) => {
  try {
    const Polish = await PolishSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!Polish) return res.status(404).json({ message: 'Polish not found' });
    res.status(200).json({ message: 'Polish updated successfully', Polish });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/polish/:id', async (req, res) => {
  try {
    const Polish = await PolishSchema.findByIdAndDelete(req.params.id);
    if (!Polish) return res.status(404).json({ message: 'Polish not found' });
    res.status(200).json({ message: 'Polish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
