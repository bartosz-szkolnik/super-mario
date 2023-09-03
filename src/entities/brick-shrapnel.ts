import type { AudioBoard } from '../audio-board';
import { Entity } from '../entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { type SpriteSheet } from '../spritesheet';
import { Gravity, Velocity } from '../traits';
import { LifeLimit } from '../traits/life-limit';

export async function loadBrickShrapnel(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('brick-shrapnel'), loadAudioBoard('brick-shrapnel', audioContext)]).then(
    ([sprite, audio]) => createBrickShrapnelFactory(sprite, audio),
  );
}

function createBrickShrapnelFactory(sprite: SpriteSheet, audio: AudioBoard) {
  const spinBrick = sprite.getAnimation('spinning-brick');

  function draw(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(spinBrick(this.lifetime), context, 0, 0);
  }

  return function createBrickShrapnel() {
    const entity = new Entity();
    entity.setAudio(audio);

    entity.size.set(8, 8);

    entity.addTrait(new LifeLimit());
    entity.addTrait(new Gravity());
    entity.addTrait(new Velocity());
    entity.draw = draw;

    return entity;
  };
}
