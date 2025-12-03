/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { vi } from 'vitest';

const ResizeObserverMock = vi.fn(
  class {
    callback: Function;
    constructor(callback: Function) {
      this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
);

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
