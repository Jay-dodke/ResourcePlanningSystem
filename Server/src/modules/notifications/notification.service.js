import Notification from "./notification.model.js";
import {getPagination} from "../../utils/pagination.js";

export const createNotification = (data) => Notification.create(data);

export const createNotifications = (items) => Notification.insertMany(items);

export const listNotifications = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.userId) filter.userId = query.userId;
  if (query.read) filter.read = query.read === "true";

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .populate("userId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  return {items, total, page, limit};
};

export const getNotificationById = (id) => Notification.findById(id).populate("userId", "name email");

export const updateNotification = (id, data) =>
  Notification.findByIdAndUpdate(id, data, {new: true}).populate("userId", "name email");

export const deleteNotification = (id) => Notification.findByIdAndDelete(id);
