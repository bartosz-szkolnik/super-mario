export type TileSpec =
  | {
      type: 'TILE';
      name: 'ground' | 'sky';
      behavior?: 'ground';
      ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
    }
  | TilePatternSpec;

export type TilePatternSpec = {
  type: 'PATTERN';
  pattern: string;
  behavior?: 'ground';
  ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
};

export type LevelSpec = {
  spriteSheet: string;
  layers: { tiles: TileSpec[] }[];
  patterns: Record<string, { tiles: TileSpec[] }>;
  entities: { name: 'goomba' | 'koopa'; pos: [number, number] }[];
};

export type SpriteSpec = {
  imageUrl: string;
  tileWidth: number;
  tileHeight: number;
  tiles?: {
    name: 'ground' | 'sky';
    index: [number, number];
  }[];
  frames?: {
    name: 'idle' | 'run-1' | 'run-2' | 'run-3' | 'break' | 'jump';
    rect: [number, number, number, number];
  }[];
  animations?: {
    name: 'chance';
    frameLength: number;
    frames: string[];
  }[];
};
