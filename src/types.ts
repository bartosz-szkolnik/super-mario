export type Background = {
  tile: string;
  ranges: [[number, number, number, number]];
};

export type LevelSpec = {
  backgrounds: Background[];
};
