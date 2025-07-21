
import FrameTimer from './timer';

export default () => {
  const prizesJourneysTimer = new FrameTimer({
    fps: 60,
    duration: 1000,
    callback: ({ timePassed, duration }) => {
      const elNum = document.querySelector(`.prizes__item--journeys .prizes__desc > b`);
      const progress = Math.min(timePassed / duration, 1);
      const value = Math.floor(progress * 3);

      if (elNum) {
        elNum.textContent = value;
      }
    },
  });

  const prizesCasesTimer = new FrameTimer({
    fps: 60,
    delay: 3500,
    duration: 1000,
    callback: ({ timePassed, duration }) => {
      const elNum = document.querySelector(`.prizes__item--cases .prizes__desc > b`);
      const progress = Math.min(timePassed / duration, 1);
      const value = Math.floor(progress * 7);

      if (elNum) {
        elNum.textContent = value;
      }
    },
  });

  const prizesCodesTimer = new FrameTimer({
    fps: 60,
    delay: 6500,
    duration: 1000,
    callback: ({ timePassed, duration }) => {
      const elNum = document.querySelector(`.prizes__item--codes .prizes__desc > b`);
      const progress = Math.min(timePassed / duration, 1);
      const value = Math.floor(progress * 900);

      if (elNum) {
        elNum.textContent = value;
      }
    },
  });

  const startAnimation = () => {
    prizesJourneysTimer.start();
    prizesCasesTimer.start();
    prizesCodesTimer.start();
  };

  const setHandler = () => {
    const menuItems = document.querySelectorAll(`.js-menu-link`);

    if (menuItems) {
      menuItems.forEach((element) => {
        element.addEventListener(`click`, () => {
          if (element.dataset.href === `prizes`) {
            startAnimation();
          }
        });
      });
    }
  };

  setHandler();

  document.addEventListener(`DOMContentLoaded`, () => {
    const menuActiveItem = document.querySelector(`.js-menu-link.active`);

    if (menuActiveItem.dataset.href === `prizes`) {
      startAnimation();
    }
  });
};
