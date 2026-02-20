import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    companyName: {type: String, required: true},
    workHoursPerDay: {type: Number, default: 8},
    timezone: {type: String, default: "UTC"},
    currency: {type: String, default: "USD"},
    logo: {type: String, default: ""},
  },
  {timestamps: true}
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
