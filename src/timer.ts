export class Timer {
  private updateProxy = (_time: number) => {};
  private updateFn = (_deltaTime: number) => {};
  // fixme: remove later, this is just for developers convenience
  private frame: number | null = null;

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

    // fixme: remove later, this is just for developers convenience
    window.addEventListener('keydown', event => {
      const { code } = event;
      if (code === 'Escape') {
        cancelAnimationFrame(this.frame!);
      }
    });
  }

  start() {
    this.enqueue();
  }

  setUpdateFn(fn: (deltaTime: number) => void) {
    this.updateFn = fn;
  }

  private enqueue() {
    this.frame = requestAnimationFrame(this.updateProxy);
  }
}
