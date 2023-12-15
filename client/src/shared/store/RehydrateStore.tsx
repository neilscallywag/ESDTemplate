import IndexedDBService from "~shared/services/indexedDB/IndexedDB.service";

import useAuthStore from "./AuthStore";

const idbService = new IndexedDBService("zustandStore", "keyValuePairs", 1);

const rehydrateStore = async () => {
  const storedState = await idbService.get("auth-storage");
  if (storedState) {
    useAuthStore.setState(storedState);
  }
};

export default rehydrateStore;
