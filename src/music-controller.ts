import type { MusicPlayer } from './music-player';

export class MusicController {
  player: MusicPlayer | null = null;

  setPlayer(player: MusicPlayer) {
    this.player = player;
  }

  playTheme(speed = 1) {
    const audio = this.player?.playTrack('main');
    if (!audio) {
      console.warn('Not found the main theme of the level.');
      return;
    }

    audio.playbackRate = speed;
  }

  playHurryTheme() {
    const audio = this.player?.playTrack('hurry');
    if (!audio) {
      console.warn('Not found the hurry theme of the level.');
      return;
    }

    audio.loop = false;
    audio.addEventListener('ended', () => this.playTheme(1.3), { once: true });
  }

  pause() {
    this.player?.pauseAll();
  }
}
