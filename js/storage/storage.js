// js/storage/storage.js
// Upgrade: replace localStorage with IndexedDB when data grows
class StorageManager {
  constructor(prefix = 'voltcalc-') {
    this.prefix = prefix;
  }

  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(this.prefix + key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage unavailable:', e);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (e) {
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
        total += localStorage[key].length * 2; // UTF-16
      }
    }
    return total;
  }
}

export const storage = new StorageManager();
