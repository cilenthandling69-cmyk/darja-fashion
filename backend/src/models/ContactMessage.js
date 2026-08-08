import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 90,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 24,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 140,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 2500,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
      index: true,
    },
    reply: { type: String, trim: true, maxlength: 5000, default: "" },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
