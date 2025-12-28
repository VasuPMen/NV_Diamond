import express from "express";
import ManagerSchema from "../models/ManagerSchema.js";

const router = express.Router();

router.post("/managers", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gender,
      process,
      bankName,
      ifscCode,
      accountNo,
      address,
      workingType,
      fixedSalary,
      diamondExperience,
      referenceDetails,
      department
    } = req.body;

    if (!firstName || !mobileNo || !workingType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (emailId) {
      const exists = await ManagerSchema.findOne({ emailId });
      if (exists) {
        return res.status(400).json({ message: "Manager already exists" });
      }
    }

    const newManager = new ManagerSchema({
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gender,
      process,
      bankName,
      ifscCode,
      accountNo,
      address,
      workingType,
      fixedSalary,
      diamondExperience,
      referenceDetails,
      department
    });

    const savedManager = await newManager.save();
    res.status(201).json(savedManager);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/managers", async (req, res) => {
  try {
    const managers = await ManagerSchema
      .find()
      .populate("process")
      .populate("department")
      .populate("employee");

    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/managers/:id", async (req, res) => {
  try {
    const updatedManager = await ManagerSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("process")
      .populate("department");

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json(updatedManager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/managers/:id", async (req, res) => {
  try {
    const deletedManager = await ManagerSchema.findByIdAndDelete(req.params.id);

    if (!deletedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
