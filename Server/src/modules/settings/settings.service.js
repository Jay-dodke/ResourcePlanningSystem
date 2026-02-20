import Settings from "./settings.model.js";

export const getSettings = () => Settings.findOne();

export const updateSettings = async (data) => {
  return Settings.findOneAndUpdate({}, data, {new: true, upsert: true});
};
