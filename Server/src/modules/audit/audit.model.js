import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    actorId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    action: {type: String, required: true},
    entity: {type: String, required: true},
    entityId: {type: mongoose.Schema.Types.ObjectId},
    metadata: {type: Object, default: {}},
  },
  {timestamps: true}
);

const AuditLog = mongoose.model("AuditLog", auditSchema);

export default AuditLog;
