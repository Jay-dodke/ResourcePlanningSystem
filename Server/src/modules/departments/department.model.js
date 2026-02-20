import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    code: {type: String, default: ""},
    description: {type: String, default: ""},
    managerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
  },
  {timestamps: true}
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
