import { Entity } from './entity';
import { loadMarioSprites } from './sprites';
import { Jump, Velocity } from './traits';

export async function createMario() {
  const sprite = await loadMarioSprites();

  const mario = new Entity();
  mario.addTrait(new Velocity());
  mario.addTrait(new Jump());

  mario.draw = function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw('idle', context, this.pos.x, this.pos.y);
  };

  return mario;
}
