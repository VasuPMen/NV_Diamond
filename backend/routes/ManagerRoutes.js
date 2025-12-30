import express from "express";
import ManagerSchema from "../models/ManagerSchema.js";

import mongoose from "mongoose";

const router = express.Router();

/* -------------------- CREATE MANAGER -------------------- */
router.post("/managers", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let {
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gender,
      bankName,
      ifscCode,
      accountNo,
      address,
      fixedSalary,
      diamondExperience,
      referenceDetails,
      department
    } = req.body;

    /* ---------- TRIMMING ---------- */
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    shortName = shortName?.trim() || undefined;
    emailId = emailId?.trim().toLowerCase();
    mobileNo = mobileNo?.trim();

    if (!firstName || !mobileNo || !gender || !emailId) {
      const missingFields = [];
      if (!firstName) missingFields.push("First Name");
      if (!mobileNo) missingFields.push("Mobile No");
      if (!gender) missingFields.push("Gender");
      if (!emailId) missingFields.push("Email ID");
      return res.status(400).json({ message: `Required fields missing: ${missingFields.join(", ")}` });
    }

    /* ---------- CHECK EMAIL DUPLICATE ---------- */
    const existingManager = await ManagerSchema.findOne({ emailId }).session(session);
    if (existingManager) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Default password for new manager
    const defaultPassword = "manager";

    /* ---------- CREATE MANAGER ---------- */
    const manager = new ManagerSchema({
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gender,
      bankName,
      ifscCode,
      accountNo,
      address,
      fixedSalary,
      diamondExperience,
      referenceDetails,
      department,
      password: defaultPassword, // Will be hashed by pre-save hook
      role: 'manager'
    });

    const savedManager = await manager.save({ session });

    /* ---------- COMMIT ---------- */
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Manager created successfully",
      manager: savedManager
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create Manager Error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists.` });
    }

    res.status(400).json({ message: error.message });
  }
});

/* -------------------- GET ALL MANAGERS -------------------- */
router.get("/managers", async (req, res) => {
  try {
    const managers = await ManagerSchema.find().lean();

    // Map _id to userId for frontend compatibility
    const mappedManagers = managers.map(mgr => ({
      ...mgr,
      userId: mgr._id
    }));

    res.status(200).json(mappedManagers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- UPDATE MANAGER -------------------- */
router.put("/managers/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = req.body;

    /* ---------- TRIMMING ---------- */
    if (body.firstName) body.firstName = body.firstName.trim();
    if (body.lastName) body.lastName = body.lastName.trim();
    if (body.shortName !== undefined)
      body.shortName = body.shortName?.trim() || undefined;

    if (body.emailId !== undefined)
      body.emailId = body.emailId?.trim().toLowerCase() || undefined;

    if (body.mobileNo) body.mobileNo = body.mobileNo.trim();

    /* ---------- FETCH EXISTING MANAGER ---------- */
    const existingManager = await ManagerSchema
      .findById(req.params.id)
      .session(session);

    if (!existingManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    /* ---------- EMAIL DUPLICATE CHECK ---------- */
    if (
      body.emailId &&
      body.emailId !== existingManager.emailId
    ) {
      const emailExists = await ManagerSchema.findOne({ emailId: body.emailId }).session(session);
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    /* ---------- UPDATE MANAGER ---------- */
    const updatedManager = await ManagerSchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true, session }
    );



    /* ---------- COMMIT ---------- */
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Manager & User updated successfully",
      manager: updatedManager
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});


/* -------------------- DELETE MANAGER -------------------- */
router.delete("/managers/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /* ---------- FIND MANAGER ---------- */
    const manager = await ManagerSchema
      .findById(req.params.id)
      .session(session);

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    /* ---------- DELETE MANAGER ---------- */
    await ManagerSchema.findByIdAndDelete(
      req.params.id,
      { session }
    );

    /* ---------- COMMIT ---------- */
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Manager & User deleted successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

export default router;