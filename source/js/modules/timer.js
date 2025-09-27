export default class FrameTimer {
  constructor({
    fps = 1,
    duration = 5000,
    delay = 0,
    callback = () => { },
    endCallback = () => { }
  } = {}) {
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
    this.duration = duration;
    this.delay = delay;
    this.callback = callback;
    this.endCallback = endCallback;

    this._requestId = null;
    this._startTime = null;
    this._now = null;
    this._lastTick = null;
    this._elapsed = null;

    this.tick = this.tick.bind(this);
  }

  tick() {
    this._requestId = requestAnimationFrame(this.tick);

    // проверяем, сколько времени прошло с предыдущего запуска
    this._now = Date.now();
    this._elapsed = this._now - this._lastTick;

    // проверяем, достаточно ли прошло времени с предыдущей отрисовки кадра
    if (this._elapsed > this.fpsInterval) {
      // сохранение времени текущей отрисовки кадра
      this._lastTick = this._now - (this._elapsed % this.fpsInterval);

      // запуск функции отрисовки
      this.callback({
        timePassed: this._now - this._startTime,
        fps: this.fps,
        duration: this.duration,
        delay: this.delay
      });
    }

    if (this.duration < this._now - this._startTime) {
      this.stop();
    }
  }

  start() {
    setTimeout(() => {
      this._startTime = Date.now();
      this._lastTick = this._startTime;
      this._requestId = requestAnimationFrame(this.tick);
    }, this.delay);
  }

  stop() {
    if (this._requestId) {
      cancelAnimationFrame(this._requestId);
      this._requestId = null;
    }

    this.endCallback();
  }
}
