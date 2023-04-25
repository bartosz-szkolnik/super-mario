import { Vec2 } from './math';

type TraitCtor = new () => Trait;

export class Trait {
  update(_entity: Entity, _deltaTime: number) {
    console.warn('Unhandled update call in Trait.');
  }
}

export class Entity {
  private readonly traits = new Map<TraitCtor, Trait>();

  readonly pos = new Vec2(0, 0);
  readonly vel = new Vec2(0, 0);
  readonly size = new Vec2(0, 0);

  addTrait(trait: Trait) {
    this.traits.set(trait.constructor as new () => Trait, trait);
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

  update(deltaTime: number) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime);
    });
  }

  draw(_context: CanvasRenderingContext2D) {}
}
