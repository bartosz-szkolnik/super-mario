export type TileSpec = {
  type: 'TILE';
  style: string;
  behavior?: 'ground' | 'brick' | 'coin';
  ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
};

export type PatternSpec = {
  type: 'PATTERN';
  pattern: string;
  ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
};

export type TilePatternSpec = TileSpec | PatternSpec;

export type TriggerSpec = {
  type: 'GOTO';
  name: string;
  pos: [number, number];
};

export type PipePortalPropsSpec = {
  dir: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';
  goesTo?: {
    name: string;
  };
  backTo?: string;
};

export type EntitySpec = {
  name: 'goomba-brown' | 'goomba-blue' | 'koopa-green' | 'koopa-blue';
  pos: [number, number];
};

export type PipePortalEntitySpec = {
  id?: string;
  name: 'pipe-portal';
  pos: [number, number];
  props: PipePortalPropsSpec;
};

export type LevelSpec = {
  spriteSheet: string;
  musicSheet: string;
  patternSheet: string;
  checkpoints: [number, number][];
  layers: { tiles: TilePatternSpec[] }[];
  entities: (EntitySpec | PipePortalEntitySpec)[];
  triggers: TriggerSpec[];
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
    name: 'idle' | 'run-1' | 'run-2' | 'run-3' | 'break' | 'jump' | 'climb-1';
    rect: [number, number, number, number];
  }[];
  animations?: {
    name: 'chance' | 'coin';
    frameLength: number;
    frames: string[];
  }[];
};

export type PatternSheetSpec = Record<string, { tiles: TilePatternSpec[] }>;

export type AudioSheetSpec = {
  fx: Record<string, { url: string }>;
};

export type MusicSheetSpec = {
  main: {
    url: string;
  };
  hurry: {
    url: string;
  };
};
