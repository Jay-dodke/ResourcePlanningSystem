import {asyncHandler} from "../../utils/asyncHandler.js";
import * as analyticsService from "./analytics.service.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAnalyticsSummary();
  res.json({success: true, data});
});
