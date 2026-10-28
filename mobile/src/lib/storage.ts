/**
 * Safe local storage wrapper for React Native / Expo
 * Gracefully falls back to in-memory store if AsyncStorage is not yet linked or fails.
 */

let asyncStorageModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  asyncStorageModule = require("@react-native-async-storage/async-storage").default;
} catch {
  // AsyncStorage not installed or unavailable in current environment
}

const memoryStore = new Map<string, string>();

export const AppStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (asyncStorageModule?.getItem) {
        return await asyncStorageModule.getItem(key);
      }
    } catch {
      // ignore
    }
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (asyncStorageModule?.setItem) {
        await asyncStorageModule.setItem(key, value);
        return;
      }
    } catch {
      // ignore
    }
    memoryStore.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (asyncStorageModule?.removeItem) {
        await asyncStorageModule.removeItem(key);
        return;
      }
    } catch {
      // ignore
    }
    memoryStore.delete(key);
  },
};
