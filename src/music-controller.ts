import type { Level } from './level';
import type { GameContext } from './main';
import type { MusicPlayer } from './music-player';

export class MusicController {
  player: MusicPlayer | null = null;

  setPlayer(player: MusicPlayer) {
    this.player = player;
  }

  update(_level: Level, _gameContext: GameContext) {}
}
