import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, enum: ["admin", "user"] },
    cid: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
