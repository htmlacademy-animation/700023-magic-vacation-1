// export default () => {
//   const menuLinks = document.querySelectorAll(`.js-menu-link`);
//   const elMinute = document.querySelector(`.game__counter span:first-child`);
//   const elSecond = document.querySelector(`.game__counter span:nth-child(2)`);

import { log } from "three";

//   let requestId = null;
//   let startTime = null;
//   const duration = 5000 * 60;
//   let lastDrawnSecond = null;


//   const draw = (timePassed) => {
//     let remaining = Math.max(0, duration - timePassed);
//     let totalSeconds = Math.floor(remaining / 1000);
//     let minutes = Math.floor(totalSeconds / 60);
//     let seconds = totalSeconds % 60;

//     if (totalSeconds === lastDrawnSecond) {
//       return;
//     }

//     lastDrawnSecond = totalSeconds;

//     if (elMinute) {
//       elMinute.textContent = String(minutes).padStart(2, `0`);
//     }

//     if (elSecond) {
//       elSecond.textContent = String(seconds).padStart(2, `0`);
//     }
//   };

//   const setTimer = () => {
//     const now = Date.now();
//     const timePassed = now - startTime;

//     draw(timePassed);

//     if (timePassed < duration) {
//       requestId = requestAnimationFrame(setTimer);
//     } else {
//       requestId = null;
//     }
//   };

//   const startAnimation = () => {
//     startTime = Date.now();
//     requestId = requestAnimationFrame(setTimer);
//   };

//   const stopAnimation = () => {
//     if (requestId) {
//       cancelAnimationFrame(requestId);
//       requestId = null;
//     }
//   };

//   menuLinks.forEach((link) => {
//     link.addEventListener(`click`, (e) => {
//       const target = e.target;

//       if (target.classList.contains(`active`)) {
//         return;
//       }

//       if (target.matches(`[data-href="game"]`)) {
//         startAnimation();
//       } else {
//         stopAnimation();
//       }
//     });
//   });

//   // Если уже активен "game" при загрузке
//   setTimeout(() => {
//     const activeGameLink = document.querySelector(`.js-menu-link.active[data-href="game"]`);

//     if (activeGameLink) {
//       startTime = Date.now();
//       requestId = requestAnimationFrame(setTimer);
//     }
//   }, 100);
// };

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
