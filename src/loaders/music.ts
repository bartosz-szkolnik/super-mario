import { loadJSON } from '../loaders';
import { MusicPlayer } from '../music-player';
import type { MusicSheetSpec } from '../types';

export async function loadMusicSheet(name: string) {
  const musicSheet = await loadJSON<MusicSheetSpec>(`./assets/sounds/music/${name}.json`);

  const musicPlayer = new MusicPlayer();
  for (const [name, track] of Object.entries(musicSheet)) {
    musicPlayer.addTrack(name, track.url);
  }

  return musicPlayer;
}
