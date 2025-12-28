import express from "express";
import Party from "../models/PartySchema.js";

const router = express.Router();

router.post("/parties", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gstNumber,
      panCard,
      stoneType
    } = req.body;

    if (!firstName || !mobileNo) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (shortName) {
      const exists = await Party.findOne({ shortName });
      if (exists) {
        return res.status(400).json({ message: "Short name already exists" });
      }
    }

    const party = new Party({
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gstNumber,
      panCard,
      stoneType
    });

    const savedParty = await party.save();
    res.status(201).json(savedParty);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/parties", async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/parties/:id", async (req, res) => {
  try {
    const updatedParty = await Party.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedParty) {
      return res.status(404).json({ message: "Party not found" });
    }

    res.status(200).json(updatedParty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/parties/:id", async (req, res) => {
  try {
    const deletedParty = await Party.findByIdAndDelete(req.params.id);

    if (!deletedParty) {
      return res.status(404).json({ message: "Party not found" });
    }

    res.status(200).json({ message: "Party deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
