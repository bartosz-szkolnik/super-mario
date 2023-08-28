import { InputRouter } from './input-router';
import { KeyboardState } from './keyboard-state';
import { Go, Jump } from './traits';

const SPACE_KEY = 'Space';
const LEFT_ARROW_KEY = 'ArrowLeft';
const RIGHT_ARROW_KEY = 'ArrowRight';
const LEFT_SHIFT_KEY = 'ShiftLeft';

export function setupKeyboard(window: Window) {
  const input = new KeyboardState();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping(SPACE_KEY, keyState => {
    if (keyState) {
      router.route(entity => entity.get(Jump).start());
    } else {
      router.route(entity => entity.get(Jump).cancel());
    }
  });

  input.addMapping(LEFT_SHIFT_KEY, keyState => {
    router.route(entity => entity.turbo(Boolean(keyState)));
  });

  input.addMapping(RIGHT_ARROW_KEY, keyState => {
    router.route(entity => (entity.get(Go).dir += keyState ? 1 : -1));
  });

  input.addMapping(LEFT_ARROW_KEY, keyState => {
    router.route(entity => (entity.get(Go).dir += keyState ? -1 : 1));
  });

  return router;
}
