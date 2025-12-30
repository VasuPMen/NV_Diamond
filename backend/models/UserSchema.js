import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["employee", "admin", "manager"],
    default: "employee",
  },
});

// set default password ONLY if password not provided
userSchema.pre("save", async function (next) {
  if (this.isModified("password") === false) return next();

  let rawPassword = this.password;

  if (!this.password || this.password === "AUTO") {
    if (this.role === "manager") rawPassword = "manager";
    if (this.role === "employee") rawPassword = "employee";
  }

  this.password = await bcrypt.hash(rawPassword, 10);
  next();
});

export default mongoose.model("User", userSchema);
