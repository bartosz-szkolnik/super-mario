import type { Entity } from './entity';
import { KeyboardState } from './keyboard-state';
import { Go, Jump } from './traits';

const SPACE_KEY = 'Space';
const LEFT_ARROW_KEY = 'ArrowLeft';
const RIGHT_ARROW_KEY = 'ArrowRight';
const LEFT_SHIFT_KEY = 'ShiftLeft';

export function setupKeyboard(mario: Entity) {
  const input = new KeyboardState();

  input.addMapping(SPACE_KEY, keyState => {
    if (keyState) {
      mario.get(Jump).start();
    } else {
      mario.get(Jump).cancel();
    }
  });

  input.addMapping(LEFT_SHIFT_KEY, keyState => {
    mario.turbo(Boolean(keyState));
  });

  input.addMapping(RIGHT_ARROW_KEY, keyState => {
    mario.get(Go).dir += keyState ? 1 : -1;
  });

  input.addMapping(LEFT_ARROW_KEY, keyState => {
    mario.get(Go).dir += keyState ? -1 : 1;
  });

  return input;
}
