import { Entity } from '../entity';
import { loadSpriteSheet } from '../loaders/sprite';
import type { GameContext } from '../main';
import type { SpriteSheet } from '../spritesheet';
import { Trait } from '../trait';
import { Killable, PendulumMove, Stomper, Physics, Solid } from '../traits';

type State = 'walking' | 'hiding' | 'panic';

const HIDE_DURATION = 5;
const PANIC_SPEED = 300;

export async function loadKoopa() {
  const sprite = await loadSpriteSheet('koopa');
  return createKoopaFactory(sprite);
}

class Behavior extends Trait {
  state: State = 'walking';
  hideTime = 0;
  walkSpeed: number | null = null;

  collides(us: Entity, them: Entity) {
    if (us.get(Killable).dead) {
      return;
    }

    if (them.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  private handleNudge(us: Entity, them: Entity) {
    if (this.state === 'walking') {
      them.get(Killable).kill();
    } else if (this.state === 'hiding') {
      this.panic(us, them);
    } else if (this.state === 'panic') {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);
      if (travelDir !== 0 && travelDir !== impactDir) {
        them.get(Killable).kill();
      }
    }
  }

  private handleStomp(us: Entity) {
    if (this.state === 'walking') {
      this.hide(us);
    } else if (this.state === 'hiding') {
      us.get(Killable).kill();
      us.vel.set(100, -200);
      us.get(Solid).obstructs = false;
    } else if (this.state === 'panic') {
      this.hide(us);
    }
  }

  private hide(us: Entity) {
    us.vel.x = 0;
    us.get(PendulumMove).enabled = false;
    if (this.walkSpeed === null) {
      this.walkSpeed = us.get(PendulumMove).speed;
    }
    this.state = 'hiding';
    this.hideTime = 0;
  }

  private unhide(us: Entity) {
    us.get(PendulumMove).enabled = true;
    us.get(PendulumMove).speed = this.walkSpeed!;
    this.state = 'walking';
  }

  private panic(us: Entity, them: Entity) {
    us.get(PendulumMove).enabled = true;
    us.get(PendulumMove).speed = PANIC_SPEED * Math.sign(them.vel.x);
    this.state = 'panic';
  }

  update(us: Entity, { deltaTime }: GameContext) {
    if (this.state === 'hiding') {
      this.hideTime += deltaTime ?? 0;
      if (this.hideTime > HIDE_DURATION) {
        this.unhide(us);
      }
    }
  }
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnimation = sprite.getAnimation('walk');
  const wakeAnimation = sprite.getAnimation('wake');

  function routeAnim(koopa: Entity) {
    const state = koopa.get(Behavior).state;
    if (state === 'hiding') {
      if (koopa.get(Behavior).hideTime > 3) {
        return wakeAnimation(koopa.get(Behavior).hideTime);
      }

      return 'hiding';
    }

    if (state === 'panic') {
      return 'hiding';
    }

    return walkAnimation(koopa.lifetime);
  }

  function drawKoopa(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();

    koopa.size.set(16, 16);
    koopa.offset.set(0, 8);

    koopa.addTrait(new Physics());
    koopa.addTrait(new Solid());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Killable());
    koopa.addTrait(new Behavior());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
