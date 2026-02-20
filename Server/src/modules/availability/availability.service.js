import Availability from "./availability.model.js";
import Allocation from "../allocations/allocation.model.js";
import Leave from "../leaves/leave.model.js";
import Timesheet from "../timesheets/timesheet.model.js";
import Settings from "../settings/settings.model.js";
import User from "../users/user.model.js";
import {getPagination} from "../../utils/pagination.js";

const deriveWorkload = (availablePercent) => {
  if (availablePercent <= 0) return "overloaded";
  if (availablePercent < 50) return "partial";
  return "available";
};

export const recalculateAvailability = async (employeeId) => {
  const now = new Date();
  const allocations = await Allocation.find({
    employeeId,
    startDate: {$lte: now},
    endDate: {$gte: now},
  });

  const totalAllocated = allocations.reduce((sum, item) => sum + item.allocationPercent, 0);
  const availability = await Availability.findOne({employeeId});
  const capacity = availability?.capacityPercent ?? 100;
  const settings = await Settings.findOne().select("workHoursPerDay");
  const workHoursPerDay = settings?.workHoursPerDay || 8;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const timesheetHours = await Timesheet.aggregate([
    {$match: {employeeId, workDate: {$gte: weekStart, $lte: now}}},
    {$group: {_id: null, totalHours: {$sum: "$hours"}}},
  ]);
  const totalHours = timesheetHours[0]?.totalHours || 0;
  const weeklyCapacityHours = workHoursPerDay * 5;
  const timesheetPercent = weeklyCapacityHours
    ? Math.min(100, Math.round((totalHours / weeklyCapacityHours) * 100))
    : 0;
  const usedPercent = Math.min(100, Math.max(totalAllocated, timesheetPercent));
  const availablePercent = Math.max(0, capacity - usedPercent);
  const workloadStatus = deriveWorkload(availablePercent);

  return Availability.findOneAndUpdate(
    {employeeId},
    {capacityPercent: capacity, availablePercent, workloadStatus},
    {new: true, upsert: true}
  );
};

export const upsertAvailability = async (data) => {
  const workloadStatus = data.workloadStatus || deriveWorkload(data.availablePercent ?? 100);
  return Availability.findOneAndUpdate(
    {employeeId: data.employeeId},
    {...data, workloadStatus},
    {new: true, upsert: true}
  );
};

export const listAvailability = async (query) => {
  const {page, limit, skip, sort} = getPagination(query);
  const filter = {};

  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.workloadStatus) filter.workloadStatus = query.workloadStatus;

  const roleFilter = query.role || query.designation;
  const skills = query.skill
    ? query.skill
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (roleFilter || skills.length || query.roleId || query.search) {
    const userFilter = {};

    if (roleFilter) {
      userFilter.designation = {$regex: roleFilter, $options: "i"};
    }

    if (skills.length) {
      userFilter["skills.name"] = {$in: skills};
    }

    if (query.roleId) {
      userFilter.roleId = query.roleId;
    }

    if (query.search) {
      userFilter.$or = [
        {name: {$regex: query.search, $options: "i"}},
        {email: {$regex: query.search, $options: "i"}},
        {designation: {$regex: query.search, $options: "i"}},
      ];
    }

    const users = await User.find(userFilter).select("_id");
    const userIds = users.map((user) => user._id.toString());

    if (userIds.length === 0) {
      return {items: [], total: 0, page, limit};
    }

    if (query.employeeId) {
      if (!userIds.includes(String(query.employeeId))) {
        return {items: [], total: 0, page, limit};
      }
      filter.employeeId = query.employeeId;
    } else {
      filter.employeeId = {$in: userIds};
    }
  }

  const [items, total] = await Promise.all([
    Availability.find(filter)
      .populate("employeeId", "name email designation skills avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Availability.countDocuments(filter),
  ]);

  const referenceDate = query.date ? new Date(query.date) : new Date();
  const employeeIds = items
    .map((doc) => doc.employeeId?._id || doc.employeeId)
    .filter(Boolean)
    .map((id) => id.toString());

  let leaveSet = new Set();
  if (employeeIds.length) {
    const leaves = await Leave.find({
      employeeId: {$in: employeeIds},
      status: "approved",
      startDate: {$lte: referenceDate},
      endDate: {$gte: referenceDate},
    }).select("employeeId");
    leaveSet = new Set(leaves.map((leave) => String(leave.employeeId)));
  }

  const normalizedItems = items.map((doc) => {
    const data = doc.toObject();
    const employeeId = data.employeeId?._id || data.employeeId;
    const onLeave = employeeId ? leaveSet.has(String(employeeId)) : false;
    if (onLeave) {
      return {
        ...data,
        availablePercent: 0,
        workloadStatus: "overloaded",
        onLeave: true,
      };
    }
    return {...data, onLeave: false};
  });

  return {items: normalizedItems, total, page, limit};
};

export const getAvailabilityById = (id) =>
  Availability.findById(id).populate("employeeId", "name email designation");

export const updateAvailability = async (id, data) => {
  const availablePercent = data.availablePercent;
  const workloadStatus = data.workloadStatus || deriveWorkload(availablePercent ?? 100);
  return Availability.findByIdAndUpdate(id, {...data, workloadStatus}, {new: true}).populate(
    "employeeId",
    "name email designation"
  );
};

export const deleteAvailability = (id) => Availability.findByIdAndDelete(id);
