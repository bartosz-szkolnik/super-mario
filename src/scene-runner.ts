import type { GameContext } from './main';

export interface Scene {
  update(gameContext: GameContext): void;
  draw(gameContext: GameContext): void;
}

export class SceneRunner {
  private readonly scenes: Scene[] = [];
  private sceneIndex = -1;

  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  runNext() {
    this.sceneIndex++;
  }

  update(gameContext: GameContext) {
    const currentScene = this.scenes[this.sceneIndex];
    if (currentScene) {
      currentScene.update(gameContext);
      currentScene.draw(gameContext);
    }
  }
}
