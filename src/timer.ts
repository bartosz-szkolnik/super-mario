export class Timer {
  private updateProxy = (_time: number) => {};
  private updateFn = (_deltaTime: number) => {};

  constructor(deltaTime = 1 / 60) {
    let accumulatedTime = 0;
    let lastTime = 0;

    this.updateProxy = (time: number) => {
      accumulatedTime += (time - lastTime) / 1000;
      while (accumulatedTime > deltaTime) {
        this.updateFn(deltaTime);
        accumulatedTime -= deltaTime;
      }

      this.enqueue();
      lastTime = time;
    };
  }

  start() {
    this.enqueue();
  }

  setUpdateFn(fn: (deltaTime: number) => void) {
    this.updateFn = fn;
  }

  private enqueue() {
    requestAnimationFrame(this.updateProxy);
  }
}
