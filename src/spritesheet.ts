import type { Animation } from './animation';

export class SpriteSheet {
  private readonly tiles = new Map<string, [HTMLCanvasElement, HTMLCanvasElement]>();
  private readonly animations = new Map<string, Animation>();

  constructor(private image: HTMLImageElement, private width: number, private height: number) {}

  define(name: string, x: number, y: number, width: number, height: number) {
    const sides = [false, true] as const;
    const buffers = sides.map(flip => {
      const buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      const context = buffer.getContext('2d')!;

      if (flip) {
        context.scale(-1, 1);
        context.translate(-width, 0);
      }

      context.drawImage(
        this.image,
        x, // left cut
        y, // top cut
        width, // width of cut
        height, // height of cut
        0, // position x
        0, // position y
        width, // size of char in x
        height, // size of char in y
      );

      return buffer;
    }) as [HTMLCanvasElement, HTMLCanvasElement];

    this.tiles.set(name, buffers);
  }

  defineTile(name: string, x: number, y: number) {
    const { width, height } = this;
    this.define(name, x * width, y * height, width, height);
  }

  defineAnimation(name: string, animation: Animation) {
    this.animations.set(name, animation);
  }

  draw(name: string, context: CanvasRenderingContext2D, x: number, y: number, flip = false) {
    const buffer = this.tiles.get(name);
    if (!buffer) {
      throw new Error(`No tile exists under the name of ${name}`);
    }

    context.drawImage(buffer[flip ? 1 : 0], x, y);
  }

  drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number) {
    const { width, height } = this;
    this.draw(name, context, x * width, y * height);
  }

  drawAnimation(name: string, context: CanvasRenderingContext2D, x: number, y: number, distance: number) {
    const animation = this.animations.get(name);
    if (!animation) {
      console.warn('Wanted to use animation that does not exist.');
      return;
    }

    this.drawTile(animation(distance), context, x, y);
  }

  getAnimation(name: string) {
    const animation = this.animations.get(name);
    if (!animation) {
      throw new Error('Wanted to use animation that does not exist.');
    }

    return animation;
  }

  hasAnimation(name: string) {
    return this.animations.has(name);
  }
}
