import { Entity } from '../entity';
import type { Level } from '../level';
import { loadSpriteSheet } from '../loaders/sprite';
import type { GameContext } from '../main';
import { findPlayers } from '../player';
import type { SpriteSheet } from '../spritesheet';
import { Trait } from '../trait';

type PiranhaState = 'idle' | 'attack' | 'hold' | 'retreat';

const IDLE_TIME = 4;
const HOLD_TIME = 2;
const VELOCITY = 30;
const GRACE_DISTANCE = 32;

export async function loadPiranhaPlant() {
  const sprite = await loadSpriteSheet('piranha-plant');
  return createPiranhaPlantFactory(sprite);
}

class Behavior extends Trait {
  private state: PiranhaState = 'idle';

  private deltaMove = 0;
  private deltaWait = 0;

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    switch (this.state) {
      case 'idle':
        return this.idle(deltaTime ?? 0, entity, level);
      case 'attack':
        return this.attack(deltaTime ?? 0, entity);
      case 'hold':
        return this.hold(deltaTime ?? 0);
      case 'retreat':
        return this.retreat(deltaTime ?? 0, entity);
    }
  }

  private idle(deltaTime: number, entity: Entity, level: Level) {
    for (const player of findPlayers(level.entities)) {
      const distance = player.bounds.getCenter().distance(entity.bounds.getCenter());
      if (distance < GRACE_DISTANCE) {
        this.deltaWait = 0;
        return;
      }
    }

    this.deltaWait += deltaTime;
    if (this.deltaWait >= IDLE_TIME) {
      this.setState('attack');
    }
  }

  private attack(deltaTime: number, entity: Entity) {
    const movement = VELOCITY * deltaTime;
    this.deltaMove += movement;
    entity.pos.y -= movement;

    if (this.deltaMove >= entity.size.y) {
      entity.pos.y += entity.size.y - this.deltaMove;
      this.setState('hold');
    }
  }

  private hold(deltaTime: number) {
    this.deltaWait += deltaTime;

    if (this.deltaWait >= HOLD_TIME) {
      this.setState('retreat');
    }
  }

  private retreat(deltaTime: number, entity: Entity) {
    const movement = VELOCITY * deltaTime;
    this.deltaMove -= movement;
    entity.pos.y += movement;

    if (this.deltaMove <= 0) {
      entity.pos.y -= this.deltaMove;
      this.setState('idle');
    }
  }

  private setState(state: PiranhaState) {
    this.state = state;
    this.deltaWait = 0;
  }
}

function createPiranhaPlantFactory(sprite: SpriteSheet) {
  const chewAnimation = sprite.getAnimation('chew');

  function routeAnim(goomba: Entity) {
    return chewAnimation(goomba.lifetime);
  }

  function drawPiranhaPlant(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createPiranhaPlant() {
    const piranhaPlant = new Entity();
    piranhaPlant.size.set(16, 24);
    piranhaPlant.addTrait(new Behavior());

    piranhaPlant.draw = drawPiranhaPlant;

    return piranhaPlant;
  };
}
