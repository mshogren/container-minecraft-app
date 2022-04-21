Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  // eslint-disable-next-line consistent-return, getter-return
  get() {
    if (typeof globalThis.self !== 'undefined') {
      return globalThis.self.IS_REACT_ACT_ENVIRONMENT;
    }
  },
  set(value) {
    if (typeof globalThis.self !== 'undefined') {
      globalThis.self.IS_REACT_ACT_ENVIRONMENT = value;
    }
  },
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
