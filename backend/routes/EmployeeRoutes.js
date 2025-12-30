import express from "express";
import EmployeeSchema from "../models/EmployeeSchema.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

/* -------------------- CREATE EMPLOYEE -------------------- */
router.post("/employees", async (req, res) => {
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
      manager,
      process,
      bankName,
      ifscCode,
      accountNo,
      address,
      workingType,
      perJemDetails,
      fixedSalary,
      diamondExperience,
      referenceDetails,
    } = req.body;

    /* ---------- TRIMMING ---------- */
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    shortName = shortName?.trim() || undefined;
    emailId = emailId?.trim().toLowerCase();
    mobileNo = mobileNo?.trim();

    if (!firstName || !mobileNo || !manager || !workingType || !emailId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    /* ---------- USER DUPLICATE CHECK ---------- */
    const userExists = await User.findOne({ email: emailId }).session(session);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    /* ---------- WORKING TYPE VALIDATION ---------- */
    if (workingType === "perJem" && (!perJemDetails?.processes?.length || !perJemDetails?.perProcess)) {
      return res.status(400).json({ message: "PerJem details required" });
    }

    if (workingType === "FixedSalary" && !fixedSalary?.salary) {
      return res.status(400).json({ message: "Fixed salary required" });
    }

    /* ---------- CREATE EMPLOYEE ---------- */
    const employee = new EmployeeSchema({
      firstName,
      lastName,
      shortName,
      emailId,
      mobileNo,
      gender,
      manager,
      process,
      bankName,
      ifscCode,
      accountNo,
      address,
      workingType,
      ...(workingType === "perJem" && { perJemDetails }),
      ...(workingType === "FixedSalary" && { fixedSalary }),
      diamondExperience,
      referenceDetails,
    });

    const savedEmployee = await employee.save({ session });

    /* ---------- CREATE USER ---------- */
    await new User({
      username: shortName || `${firstName} ${lastName || ""}`,
      email: emailId,
      role: "employee",
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Employee & User created successfully",
      employee: savedEmployee,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});


/* -------------------- GET ALL EMPLOYEES -------------------- */
router.get("/employees", async (req, res) => {
  try {
    const employees = await EmployeeSchema.find()
      .populate("manager")
      .populate("process")
      .lean();

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- UPDATE EMPLOYEE -------------------- */
router.put("/employees/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = req.body;

    if (body.firstName) body.firstName = body.firstName.trim();
    if (body.lastName) body.lastName = body.lastName.trim();
    if (body.shortName !== undefined) body.shortName = body.shortName?.trim() || undefined;
    if (body.emailId !== undefined) body.emailId = body.emailId?.trim().toLowerCase() || undefined;

    /* ---------- FIND EMPLOYEE ---------- */
    const existingEmployee = await EmployeeSchema
      .findById(req.params.id)
      .session(session);

    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    /* ---------- EMAIL DUPLICATE CHECK ---------- */
    if (body.emailId && body.emailId !== existingEmployee.emailId) {
      const emailExists = await User.findOne({ email: body.emailId }).session(session);
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    /* ---------- WORKING TYPE CLEANUP ---------- */
    if (body.workingType === "perJem") body.fixedSalary = undefined;
    if (body.workingType === "FixedSalary") body.perJemDetails = undefined;

    /* ---------- UPDATE EMPLOYEE ---------- */
    const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true, session }
    );

    /* ---------- UPDATE USER ---------- */
    const username =
      body.shortName ||
      `${body.firstName || existingEmployee.firstName} ${body.lastName || existingEmployee.lastName || ""}`;

    await User.findOneAndUpdate(
      { email: existingEmployee.emailId },
      {
        ...(body.emailId && { email: body.emailId }),
        username,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Employee & User updated successfully",
      employee: updatedEmployee,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});


/* -------------------- DELETE EMPLOYEE -------------------- */
router.delete("/employees/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const employee = await EmployeeSchema
      .findById(req.params.id)
      .session(session);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await User.findOneAndDelete(
      { email: employee.emailId },
      { session }
    );

    await EmployeeSchema.findByIdAndDelete(
      req.params.id,
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Employee & User deleted successfully",
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

export default router;
