import type { Entity } from '../entity';
import type { GameContext } from '../main';
import { Vec2 } from '../math';
import { Trait } from '../trait';
import { PoleTraveller } from './pole-traveller';

type TravellerState = {
  current: Vec2;
  goal: Vec2;
  done: boolean;
};

function createTravellerState() {
  return {
    current: new Vec2(0, 0),
    goal: new Vec2(0, 0),
    done: false,
  };
}

export class Pole extends Trait {
  private readonly velocity = 100;
  private readonly travellers = new Map<Entity, TravellerState>();

  update(pole: Entity, { deltaTime }: GameContext) {
    const distance = this.velocity * (deltaTime ?? 0);

    for (const [traveller, state] of this.travellers.entries()) {
      if (!state.done) {
        state.current.y += distance;
        traveller.bounds.right = state.current.x;
        traveller.bounds.bottom = state.current.y;

        const poleTraveller = traveller.get(PoleTraveller);
        poleTraveller.distance += distance;

        if (traveller.bounds.bottom > state.goal.y) {
          state.done = true;
          traveller.bounds.bottom = state.goal.y;
          poleTraveller.distance = 0;
        }
      } else if (!pole.bounds.overlaps(traveller.bounds)) {
        this.travellers.delete(traveller);
      }
    }
  }

  collides(pole: Entity, traveller: Entity) {
    if (!traveller.has(PoleTraveller)) {
      return;
    }

    if (this.travellers.has(traveller)) {
      return;
    }

    this.addTraveller(pole, traveller);
  }

  private addTraveller(pole: Entity, traveller: Entity) {
    pole.sounds.add('ride');

    const poleTraveller = traveller.get(PoleTraveller);
    poleTraveller.distance = 0;

    const state = createTravellerState();
    state.current.x = pole.bounds.meridian;
    state.current.y = pole.bounds.bottom;
    state.goal.x = state.current.x;
    state.goal.y = pole.bounds.bottom;
    this.travellers.set(traveller, state);
  }
}
