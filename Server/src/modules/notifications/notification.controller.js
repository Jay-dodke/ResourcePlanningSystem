import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/apiError.js";
import {getQuery} from "../../utils/request.js";
import * as notificationService from "./notification.service.js";
import User from "../users/user.model.js";
import {PERMISSIONS} from "../../utils/permissions.js";

export const createNotification = asyncHandler(async (req, res) => {
  const {targetType = "users", userId, userIds, roleId, ...payload} = req.validated.body;
  let targets = [];

  if (targetType === "all") {
    targets = await User.find({status: "active"}).select("_id");
  } else if (targetType === "role") {
    if (!roleId) throw new ApiError(400, "roleId is required for role target");
    targets = await User.find({roleId, status: "active"}).select("_id");
  } else {
    const ids = userIds?.length ? userIds : userId ? [userId] : [];
    if (ids.length === 0) throw new ApiError(400, "userId or userIds required");
    targets = ids.map((id) => ({_id: id}));
  }

  const items = targets.map((target) => ({
    userId: target._id,
    title: payload.title,
    message: payload.message,
    type: payload.type || "info",
    read: false,
  }));

  const notification = await notificationService.createNotifications(items);
  res.status(201).json({success: true, data: notification});
});

export const listNotifications = asyncHandler(async (req, res) => {
  const query = getQuery(req);
  const isAdmin = req.user?.role?.toLowerCase() === "admin";
  if (!isAdmin) {
    query.userId = req.user?.id;
  }
  const result = await notificationService.listNotifications(query);
  res.json({success: true, ...result});
});

export const getNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.id);
  if (!notification) throw new ApiError(404, "Notification not found");
  res.json({success: true, data: notification});
});

export const updateNotification = asyncHandler(async (req, res) => {
  const existing = await notificationService.getNotificationById(req.params.id);
  if (!existing) throw new ApiError(404, "Notification not found");

  const isAdmin = req.user?.role?.toLowerCase() === "admin";
  const hasWrite = req.user?.permissions?.includes(PERMISSIONS.NOTIFICATIONS_WRITE);

  if (!isAdmin && !hasWrite) {
    const ownerId = existing.userId?._id?.toString() || existing.userId?.toString();
    if (ownerId !== String(req.user?.id)) {
      throw new ApiError(403, "Forbidden");
    }
    const keys = Object.keys(req.validated.body || {});
    if (keys.some((key) => key !== "read")) {
      throw new ApiError(403, "Forbidden");
    }
  }

  const notification = await notificationService.updateNotification(req.params.id, req.validated.body);
  if (!notification) throw new ApiError(404, "Notification not found");
  res.json({success: true, data: notification});
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.deleteNotification(req.params.id);
  if (!notification) throw new ApiError(404, "Notification not found");
  res.json({success: true, data: notification});
});
