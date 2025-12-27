import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
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
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mobileNo: {
      required: true,
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    manager: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    process: [
      {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Process",
      },
    ],
    bankName: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    accountNo: {
      type: String,
    },
    address: {
      permanentAddress: {
        type: String,
      },
      pinCode: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
    },
    workingType: {
      type: String,
      enum: ["perJem", "FixedSalary"],
      required: true,
    },
    perJemDetails: {
      processes: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Process",
          },
        ],
        required: function () {
          return this.workingType === "perJem";
        },
      },
      perProcess: {
        type: Map,
        of: Number,
        required: function () {
          return this.workingType === "perJem";
        },
      },
    },
    fixedSalary: {
      salary: {
        type: Number,
        required: function () {
          return this.workingType === "FixedSalary";
        },
      },
    },
    diamondExperience: {
      diamondKnowledge: {
        type: Boolean,
        default: false,
      },
      laserKnowledge: {
        type: Boolean,
        default: false,
      },
      sarinKnowledge: {
        type: Boolean,
        default: false,
      },
      computerKnowledge: {
        type: Boolean,
        default: false,
      },
    },
    referenceDetails: {
      name: {
        type: String,
      },
      mobileNo: {
        type: String,
      },
      lastCompany: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
