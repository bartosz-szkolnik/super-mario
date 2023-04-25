import type { Entity } from './entity';
import { KeyboardState } from './keyboard-state';
import { Go, Jump } from './traits';

const SPACE_KEY = 'Space';
const LEFT_ARROW_KEY = 'ArrowLeft';
const RIGHT_ARROW_KEY = 'ArrowRight';

export function setupKeyboard(entity: Entity) {
  const input = new KeyboardState();

  input.addMapping(SPACE_KEY, keyState => {
    if (keyState) {
      entity.get(Jump).start();
    } else {
      entity.get(Jump).cancel();
    }
  });

  input.addMapping(RIGHT_ARROW_KEY, keyState => {
    entity.get(Go).dir = keyState;
  });

  input.addMapping(LEFT_ARROW_KEY, keyState => {
    entity.get(Go).dir = -keyState;
  });

  return input;
}
