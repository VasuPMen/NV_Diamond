import CutSchema from '../models/CutSchema.js';
import router from './Route.js';

router.get("/cut", async (req, res) => {
  try {
    const Cut = await CutSchema.find();
    res.status(200).json(Cut);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/cut", async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    
    const CutFind = await CutSchema.findOne({ name: req.body.name });
    if (CutFind) {
      return res.status(400).json({ message: "Cut already exists" });
    }

    const Cut = new CutSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order,
    });

    await Cut.save();

    res.status(201).json({
      message: "Cut added successfully",
      Cut,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from add CutRoutes.js",
    });
  }
});

router.put("/cut/:id", async (req, res) => {
  try {
    const Cut = await CutSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!Cut) {
      return res.status(404).json({ message: "Cut not found" });
    }

    res.status(200).json({
      message: "Cut updated successfully",
      Cut,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from put CutRoutes.js",
    });
  }
});

router.delete("/cut/:id", async (req, res) => {
  try {
    const Cut = await CutSchema.findByIdAndDelete(req.params.id);

    if (!Cut) {
      return res.status(404).json({ message: "Cut not found" });
    }

    res.status(200).json({
      message: "Cut deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from delete CutRoutes.js",
    });
  }
});

export default router;
