export class SpriteSheet {
  private readonly tiles = new Map<string, HTMLCanvasElement>();

  constructor(private image: HTMLImageElement, private width: number, private height: number) {}

  define(name: string, x: number, y: number) {
    const { height, width, image } = this;

    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    buffer.getContext('2d')!.drawImage(
      image,
      x * width, // left cut
      y * height, // top cut
      width, // width of cut
      height, // height of cut
      0, // position x
      0, // position y
      width, // size of char in x
      height, // size of char in y
    );

    this.tiles.set(name, buffer);
  }

  draw(name: string, context: CanvasRenderingContext2D, x: number, y: number) {
    const buffer = this.tiles.get(name);
    if (!buffer) {
      throw new Error(`No tile exists under the name of ${name}`);
    }

    context.drawImage(buffer, x, y);
  }

  drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number) {
    const { width, height } = this;
    this.draw(name, context, x * width, y * height);
  }
}
