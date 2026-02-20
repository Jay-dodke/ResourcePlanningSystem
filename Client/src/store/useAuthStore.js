import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      refreshToken: "",
      hasHydrated: false,
      setAuth: (payload) =>
        set({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        }),
      setTokens: (accessToken, refreshToken) => set({accessToken, refreshToken}),
      clearAuth: () => set({user: null, accessToken: "", refreshToken: ""}),
      setHasHydrated: (value) => set({hasHydrated: value}),
    }),
    {
      name: "rps-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
