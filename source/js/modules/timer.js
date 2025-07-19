export default () => {
  const menuLinks = document.querySelectorAll(`.js-menu-link`);
  const elMinute = document.querySelector(`.game__counter span:first-child`);
  const elSecond = document.querySelector(`.game__counter span:nth-child(2)`);

  let requestId = null;
  let startTime = null;
  const duration = 5000 * 60;
  let lastDrawnSecond = null;


  const draw = (timePassed) => {
    let remaining = Math.max(0, duration - timePassed);
    let totalSeconds = Math.floor(remaining / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (totalSeconds === lastDrawnSecond) {
      return;
    }

    lastDrawnSecond = totalSeconds;

    if (elMinute) {
      elMinute.textContent = String(minutes).padStart(2, `0`);
    }

    if (elSecond) {
      elSecond.textContent = String(seconds).padStart(2, `0`);
    }

  };

  const setTimer = () => {
    const now = Date.now();
    const timePassed = now - startTime;

    draw(timePassed);

    if (timePassed < duration) {
      requestId = requestAnimationFrame(setTimer);
    } else {
      requestId = null;
    }
  };

  const startAnimation = () => {
    startTime = Date.now();
    requestId = requestAnimationFrame(setTimer);
  };

  const stopAnimation = () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };

  menuLinks.forEach((link) => {
    link.addEventListener(`click`, (e) => {
      const target = e.target;

      if (target.classList.contains(`active`)) {
        return;
      }

      if (target.matches(`[data-href="game"]`)) {
        startAnimation();
      } else {
        stopAnimation();
      }
    });
  });

  // Если уже активен "game" при загрузке
  setTimeout(() => {
    const activeGameLink = document.querySelector(`.js-menu-link.active[data-href="game"]`);

    if (activeGameLink) {
      startTime = Date.now();
      requestId = requestAnimationFrame(setTimer);
    }
  }, 100);
};
