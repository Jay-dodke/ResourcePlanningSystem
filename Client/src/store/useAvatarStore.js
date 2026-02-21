import {create} from "zustand";

export const useAvatarStore = create((set) => ({
  overrides: {},
  setAvatarOverride: (userId, avatar) => {
    if (!userId) return;
    const key = String(userId);
    set((state) => ({
      overrides: {
        ...state.overrides,
        [key]: avatar || "",
      },
    }));
  },
  clearOverrides: () => set({overrides: {}}),
}));
