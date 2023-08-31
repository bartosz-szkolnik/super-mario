import { InputRouter } from './input-router';
import { KeyboardState } from './keyboard-state';
import { Go, Jump } from './traits';

const KEY_MAP = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  A: 'Space',
  B: 'ShiftLeft',
};

const ALTERNATIVE_KEY_MAP = {
  UP: 'KeyW',
  DOWN: 'KeyS',
  LEFT: 'KeyA',
  RIGHT: 'KeyD',
  A: 'KeyP',
  B: 'KeyO',
};

export function setupKeyboard(window: Window) {
  const input = new KeyboardState();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping([KEY_MAP.A, ALTERNATIVE_KEY_MAP.A], keyState => {
    if (keyState) {
      router.route(entity => entity.get(Jump).start());
    } else {
      router.route(entity => entity.get(Jump).cancel());
    }
  });

  input.addMapping([KEY_MAP.B, ALTERNATIVE_KEY_MAP.B], keyState => {
    router.route(entity => entity.turbo(Boolean(keyState)));
  });

  input.addMapping([KEY_MAP.RIGHT, ALTERNATIVE_KEY_MAP.RIGHT], keyState => {
    router.route(entity => (entity.get(Go).dir += keyState ? 1 : -1));
  });

  input.addMapping([KEY_MAP.LEFT, ALTERNATIVE_KEY_MAP.LEFT], keyState => {
    router.route(entity => (entity.get(Go).dir += keyState ? -1 : 1));
  });

  return router;
}
