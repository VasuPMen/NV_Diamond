import express from "express";
import PurchaseSchema from "../models/PurchaseSchema.js";
import PacketSchema from "../models/PacketSchema.js";
import ShapeSchema from "../models/ShapeSchema.js";
import ColorSchema from "../models/ColorSchema.js";
import PuritySchema from "../models/PuritySchema.js";
import CutSchema from "../models/CutSchema.js";
import PolishSchema from "../models/PolishSchema.js";
import SymmetrySchema from "../models/SymmetrySchema.js";
import FluorescenceSchema from "../models/FluorescenceSchema.js";
import TableSchema from "../models/TableSchema.js";

const router = express.Router();

router.get("/purchase", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await PurchaseSchema.countDocuments();
    const purchases = await PurchaseSchema.find()
      .populate('selectParty')
      .populate('stone')
      .populate({
        path: 'packets',
        populate: [
          { path: 'shape' },
          { path: 'color' },
          { path: 'purity' },
          { path: 'cut' },
          { path: 'polish' },
          { path: 'symmetry' },
          { path: 'fluorescence' },
          { path: 'table' },
          { path: 'currentOwner' }
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: purchases,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " error from GET PurchaseRoutes.js",
    });
  }
});

router.post("/purchase", async (req, res) => {
  try {
    const {
      purchaseType,
      selectParty,
      janganNo,
      stone,
      rate,
      duration,
      pieces,
      totalWeight,
      packets,
    } = req.body;

    if (
      !purchaseType ||
      !selectParty ||
      !janganNo ||
      !stone ||
      !rate ||
      !duration ||
      !totalWeight
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const purchaseExists = await PurchaseSchema.findOne({ janganNo });
    if (purchaseExists) {
      return res
        .status(400)
        .json({ message: "Purchase with this Jangan No already exists" });
    }

    const purchase = await PurchaseSchema.create({
      purchaseType,
      selectParty,
      janganNo,
      stone,
      rate,
      duration,
      Pieces: pieces || 0,
      totalWeight,
      packets: packets || [],
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from POST PurchaseRoutes.js",
    });
  }
});

router.put("/purchase/:id", async (req, res) => {
  try {
    const purchase = await PurchaseSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('selectParty')
      .populate('stone')
      .populate({
        path: 'packets',
        populate: [
          { path: 'shape' },
          { path: 'color' },
          { path: 'purity' },
          { path: 'cut' },
          { path: 'polish' },
          { path: 'symmetry' },
          { path: 'fluorescence' },
          { path: 'table' },
          { path: 'currentOwner' }
        ]
      });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      message: "Purchase updated successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from PUT PurchaseRoutes.js",
    });
  }
});

router.delete("/purchase/:id", async (req, res) => {
  try {
    const purchase = await PurchaseSchema.findByIdAndDelete(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      message: "Purchase deleted successfully",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from DELETE PurchaseRoutes.js",
    });
  }
});

// Add packets to purchase
router.post("/purchase/:id/add-packets", async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const { numberOfPackets } = req.body;

    const purchase = await PurchaseSchema.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Get pieces number from the purchase
    const pieces = purchase.Pieces || purchase.pieces || 0;
    
    if (!pieces || pieces <= 0) {
      return res.status(400).json({ 
        message: "Pieces number is not set in this purchase. Please set the pieces number first." 
      });
    }

    // Use numberOfPackets from request, or default to pieces
    const packetsToCreate = numberOfPackets && numberOfPackets >= pieces 
      ? numberOfPackets 
      : pieces;

    if (packetsToCreate < pieces) {
      return res.status(400).json({ 
        message: `Number of packets (${packetsToCreate}) should be greater than or equal to pieces (${pieces})` 
      });
    }

    // Get default master data (first available from each)
    const [defaultShape, defaultColor, defaultPurity, defaultCut, defaultPolish, 
           defaultSymmetry, defaultFluorescence, defaultTable] = await Promise.all([
      ShapeSchema.findOne(),
      ColorSchema.findOne(),
      PuritySchema.findOne(),
      CutSchema.findOne(),
      PolishSchema.findOne(),
      SymmetrySchema.findOne(),
      FluorescenceSchema.findOne(),
      TableSchema.findOne(),
    ]);

    if (!defaultShape || !defaultColor || !defaultPurity || !defaultCut || 
        !defaultPolish || !defaultSymmetry || !defaultFluorescence || !defaultTable) {
      return res.status(400).json({ 
        message: "Required master data not found. Please ensure all master data is set up." 
      });
    }

    // Generate unique packet numbers
    const existingPackets = await PacketSchema.find().sort({ packetNo: -1 }).limit(1);
    let packetCounter = 1;
    if (existingPackets.length > 0) {
      const lastPacketNo = existingPackets[0].packetNo;
      const match = lastPacketNo.match(/\d+$/);
      if (match) {
        packetCounter = parseInt(match[0]) + 1;
      }
    }

    const createdPackets = [];
    const packetIds = [];

    // Create packets
    for (let i = 0; i < packetsToCreate; i++) {
      let packetNo;
      let attempts = 0;
      let isUnique = false;
      
      // Find a unique packet number
      while (!isUnique && attempts < 100) {
        packetNo = `PKT-${String(packetCounter + i + attempts).padStart(6, '0')}`;
        const existingPacket = await PacketSchema.findOne({ packetNo });
        if (!existingPacket) {
          isUnique = true;
        } else {
          attempts++;
        }
      }
      
      if (!isUnique) {
        return res.status(500).json({ 
          message: "Failed to generate unique packet numbers" 
        });
      }

      const newPacket = new PacketSchema({
        packetNo,
        stockWeight: 0,
        polishWeight: 0,
        shape: defaultShape._id,
        color: defaultColor._id,
        purity: defaultPurity._id,
        cut: defaultCut._id,
        polish: defaultPolish._id,
        symmetry: defaultSymmetry._id,
        fluorescence: defaultFluorescence._id,
        table: defaultTable._id,
        discount: 0,
        rapoRate: purchase.rate || 0,
        rate: purchase.rate || 0,
        estValue: 0,
        purchaseRate: purchase.rate || 0,
        ownerModel: "Manager", // Default to Manager
        pieces: 1, // Each packet has 1 piece initially
        currentOwner: (req.headers['x-user-role'] === 'manager' || req.headers['x-user-role'] === 'employee') ? req.headers['x-user-id'] : undefined,
        status: "hold",
      });

      const savedPacket = await newPacket.save();
      createdPackets.push(savedPacket);
      packetIds.push(savedPacket._id);
    }

    // Add packet IDs to purchase
    purchase.packets = [...(purchase.packets || []), ...packetIds];
    // Note: Pieces field represents the target number set during purchase creation
    // It should not be incremented here
    await purchase.save();

    res.status(201).json({
      message: `Successfully created ${packetsToCreate} packet(s) and added to purchase`,
      packets: createdPackets,
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message + " | error from POST /purchase/:id/add-packets",
    });
  }
});

export default router;
