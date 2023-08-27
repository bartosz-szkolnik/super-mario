import { EventName } from './event-buffer';

export type Fn = (...args: unknown[]) => void;
export type Listener = { name: EventName; callback: Fn };

export class EventEmitter {
  private readonly listeners: Listener[] = [];

  listen(name: EventName, callback: Fn) {
    const listener = { name, callback };
    this.listeners.push(listener);
  }

  emit(name: EventName, ...args: unknown[]) {
    this.listeners.forEach(listener => {
      if (listener.name === name) {
        listener.callback(...args);
      }
    });
  }
}
