import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    capacityPercent: {type: Number, default: 100, min: 0, max: 100},
    availablePercent: {type: Number, default: 100, min: 0, max: 100},
    workloadStatus: {type: String, enum: ["available", "partial", "overloaded"], default: "available"},
  },
  {timestamps: true}
);

const Availability = mongoose.model("Availability", availabilitySchema);

export default Availability;
