import { Align, Entity } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';
import { Direction, Vec2 } from '../math';
import { Trait } from '../trait';
import { PipeTraveller } from './pipe-traveller';

type TravellerState = {
  time: number;
  start: Vec2;
  end: Vec2;
};

function createTravellerState(): TravellerState {
  return {
    time: 0,
    start: new Vec2(0, 0),
    end: new Vec2(0, 0),
  };
}

export function connectEntity(pipe: Entity, traveller: Entity) {
  const pipeTrait = pipe.get(Pipe);
  Align.center(pipe, traveller);

  if (pipeTrait.direction.equals(Direction.UP)) {
    Align.bottom(pipe, traveller);
  } else if (pipeTrait.direction.equals(Direction.DOWN)) {
    Align.top(pipe, traveller);
  } else if (pipeTrait.direction.equals(Direction.LEFT)) {
    Align.right(pipe, traveller);
  } else if (pipeTrait.direction.equals(Direction.RIGHT)) {
    Align.left(pipe, traveller);
  }

  pipeTrait.addTraveller(pipe, traveller);
}

export class Pipe extends Trait {
  static EVENT_PIPE_COMPLETE = Symbol('pipe complete');

  private readonly travellers = new Map<Entity, TravellerState>();
  private duration = 1;

  readonly direction = new Vec2(0, 0);

  collides(pipe: Entity, traveller: Entity) {
    if (!traveller.has(PipeTraveller)) {
      return;
    }

    if (this.travellers.has(traveller)) {
      return;
    }

    const pipeTraveller = traveller.get(PipeTraveller);
    if (pipeTraveller.direction.equals(this.direction)) {
      const tBounds = traveller.bounds;
      const pBounds = pipe.bounds;

      if (this.direction.x && (tBounds.top < pBounds.top || tBounds.bottom > pBounds.bottom)) {
        return;
      }

      if (this.direction.y && (tBounds.left < pBounds.left || tBounds.right > pBounds.right)) {
        return;
      }

      pipe.sounds.add('pipe');
      this.addTraveller(pipe, traveller);
    }
  }

  update(pipe: Entity, { deltaTime }: GameContext, level: Level): void {
    for (const [traveller, state] of this.travellers) {
      state.time += deltaTime ?? 0;

      const progress = state.time / this.duration;
      traveller.pos.x = state.start.x + (state.end.x - state.start.x) * progress;
      traveller.pos.y = state.start.y + (state.end.y - state.start.y) * progress;
      traveller.vel.set(0, 0);

      const pipeTraveller = traveller.get(PipeTraveller);
      pipeTraveller.movement.copy(this.direction);
      pipeTraveller.distance.x = traveller.pos.x - state.start.x;
      pipeTraveller.distance.y = traveller.pos.y - state.start.y;

      if (state.time > this.duration) {
        this.travellers.delete(traveller);

        pipeTraveller.movement.set(0, 0);
        pipeTraveller.distance.set(0, 0);

        level.events.emit(Pipe.EVENT_PIPE_COMPLETE, pipe, traveller);
      }
    }
  }

  addTraveller(pipe: Entity, traveller: Entity) {
    const pipeTraveller = traveller.get(PipeTraveller);
    pipeTraveller.distance.set(0, 0);

    const state = createTravellerState();
    state.start.copy(traveller.pos);
    state.end.copy(traveller.pos);
    state.end.x += this.direction.x * pipe.size.x;
    state.end.y += this.direction.y * pipe.size.y;
    this.travellers.set(traveller, state);
  }
}
