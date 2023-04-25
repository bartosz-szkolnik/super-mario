const PRESSED = 1;
const RELEASED = 0;

type KeyFn = (keyState: number) => void;

export class KeyboardState {
  // Holds the current state of a given key
  private readonly keyStates = new Map<string, number>();

  // Holds the callback functions for a key code
  private readonly keyMap = new Map<string, KeyFn>();

  addMapping(code: string, callback: KeyFn) {
    this.keyMap.set(code, callback);
  }

  listenTo(window: Window) {
    const eventNames = ['keydown', 'keyup'] as const;
    eventNames.forEach(eventName => {
      window.addEventListener(eventName, event => {
        this.handleEvent(event);
      });
    });
  }

  private handleEvent(event: KeyboardEvent) {
    const { code } = event;
    if (!this.keyMap.has(code)) {
      return;
    }

    event.preventDefault();
    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;
    if (this.keyStates.get(code) === keyState) {
      return;
    }

    this.keyStates.set(code, keyState);
    const fn = this.keyMap.get(code)!;
    fn(keyState);
  }
}
