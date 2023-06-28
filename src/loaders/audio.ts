import { AudioBoard } from '../audio-board';
import { loadJSON } from '../loaders';
import type { AudioSheetSpec } from '../types';

export async function loadAudioBoard(name: string, context: AudioContext) {
  const loadAudio = createAudioLoader(context);

  const audioSheet = await loadJSON<AudioSheetSpec>(`./assets/sounds/${name}.json`);
  const audioBoard = new AudioBoard();

  const jobs = Object.entries(audioSheet.fx).map(async ([name, { url }]) => {
    const audio = await loadAudio(url);
    audioBoard.addAudio(name, audio);
  });

  return Promise.all(jobs).then(() => audioBoard);
}

export function createAudioLoader(context: AudioContext) {
  return async function loadAudio(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    return context.decodeAudioData(buffer);
  };
}
