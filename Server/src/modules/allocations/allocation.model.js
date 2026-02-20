import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
    role: {type: String, required: true},
    allocationPercent: {type: Number, required: true, min: 0, max: 100},
    billable: {type: Boolean, default: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
  },
  {timestamps: true}
);

const Allocation = mongoose.model("Allocation", allocationSchema);

export default Allocation;
