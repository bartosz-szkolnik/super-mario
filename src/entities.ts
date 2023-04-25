import { Entity } from './entity';
import { loadMarioSprites } from './sprites';
import { Go, Jump } from './traits';

export async function createMario() {
  const sprite = await loadMarioSprites();

  const mario = new Entity();
  mario.size.set(14, 16);

  mario.addTrait(new Go());
  mario.addTrait(new Jump());
  // mario.addTrait(new Velocity());

  mario.draw = function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw('idle', context, this.pos.x, this.pos.y);
  };

  return mario;
}
