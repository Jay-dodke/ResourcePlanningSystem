import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    passwordHash: {type: String, required: true, select: false},
    roleId: {type: mongoose.Schema.Types.ObjectId, ref: "Role"},
    designation: {type: String, default: ""},
    departmentId: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    managerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    skills: {
      type: [
        new mongoose.Schema(
          {
            name: {type: String, required: true, trim: true},
            level: {type: Number, default: 3, min: 1, max: 5},
          },
          {_id: false}
        ),
      ],
      default: [],
    },
    status: {type: String, enum: ["active", "inactive", "suspended"], default: "active"},
    avatar: {type: String, default: ""},
    mustChangePassword: {type: Boolean, default: false},
  },
  {timestamps: true}
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
