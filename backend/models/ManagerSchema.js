import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const managerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    shortName: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
      trim: true,
    },

    emailId: {
      type: String,
      lowercase: true,
      trim: true,
    },

    mobileNo: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bankName: String,
    ifscCode: String,
    accountNo: String,

    address: {
      permanentAddress: String,
      pinCode: String,
      city: String,
      state: String,
    },

    fixedSalary: {
      salary: Number,
    },

    employee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    diamondExperience: {
      diamondKnowledge: { type: Boolean, default: false },
      laserKnowledge: { type: Boolean, default: false },
      sarinKnowledge: { type: Boolean, default: false },
      computerKnowledge: { type: Boolean, default: false },
    },

    referenceDetails: {
      name: String,
      mobileNo: String,
      lastCompany: String,
    },

    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    password: { type: String }, // Optional initially, set to default if empty
    role: { type: String, default: "manager" },
  },
  { timestamps: true }
);

// Hash password before saving
// Hash password before saving
managerSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default mongoose.model("Manager", managerSchema);
