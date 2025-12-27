import mongoose from "mongoose";

const joberSchema = new mongoose.Schema(
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
        emailId: {
            type: String,
            lowercase: true,
            trim: true,
        },
        mobileNo: {
            required: true,
            type: String,
        },

        gstNumber: {
            type: String,
        },

        process: [
            {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: "Process",
            },
        ],

        paymentTerms: {
            type: Number
        }
    },
    { timestamps: true }
);

export default mongoose.model("Jober", joberSchema);