import type { Level } from './types';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image), { once: true });
    image.src = url;
  });
}

export async function loadLevel(name: string): Promise<Level> {
  return (await fetch(`assets/levels/${name}.json`)).json();
}
