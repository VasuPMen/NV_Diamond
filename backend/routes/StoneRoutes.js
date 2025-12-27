import StoneSchema from '../models/StoneSchema.js';
import router from './Route.js';

router.get('/stone', async (req, res) => {
  try {
    const Stone = await StoneSchema.find();
    res.status(200).json(Stone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/stone', async (req, res) => {
  try {
    const find = await StoneSchema.findOne({ name: req.body.name });
    if (find) return res.status(400).json({ message: 'Stone already exists' });

    const Stone = new StoneSchema(req.body);
    await Stone.save();

    res.status(201).json({ message: 'Stone added successfully', Stone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/stone/:id', async (req, res) => {
  try {
    const Stone = await StoneSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!Stone) return res.status(404).json({ message: 'Stone not found' });
    res.status(200).json({ message: 'Stone updated successfully', Stone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/stone/:id', async (req, res) => {
  try {
    const Stone = await StoneSchema.findByIdAndDelete(req.params.id);
    if (!Stone) return res.status(404).json({ message: 'Stone not found' });
    res.status(200).json({ message: 'Stone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
