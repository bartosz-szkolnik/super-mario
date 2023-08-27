type EventArgs = any[];

export type EventName = symbol | string;
export type Event = { name: EventName; args: EventArgs };
export type Listener = { name: EventName; callback: Task; count: number };
export type Task = (...args: EventArgs) => void;

export class EventBuffer {
  private events: Event[] = [];

  emit(name: EventName, ...args: EventArgs) {
    const event = { name, args };
    this.events.push(event);
  }

  process(name: EventName, callback: Task) {
    this.events.forEach(event => {
      if (event.name === name) {
        callback(...event.args);
      }
    });
  }

  clear() {
    this.events = [];
  }
}
