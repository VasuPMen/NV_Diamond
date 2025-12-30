import express from "express";
import ManagerSchema from "../models/ManagerSchema.js";
import User from "../models/UserSchema.js";
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
      return res.status(400).json({ message: "Required fields missing" });
    }

    /* ---------- CHECK USER DUPLICATE ---------- */
    const userExists = await User.findOne({ email: emailId }).session(session);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

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
      department
    });

    const savedManager = await manager.save({ session });

    /* ---------- CREATE USER ---------- */
    const user = new User({
      username: shortName || `${firstName} ${lastName || ""}`,
      email: emailId,
      role: "manager"
    });

    await user.save({ session });

    /* ---------- COMMIT ---------- */
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Manager & User created successfully",
      manager: savedManager
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});

/* -------------------- GET ALL MANAGERS -------------------- */
router.get("/managers", async (req, res) => {
  try {
    const managers = await ManagerSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "emailId",
          foreignField: "email",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userId: "$userDetails._id",
          username: "$userDetails.username"
        }
      },
      {
        $project: {
          userDetails: 0
        }
      }
    ]);
    res.status(200).json(managers);
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
      const emailExists = await User.findOne({ email: body.emailId }).session(session);
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

    /* ---------- UPDATE USER ---------- */
    const updatedUsername =
      body.shortName ||
      `${body.firstName || existingManager.firstName} ${body.lastName || existingManager.lastName || ""}`;

    await User.findOneAndUpdate(
      { email: existingManager.emailId }, // find old email
      {
        ...(body.emailId && { email: body.emailId }),
        username: updatedUsername
      },
      { session }
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

    /* ---------- DELETE USER ---------- */
    await User.findOneAndDelete(
      { email: manager.emailId },
      { session }
    );

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