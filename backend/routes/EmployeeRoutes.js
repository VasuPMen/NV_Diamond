import express from "express";
import EmployeeSchema from "../models/EmployeeSchema.js";

const router = express.Router();

/* -------------------- CREATE EMPLOYEE -------------------- */
router.post("/employees", async (req, res) => {
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
    emailId = emailId?.trim().toLowerCase() || undefined;
    mobileNo = mobileNo?.trim();
    bankName = bankName?.trim() || undefined;
    ifscCode = ifscCode?.trim() || undefined;
    accountNo = accountNo?.trim() || undefined;

    if (address) {
      address = {
        permanentAddress: address.permanentAddress?.trim(),
        pinCode: address.pinCode?.trim(),
        city: address.city?.trim(),
        state: address.state?.trim(),
      };
    }

    if (referenceDetails) {
      referenceDetails = {
        name: referenceDetails.name?.trim(),
        mobileNo: referenceDetails.mobileNo?.trim(),
        lastCompany: referenceDetails.lastCompany?.trim(),
      };
    }

    /* ---------- REQUIRED CHECK ---------- */
    if (!firstName || !mobileNo || !manager || !workingType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    /* ---------- DUPLICATE EMAIL CHECK ---------- */
    if (emailId) {
      const exists = await EmployeeSchema.findOne({ emailId });
      if (exists) {
        return res.status(400).json({ message: "Employee already exists" });
      }
    }

    /* ---------- WORKING TYPE VALIDATION ---------- */
    if (workingType === "perJem") {
      if (
        !perJemDetails?.processes?.length ||
        !perJemDetails?.perProcess
      ) {
        return res
          .status(400)
          .json({ message: "PerJem details are required" });
      }
    }

    if (workingType === "FixedSalary") {
      if (!fixedSalary?.salary) {
        return res
          .status(400)
          .json({ message: "Fixed salary is required" });
      }
    }

    const newEmployee = new EmployeeSchema({
      firstName,
      lastName,
      ...(shortName && { shortName }),
      ...(emailId && { emailId }),
      mobileNo,
      gender,
      manager,
      process,
      ...(bankName && { bankName }),
      ...(ifscCode && { ifscCode }),
      ...(accountNo && { accountNo }),
      address,
      workingType,
      ...(workingType === "perJem" && { perJemDetails }),
      ...(workingType === "FixedSalary" && { fixedSalary }),
      diamondExperience,
      referenceDetails,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);

  } catch (error) {
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
  try {
    const body = req.body;

    /* ---------- TRIMMING ---------- */
    if (body.firstName) body.firstName = body.firstName.trim();
    if (body.lastName) body.lastName = body.lastName.trim();

    if (body.shortName !== undefined) {
      body.shortName = body.shortName?.trim() || undefined;
    }

    if (body.emailId !== undefined) {
      body.emailId = body.emailId?.trim().toLowerCase() || undefined;
    }

    if (body.mobileNo) body.mobileNo = body.mobileNo.trim();
    if (body.bankName !== undefined) body.bankName = body.bankName?.trim() || undefined;
    if (body.ifscCode !== undefined) body.ifscCode = body.ifscCode?.trim() || undefined;
    if (body.accountNo !== undefined) body.accountNo = body.accountNo?.trim() || undefined;

    if (body.address) {
      body.address = {
        permanentAddress: body.address.permanentAddress?.trim(),
        pinCode: body.address.pinCode?.trim(),
        city: body.address.city?.trim(),
        state: body.address.state?.trim(),
      };
    }

    if (body.referenceDetails) {
      body.referenceDetails = {
        name: body.referenceDetails.name?.trim(),
        mobileNo: body.referenceDetails.mobileNo?.trim(),
        lastCompany: body.referenceDetails.lastCompany?.trim(),
      };
    }

    /* ---------- WORKING TYPE CLEANUP ---------- */
    if (body.workingType === "perJem") {
      body.fixedSalary = undefined;
    }

    if (body.workingType === "FixedSalary") {
      body.perJemDetails = undefined;
    }

    const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* -------------------- DELETE EMPLOYEE -------------------- */
router.delete("/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await EmployeeSchema.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
