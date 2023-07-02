import type { AudioBoard } from './audio-board';
import { BoundingBox } from './bounding-box';
import { EventEmitter } from './event-emitter';
import type { Level } from './level';
import type { GameContext } from './main';
import { Vec2 } from './math';
import type { Match } from './tile-resolver';

type TraitCtor = new () => Trait;
type Task = () => void;
export type Side = 'bottom' | 'top' | 'right' | 'left';

export class Trait {
  private tasks: Task[] = [];
  readonly events = new EventEmitter();

  queue(task: Task) {
    this.tasks.push(task);
  }

  finalize() {
    this.tasks.forEach(task => task());
    this.tasks = [];
  }

  update(_entity: Entity, _gameContext: GameContext, _level: Level) {}
  obstruct(_entity: Entity, _side: Side, _match: Match) {}
  collides(_us: Entity, _them: Entity) {}
}

export class Entity {
  private readonly traits = new Map<TraitCtor, Trait>();
  readonly sounds = new Set<string>();

  readonly pos = new Vec2(0, 0);
  readonly vel = new Vec2(0, 0);
  readonly size = new Vec2(0, 0);
  readonly offset = new Vec2(0, 0);

  readonly bounds = new BoundingBox(this.pos, this.size, this.offset);

  lifetime = 0;
  audio: AudioBoard | null = null;

  addTrait(trait: Trait) {
    this.traits.set(trait.constructor as TraitCtor, trait);
  }

  get<T extends Trait>(traitClass: new () => T) {
    const trait = this.traits.get(traitClass);
    if (!trait) {
      throw new Error('Used Trait which does not exist on an Entity.');
    }

    return trait as T;
  }

  has<T extends Trait>(traitClass: new () => T) {
    return this.traits.has(traitClass);
  }

  obstruct(side: Side, match: Match) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  update(gameContext: GameContext, level: Level) {
    this.traits.forEach(trait => {
      trait.update(this, gameContext, level);
    });

    this.playSounds(this.audio!, gameContext.audioContext);
    this.lifetime += gameContext.deltaTime ?? 0;
  }

  collides(candidate: Entity) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  finalize() {
    this.traits.forEach(trait => {
      trait.finalize();
    });
  }

  playSounds(audioBoard: AudioBoard, audioContext: AudioContext) {
    this.sounds.forEach(name => {
      audioBoard.play(name, audioContext);
    });

    this.sounds.clear();
  }

  draw(_context: CanvasRenderingContext2D) {}
  turbo(_turboOn: boolean) {}
}
