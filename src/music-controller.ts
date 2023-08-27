import type { Level } from './level';
import type { GameContext } from './main';
import type { MusicPlayer } from './music-player';

export class MusicController {
  player: MusicPlayer | null = null;

  setPlayer(player: MusicPlayer) {
    this.player = player;
  }

  playTheme(speed = 1) {
    const audio = this.player?.playTrack('main');
    if (!audio) {
      return;
    }

    audio.playbackRate = speed;
  }

  playHurryTheme() {
    const audio = this.player?.playTrack('hurry');
    if (!audio) {
      return;
    }

    audio.loop = false;
    audio.addEventListener('ended', () => this.playTheme(1.3), { once: true });
  }

  update(_level: Level, _gameContext: GameContext) {}
}
