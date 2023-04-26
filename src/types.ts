export type Background = {
  tile: 'ground' | 'sky';
  type?: 'ground';
  ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
};

export type LevelSpec = {
  spriteSheet: string;
  backgrounds: Background[];
};

export type SpriteSet = {
  imageUrl: string;
  tileWidth: number;
  tileHeight: number;
  tiles: {
    name: 'ground' | 'sky';
    index: [number, number];
  }[];
};
