import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true },
    username: { type: String, default: "" },
    provider: { type: String, default: "" },
    password: { type: String },
    age: { type: Number, required: true },
    role: { type: String, enum: ["admin", "user"] },
    cid: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
