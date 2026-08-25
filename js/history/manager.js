// js/history/manager.js
export const historyManager = {
  _items: [],
  _max: 100,
  _storageKey: 'voltcalc-history',
  
  getAll() {
    const stored = localStorage.getItem(this._storageKey);
    if (stored) {
      try { this._items = JSON.parse(stored); } catch(e) { this._items = []; }
    }
    return this._items;
  },
  
  add(expression, result) {
    const items = this.getAll();
    items.push({ id: Date.now(), expression, result, timestamp: new Date().toISOString() });
    if (items.length > this._max) items.shift();
    localStorage.setItem(this._storageKey, JSON.stringify(items));
    this._items = items;
  },
  
  remove(id) {
    let items = this.getAll();
    items = items.filter(item => item.id !== id);
    localStorage.setItem(this._storageKey, JSON.stringify(items));
    this._items = items;
  },
  
  clear() {
    localStorage.removeItem(this._storageKey);
    this._items = [];
  },
  
  importItems(items) {
    localStorage.setItem(this._storageKey, JSON.stringify(items));
    this._items = items;
  }
};
