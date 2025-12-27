import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // ================= Personal Details =================
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

    // ================= Organization Details =================
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

    // ================= Account Details =================
    bankName: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    accountNo: {
      type: String,
    },

    // ================= Address Details =================
    address: {
      required: true,
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

    // ===== PER JEM =====
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
        of: Number, // processId -> price
        required: function () {
          return this.workingType === "perJem";
        },
      },
    },

    // ===== FIXED SALARY =====
    fixedSalary: {
      salary: {
        type: Number,
        required: function () {
          return this.workingType === "FixedSalary";
        },
      },
    },

    // ================= Diamond Experience =================
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

    // ================= Reference Details =================
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
