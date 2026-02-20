import {asyncHandler} from "../../utils/asyncHandler.js";
import * as dashboardService from "./dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboard();
  res.json({success: true, data});
});
