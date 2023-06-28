export type Fn = (...args: unknown[]) => void;
export type Listener = { name: string; callback: Fn };

export class EventEmitter {
  private readonly listeners: Listener[] = [];

  listen(name: string, callback: Fn) {
    const listener = { name, callback };
    this.listeners.push(listener);
  }

  emit(name: string, ...args: unknown[]) {
    this.listeners.forEach(listener => {
      if (listener.name === name) {
        listener.callback(...args);
      }
    });
  }
}
