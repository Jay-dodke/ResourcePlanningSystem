import {asyncHandler} from "../../utils/asyncHandler.js";
import * as planningService from "./planning.service.js";

export const getPlanningSummary = asyncHandler(async (req, res) => {
  const weeks = Number(req.query?.weeks) || 8;
  const data = await planningService.getPlanningSummary({userId: req.user?.id, weeks});
  res.json({success: true, data});
});
