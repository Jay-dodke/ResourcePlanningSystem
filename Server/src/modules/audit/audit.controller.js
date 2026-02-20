import {asyncHandler} from "../../utils/asyncHandler.js";
import {getQuery} from "../../utils/request.js";
import * as auditService from "./audit.service.js";

export const listAuditLogs = asyncHandler(async (req, res) => {
  const result = await auditService.listAuditLogs(getQuery(req));
  res.json({success: true, ...result});
});
