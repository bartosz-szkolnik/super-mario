export type Animation<T extends string[] = string[]> = (distance: number) => T[number];

export function createAnimation<T extends string[]>(frames: T, frameLength: number): Animation<T> {
  return function resolveFrame(distance: number) {
    const frameIndex = Math.floor((distance / frameLength) % frames.length);
    const frameName = frames[frameIndex];

    return frameName;
  };
}
