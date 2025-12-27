import SymmetrySchema from '../models/SymmetrySchema.js';
import router from './Route.js';

router.get('/symmetry', async (req, res) => {
  try {
    const Symmetry = await SymmetrySchema.find();
    res.status(200).json(Symmetry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/symmetry', async (req, res) => {
  try {
    const find = await SymmetrySchema.findOne({ name: req.body.name });
    if (find) return res.status(400).json({ message: 'Symmetry already exists' });

    const Symmetry = new SymmetrySchema(req.body);
    await Symmetry.save();

    res.status(201).json({ message: 'Symmetry added successfully', Symmetry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/symmetry/:id', async (req, res) => {
  try {
    const Symmetry = await SymmetrySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!Symmetry) return res.status(404).json({ message: 'Symmetry not found' });
    res.status(200).json({ message: 'Symmetry updated successfully', Symmetry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/symmetry/:id', async (req, res) => {
  try {
    const Symmetry = await SymmetrySchema.findByIdAndDelete(req.params.id);
    if (!Symmetry) return res.status(404).json({ message: 'Symmetry not found' });
    res.status(200).json({ message: 'Symmetry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
