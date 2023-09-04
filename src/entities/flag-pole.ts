import type { AudioBoard } from '../audio-board';
import { Entity } from '../entity';
import { loadAudioBoard } from '../loaders/audio';
import { Pole } from '../traits/pole';

export async function loadFlagPole(audioContext: AudioContext) {
  const audio = await loadAudioBoard('flag-pole', audioContext);
  return createFlagPoleFactory(audio);
}

function createFlagPoleFactory(audio: AudioBoard) {
  return function createFlagPole() {
    const entity = new Entity();
    const pole = new Pole();

    entity.setAudio(audio);
    entity.size.set(8, 144);
    entity.offset.set(4, 0);
    entity.addTrait(pole);

    return entity;
  };
}
