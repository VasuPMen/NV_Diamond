import mongoose from "mongoose";

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

    process: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Process",
      },
    ],

    employee : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        }
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

    fixedSalary: {
      salary: {
        type: Number,
      },
    },

    employeeName : {

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

    typeOfManager : {
      type: String,
      enum: ["MyManager", "Jober"],
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

export default mongoose.model("Manager", managerSchema);