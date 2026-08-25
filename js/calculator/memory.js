// js/calculator/memory.js
export const memory = {
  _value: 0,
  get() {
    const stored = localStorage.getItem('voltcalc-memory');
    if (stored) return parseFloat(stored);
    return this._value;
  },
  set(val) {
    this._value = val;
    localStorage.setItem('voltcalc-memory', val.toString());
  },
  add(val) {
    const current = this.get();
    this.set(current + parseFloat(val));
  },
  subtract(val) {
    const current = this.get();
    this.set(current - parseFloat(val));
  },
  clear() {
    this.set(0);
  }
};
