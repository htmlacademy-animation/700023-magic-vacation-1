import { set } from "lodash";

export default class AccentTypographyBuild {
  constructor(
    elementSelector,
    timer,
    classForActivate,
    property,
    delay = 0,
    timeOffsetDelta = 20
  ) {
    this.TIME_SPACE = 100;

    this.elementSelector = elementSelector;
    this.timer = timer;
    this.classForActivate = classForActivate;
    this.property = property;

    if (typeof this.elementSelector === `string`) {
      this.element = document.querySelector(this.elementSelector);
    } else {
      this.element = this.elementSelector;
    }

    this.timeOffsetDelta = timeOffsetDelta;
    this.delay = delay;

    this.prepareText(timeOffsetDelta);
  }


  createElement(letter, delta, wordLength) {
    const span = document.createElement(`span`);

    span.textContent = letter;
    span.classList.add('slogan__letter');
    span.style.transition = this.getTransition(this.getRandomInt(0, wordLength));

    return span;
  }


  getTransition(randomInt) {
    return `${this.property} ${this.timer}ms ease ${this.delay + (this.timeOffsetDelta * randomInt)}ms`;
  }


  prepareText(delta) {
    if (!this.element) {
      return;
    }

    const text = this.element.textContent.trim().split(/[\s]+/);

    const { length } = text;
    const content = text.reduce((fragmentParent, word, index) => {
      const wordElement = Array.from(word).reduce((fragment, letter) => {
        fragment.appendChild(this.createElement(letter, delta, word.length));
        return fragment;
      }, document.createDocumentFragment());

      const wordContainer = document.createElement(`span`);

      wordContainer.classList.add(`slogan__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);

      // Add Space text node:
      if (index < length - 1) fragmentParent.appendChild(document.createTextNode(` `));

      return fragmentParent;
    }, document.createDocumentFragment());

    this.element.innerHTML = ``;
    this.element.appendChild(content);
  }


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  runAnimation() {
    if (!this.element) {
      return;
    }

    setTimeout(() => {
      this.element.classList.add(this.classForActivate);
    }, 100);
  }

  destroyAnimation() {
    this.element.classList.remove(this.classForActivate);
  }
}
