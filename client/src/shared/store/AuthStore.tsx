import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthStateType } from "~types";

const useAuthStore = create<AuthStateType>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      role: null,
      login: (userData, roleData) => {
        set({
          user: userData,
          role: roleData,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAuthStore;
