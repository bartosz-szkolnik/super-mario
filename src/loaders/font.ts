import { loadImage } from '../loaders';
import { SpriteSheet } from '../spritesheet';

const CHARACTERS = ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ©!-×.';
const SIZE = 8;

export class Font {
  constructor(private sprites: SpriteSheet, public size: number) {}

  print(text: string, context: CanvasRenderingContext2D, x: number, y: number) {
    [...text.toUpperCase()].forEach((char, pos) => {
      this.sprites.draw(char, context, x + pos * this.size, y);
    });
  }
}

export async function loadFont() {
  const font = await loadImage('./assets/font.png');
  const fontSprite = new SpriteSheet(font, SIZE, SIZE);

  const rowLength = font.width;

  for (const [index, char] of [...CHARACTERS].entries()) {
    const x = (index * SIZE) % rowLength;
    const y = Math.floor((index * SIZE) / rowLength) * SIZE;

    fontSprite.define(char, x, y, SIZE, SIZE);
  }

  return new Font(fontSprite, SIZE);
}
