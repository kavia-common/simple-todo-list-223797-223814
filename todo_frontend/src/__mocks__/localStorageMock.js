const store = {};

beforeEach(() => {
  for (const key of Object.keys(store)) {
    delete store[key];
  }
});

Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  },
  configurable: true,
});
