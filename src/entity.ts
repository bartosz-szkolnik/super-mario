import type { AudioBoard } from './audio-board';
import { BoundingBox } from './bounding-box';
import { EventBuffer, type EventName, type Listener, type Task } from './event-buffer';
import type { Level } from './level';
import type { GameContext } from './main';
import { Vec2 } from './math';
import type { Match } from './tile-resolver';

type TraitCtor = new () => Trait;
export type Side = 'bottom' | 'top' | 'right' | 'left';

export class Trait {
  static readonly EVENT_TASK = Symbol('task');

  private listeners: Listener[] = [];

  queue(task: Task) {
    this.listen(Trait.EVENT_TASK, task, 1);
  }

  finalize(entity: Entity) {
    this.listeners = this.listeners.filter(({ name, callback, count }) => {
      entity.events.process(name, callback);
      return --count;
    });
  }

  listen(name: EventName, callback: Task, count = Infinity) {
    const listener = { name, callback, count } satisfies Listener;
    this.listeners.push(listener);
  }

  update(_entity: Entity, _gameContext: GameContext, _level: Level) {}
  obstruct(_entity: Entity, _side: Side, _match: Match) {}
  collides(_us: Entity, _them: Entity) {}
}

export class Entity {
  private readonly traits = new Map<TraitCtor, Trait>();
  readonly sounds = new Set<string>();

  readonly events = new EventBuffer();

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
    this.events.emit(Trait.EVENT_TASK);

    this.traits.forEach(trait => {
      trait.finalize(this);
    });

    this.events.clear();
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
