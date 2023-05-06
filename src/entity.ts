import { BoundingBox } from './bounding-box';
import type { Level } from './level';
import { Vec2 } from './math';

type TraitCtor = new () => Trait;
export type Side = 'bottom' | 'top' | 'right' | 'left';

export class Trait {
  update(_entity: Entity, _deltaTime: number, _level: Level) {}
  obstruct(_entity: Entity, _side: Side) {}
  collides(_us: Entity, _them: Entity) {}
}

export class Entity {
  private readonly traits = new Map<TraitCtor, Trait>();

  readonly pos = new Vec2(0, 0);
  readonly vel = new Vec2(0, 0);
  readonly size = new Vec2(0, 0);
  readonly offset = new Vec2(0, 0);

  readonly bounds = new BoundingBox(this.pos, this.size, this.offset);

  lifetime = 0;
  canCollide = true;

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

  obstruct(side: Side) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime: number, level: Level) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime, level);
    });

    this.lifetime += deltaTime;
  }

  collides(candidate: Entity) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  draw(_context: CanvasRenderingContext2D) {}
  turbo(_turboOn: boolean) {}
}
