import type { Entity, Side } from './entity';
import type { EventName, Listener, Task } from './event-buffer';
import type { Level } from './level';
import type { GameContext } from './main';
import type { Match } from './tile-resolver';

export type TraitCtor = new () => Trait;

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
