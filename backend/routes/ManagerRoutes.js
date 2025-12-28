import express from "express";
import ManagerSchema from "../models/ManagerSchema.js";

const router = express.Router();

/* -------------------- CREATE MANAGER -------------------- */
router.post("/managers", async (req, res) => {
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
    shortName = shortName?.trim() || undefined; // Convert empty string to undefined for unique constraint
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
    if (!firstName || !mobileNo || !gender) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    /* ---------- DUPLICATE EMAIL CHECK ---------- */
    if (emailId) {
      const exists = await ManagerSchema.findOne({ emailId });
      if (exists) {
        return res.status(400).json({ message: "Manager already exists" });
      }
    }

    const newManager = new ManagerSchema({
      firstName,
      lastName,
      ...(shortName && { shortName }), // Only include if not undefined
      ...(emailId && { emailId }), // Only include if not undefined
      mobileNo,
      gender,
      ...(bankName && { bankName }),
      ...(ifscCode && { ifscCode }),
      ...(accountNo && { accountNo }),
      address,
      fixedSalary,
      diamondExperience,
      referenceDetails,
      ...(department && { department })
    });

    const savedManager = await newManager.save();
    res.status(201).json(savedManager);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* -------------------- GET ALL MANAGERS -------------------- */
router.get("/managers", async (req, res) => {
  try {
    const managers = await ManagerSchema.find().lean();
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- UPDATE MANAGER -------------------- */
router.put("/managers/:id", async (req, res) => {
  try {
    const body = req.body;

    /* ---------- TRIMMING ---------- */
    if (body.firstName) body.firstName = body.firstName.trim();
    if (body.lastName) body.lastName = body.lastName.trim();
    if (body.shortName !== undefined) {
      body.shortName = body.shortName?.trim() || undefined; // Convert empty string to undefined
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

    const updatedManager = await ManagerSchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json(updatedManager);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* -------------------- DELETE MANAGER -------------------- */
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
