import AuditLog from "./audit.model.js";
import {getPagination} from "../../utils/pagination.js";

export const logAction = ({actorId, action, entity, entityId, metadata = {}}) => {
  return AuditLog.create({actorId, action, entity, entityId, metadata});
};

export const listAuditLogs = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.actorId) filter.actorId = query.actorId;
  if (query.action) filter.action = query.action;
  if (query.entity) filter.entity = query.entity;
  if (query.entityId) filter.entityId = query.entityId;

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("actorId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};
