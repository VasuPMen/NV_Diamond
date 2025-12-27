import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
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
    gstNumber: {
      type: String,
    },
    panCard :{
        type:String
    },
    stoneType:{
      type:String,
      enum:["Nature" , "HPHT" , "CVD"]
    },
  },
  { timestamps: true }
);

export default mongoose.model("Party", partySchema);