import express from 'express';
const router = express.Router();
import TableSchema from '../models/TableSchema.js';

router.get('/table', async (req, res) => {
  try {
    const Table = await TableSchema.find();
    res.status(200).json(Table);
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from get TableRoutes.js'
    });
  }
});

router.post('/table', async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.order) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const TableFind = await TableSchema.findOne({ name: req.body.name });
    if (TableFind) {
      return res.status(400).json({ message: 'Table already exists' });
    }

    const Table = new TableSchema({
      name: req.body.name,
      code: req.body.code,
      order: req.body.order
    });

    await Table.save();

    res.status(201).json({
      message: 'Table added successfully',
      Table
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from add TableRoutes.js'
    });
  }
});

router.put('/table/:id', async (req, res) => {
  try {
    const Table = await TableSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!Table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({
      message: 'Table updated successfully',
      Table
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from put TableRoutes.js'
    });
  }
});

router.delete('/table/:id', async (req, res) => {
  try {
    const Table = await TableSchema.findByIdAndDelete(req.params.id);

    if (!Table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({
      message: 'Table deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + ' error from delete TableRoutes.js'
    });
  }
});

export default router;
