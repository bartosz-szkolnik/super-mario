import { Entity } from './entity';
import { loadMarioSprites } from './sprites';

export async function createMario() {
  const sprite = await loadMarioSprites();

  const mario = new Entity();
  mario.update = function updateMario(deltaTime: number) {
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
  };

  mario.draw = function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw('idle', context, this.pos.x, this.pos.y);
  };

  return mario;
}
