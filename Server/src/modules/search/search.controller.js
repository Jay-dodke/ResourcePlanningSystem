import {asyncHandler} from "../../utils/asyncHandler.js";
import {getQuery} from "../../utils/request.js";
import * as searchService from "./search.service.js";

export const search = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  const data = await searchService.globalSearch({
    q: query.q || query.query || "",
    limit: Number(query.limit) || 5,
  });
  res.json({success: true, data});
});
