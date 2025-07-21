
import FrameTimer from './timer';

export default () => {
  const gameTimer = new FrameTimer({
    fps: 1,
    delay: 1,
    duration: 5 * 60 * 1000,
    callback: ({ timePassed }) => {
      const passedSeconds = timePassed / 1000;
      const elMinute = document.querySelector(`.game__counter span:first-child`);
      const elSecond = document.querySelector(`.game__counter span:nth-child(2)`);

      // const remaining = Math.max(0, duration - timePassed);
      // const totalSeconds = Math.floor(remaining / 1000);
      const minutes = Math.floor(passedSeconds / 60);
      const seconds = Math.floor(passedSeconds % 60);

      if (elMinute) {
        elMinute.textContent = String(minutes).padStart(2, `0`);
      }

      if (elSecond) {
        elSecond.textContent = String(seconds).padStart(2, `0`);
      }
    },
    endCallback: () => {
      const btnResult = document.querySelector(`.js-show-result[data-target="result3"]`);

      btnResult.dispatchEvent(new Event(`click`));
    }
  });


  gameTimer.start();
};
