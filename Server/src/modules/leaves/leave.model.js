import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    type: {
      type: String,
      enum: ["annual", "sick", "unpaid", "other"],
      default: "annual",
    },
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    reason: {type: String, default: ""},
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    decisionAt: {type: Date},
  },
  {timestamps: true}
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
