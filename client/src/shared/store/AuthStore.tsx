import { create } from "zustand";
import { persist } from "zustand/middleware";

import IndexedDBService from "~shared/services/indexedDB/IndexedDB.service";

import { AuthStateType, SerializeStateType } from "~types";

const idbService = new IndexedDBService("zustandStore", "keyValuePairs", 1);

const serializeState = (state: SerializeStateType): SerializeStateType => {
  const { isAuthenticated, user, role } = state;
  return { isAuthenticated, user, role };
};

const useAuthStore = create<AuthStateType>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      role: null,
      login: (userData, roleData) => {
        const newState = {
          user: userData,
          role: roleData,
          isAuthenticated: true,
        };
        set(newState);
        idbService.set("auth-storage", serializeState(newState));
      },
      logout: () => {
        const newState = {
          user: null,
          role: null,
          isAuthenticated: false,
        };
        set(newState);
        idbService.set("auth-storage", serializeState(newState));
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (key) => idbService.get(key),
        setItem: (key, value) => idbService.set(key, JSON.stringify(value)),
        removeItem: (key) => idbService.remove(key),
      },
    },
  ),
);

export default useAuthStore;
