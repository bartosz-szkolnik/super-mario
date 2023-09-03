export type EventName = symbol | string;
export type Fn = (...args: any[]) => void;
export type Listener = { name: EventName; callback: Fn };

export class EventEmitter {
  private readonly listeners: Listener[] = [];

  listen(name: EventName, callback: Fn) {
    const listener = { name, callback };
    this.listeners.push(listener);
  }

  emit(name: EventName, ...args: any[]) {
    this.listeners.forEach(listener => {
      if (listener.name === name) {
        listener.callback(...args);
      }
    });
  }
}
