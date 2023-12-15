class IndexedDBService {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null;

  // TODO: singleton instance
  constructor(dbName: string, storeName: string, version: number) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this.db = null;
  }

  open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event: Event) => {
        console.error("IndexedDB error:", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName, { keyPath: "key" });
        this.db = db;
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };
    });
  }

  async get<T = any>(key: string): Promise<T | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result ? (request.result.value as T) : null;
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export default IndexedDBService;

// Usage
// const idb = new IndexedDB('zustandStore', 'keyValuePairs', 1);
// idb.set('myKey', 'myValue');
// idb.get('myKey').then((value) => console.log(value));

// IndexedDB.service.ts:57 Uncaught (in promise) DOMException: Failed to execute 'put' on 'IDBObjectStore': (userData, roleData) => {
//     const newState = {
//       user: userData,
//       role: roleData,
//   ...<omitted>... } could not be cloned.
