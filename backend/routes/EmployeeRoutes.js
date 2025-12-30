import express from "express";
import EmployeeSchema from "../models/EmployeeSchema.js";
import mongoose from "mongoose";

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

    const missingFields = [];
    if (!firstName) missingFields.push("First Name");
    if (!mobileNo) missingFields.push("Mobile No");
    if (!manager) missingFields.push("Manager");
    if (!workingType) missingFields.push("Working Type");
    if (!emailId) missingFields.push("Email ID");

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Required fields missing: ${missingFields.join(", ")}` });
    }

    /* ---------- CHECK EMAIL DUPLICATE ---------- */
    const existingEmployee = await EmployeeSchema.findOne({ emailId }).session(session);
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

    /* ---------- WORKING TYPE VALIDATION ---------- */
    if (workingType === "perJem" && (!perJemDetails?.processes?.length || !perJemDetails?.perProcess)) {
      return res.status(400).json({ message: "PerJem details required" });
    }

    if (workingType === "FixedSalary" && !fixedSalary?.salary) {
      return res.status(400).json({ message: "Fixed salary required" });
    }

    // Default password for new employee
    const defaultPassword = "employee";

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
      password: defaultPassword, // Will be hashed by pre-save hook
      role: 'employee'
    });

    const savedEmployee = await employee.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Employee created successfully",
      employee: savedEmployee,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create Employee Error:", error);

    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({ message: `${field} already exists.` });
    }

    res.status(400).json({ message: error.message });
  }
});


/* -------------------- GET ALL EMPLOYEES -------------------- */
router.get("/employees", async (req, res) => {
  try {
    // Return all employees (Password is hidden by default in common usage, but for API maybe we should select -password)
    // We can rely on frontend not needing it, or explicit exclusion.
    // Also need to include 'userId' for compatibility with frontend assignment logic (used to be User._id, now should be Employee._id)

    const employees = await EmployeeSchema.find()
      .populate("manager")
      .populate("process")
      .lean();

    // Map _id to userId for frontend compatibility
    const mappedEmployees = employees.map(emp => ({
      ...emp,
      userId: emp._id // Now the Employee ID IS the User ID
    }));

    res.status(200).json(mappedEmployees);
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

    /* ---------- CHECK EMAIL DUPLICATE ---------- */
    if (body.emailId && body.emailId !== existingEmployee.emailId) {
      const emailExists = await EmployeeSchema.findOne({ emailId: body.emailId }).session(session);
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    /* ---------- WORKING TYPE CLEANUP ---------- */
    if (body.workingType === "perJem") body.fixedSalary = undefined;
    if (body.workingType === "FixedSalary") body.perJemDetails = undefined;

    /* ---------- UPDATE EMPLOYEE ---------- */
    // Note: If updating password is required here, we'd need to handle hashing if using updateOne/findByIdAndUpdate,
    // OR find, set, and save to trigger pre-save hook.
    // For now assuming this endpoint updates profile info, not auth.

    const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Employee updated successfully",
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
  try {
    const employee = await EmployeeSchema.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
