import type { AudioBoard } from '../audio-board';
import { Entity } from '../entity';
import type { Level } from '../level';
import { loadAudioBoard } from '../loaders/audio';
import type { GameContext } from '../main';
import { findPlayers } from '../player';
import { Emitter } from '../traits';

const HOLD_FIRE_THRESHOLD = 30;

export async function loadCannon(audioContext: AudioContext) {
  const audio = await loadAudioBoard('cannon', audioContext);
  return createCannonFactory(audio);
}

function createCannonFactory(audio: AudioBoard) {
  function emitBullet(cannon: Entity, { entityFactory }: GameContext, level: Level) {
    let dir = 1;
    for (const player of findPlayers(level)) {
      if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD && player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        dir = -1;
      }
    }

    const bullet = entityFactory.bullet();
    bullet.pos.copy(cannon.pos);
    bullet.vel.set(80 * dir, 0);

    cannon.sounds.add('shoot');
    level.addEntity(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();
    cannon.audio = audio;

    const emitter = new Emitter();
    emitter.addEmitter(emitBullet);

    cannon.addTrait(emitter);

    return cannon;
  };
}
