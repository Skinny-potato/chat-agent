import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: "pending" },
    due_date: Date,
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
