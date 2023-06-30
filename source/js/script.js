// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import AccentTypographyBuild from './modules/accent-typography-builder';

// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

class App {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener(`load`, () => {
      this.onPageLoad();
    });
  }

  onPageLoad() {
    let body = document.querySelector(`body`);
    body.classList.add(`page--loaded`);

    const animationTopScreenIntroTitle = new AccentTypographyBuild(`.intro__title`, 500, `text-animate`, `transform`, 500);
    animationTopScreenIntroTitle.runAnimation();

    const animationTopScreenIntroDate = new AccentTypographyBuild(`.intro__date`, 500, `text-animate`, `transform`, 1600);
    animationTopScreenIntroDate.runAnimation();

    const animationTopScreenSliderItemTitle = new AccentTypographyBuild(`.slider__item-title`, 500, `text-animate`, `transform`, 100);
    animationTopScreenSliderItemTitle.runAnimation();

    const animationTopScreenSliderPrizesTitle = new AccentTypographyBuild(`.prizes__title`, 500, `text-animate`, `transform`, 100);
    animationTopScreenSliderPrizesTitle.runAnimation();

    const animationTopScreenSliderRulesTitle = new AccentTypographyBuild(`.rules__title`, 500, `text-animate`, `transform`, 100);
    animationTopScreenSliderRulesTitle.runAnimation();

    const animationTopScreenSliderGameTitle = new AccentTypographyBuild(`.game__title`, 500, `text-animate`, `transform`, 100);
    animationTopScreenSliderGameTitle.runAnimation();
  }
}

const APP = new App();
