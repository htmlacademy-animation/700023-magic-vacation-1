import Animation from './animation.js';
import Scene2D from './scene-2d.js';
import _ from './utils.js';


const IMAGES_URLS = Object.freeze({
  plane: `./img/module-4/win-primary-images/airplane.png`,
  tree: `./img/module-4/win-primary-images/tree.png`,
  tree2: `./img/module-4/win-primary-images/tree 2.png`,
  ice: `./img/module-4/win-primary-images/ice.png`,
  seaCalf: `./img/module-4/win-primary-images/sea-calf-2.png`,
  snowflake: `./img/module-4/win-primary-images/snowflake.png`
});


const OBJECTS = Object.freeze({
  plane: {
    imageId: `plane`,
    x: 90,
    y: 50,
    size: 10,
    opacity: 0,
    transforms: {
      translateY: -10
    }
  },
  tree: {
    imageId: `tree`,
    x: 65,
    y: 62,
    size: 5,
    opacity: 0,
    transforms: {
      translateY: 30
    }
  },
  tree2: {
    imageId: `tree2`,
    x: 60,
    y: 60,
    size: 5,
    opacity: 0,
    transforms: {
      translateY: 30
    }
  },
  ice: {
    imageId: `ice`,
    x: 50,
    y: 70,
    size: 50,
    opacity: 0,
    transforms: {
      translateY: 30
    }
  },
  seaCalf: {
    imageId: `seaCalf`,
    x: 50,
    y: 60,
    size: 50,
    opacity: 0,
    transforms: {
      translateY: 30
    }
  },
  snowflake: {
    imageId: `snowflake`,
    x: 25,
    y: 55,
    size: 30,
    opacity: 0,
    transforms: {
      rotate: -30
    }
  },
  snowflake2: {
    imageId: `snowflake`,
    x: 75,
    y: 65,
    size: 15,
    opacity: 0,
    transforms: {
      rotate: 30,
      scaleX: -1
    }
  },
});


const LOCALS = Object.freeze({
  blob: {
    centerX: 45,
    centerY: 55,
    radius: 15,
    endX: 87,
    endY: 53,
    angle: 45,
    deltasLength: 10,
    opacity: 0
  }
});


export default class Scene2DSeaCalf extends Scene2D {
  constructor() {
    const canvas = document.getElementById(`sea-calf-scene`);

    super({
      canvas,
      objects: OBJECTS,
      locals: LOCALS,
      imagesUrls: IMAGES_URLS,
    });

    this.initLocals();

    this.afterInit = () => {
      this.objects.plane.before = this.drawBlob.bind(this);
    };

    this.initEventListeners();
    this.initObjects(OBJECTS);
    this.initLocals();
    this.start();
    this.updateSize();
  }


  initLocals() {
    this.locals = {
      blob: {
        centerX: LOCALS.blob.centerX,
        centerY: LOCALS.blob.centerY,
        radius: LOCALS.blob.radius,
        endX: LOCALS.blob.endX,
        endY: LOCALS.blob.endY,
        angle: LOCALS.blob.angle,
        deltasLength: LOCALS.blob.deltasLength,
        opacity: LOCALS.blob.opacity
      }
    };
  }


  initEventListeners() {
    window.addEventListener(`resize`, this.updateSize.bind(this));
  }


  initAnimations() {
    this.animations.push(new Animation({
      func: () => {
        this.drawScene();
      },
      duration: `infinite`,
      fps: 60
    }));

    this.initPlaneAnimations();
    this.initBlobAnimations();
    this.initTreesAnimations();
    this.initSeaCalfAnimations();
    this.initSnowflakesAnimations();
  }


  initPlaneAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.plane.transforms.translateX = -40 * progressReversed;
        this.objects.plane.transforms.translateY =
          5 * Math.sin(Math.PI * progressReversed) - 15 * progressReversed;
        this.objects.plane.transforms.rotate =
          45 * Math.sin(Math.PI * progressReversed) + 45 * progressReversed;
        this.objects.plane.opacity = progress;
      },
      duration: 500,
      delay: 1200,
      easing: _.easeInQuad
    }));
  }


  initBlobAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.locals.blob.radius = 15 * progress;
        this.locals.blob.centerY = 55 - 15 * progressReversed;
        this.locals.blob.endX = 87 - 35 * progressReversed;
        this.locals.blob.endY = 53 - 12 * progressReversed;
        this.locals.blob.angle = 40 + 120 * progressReversed;
        this.locals.blob.deltasLength = 10 * progress;
        this.locals.blob.opacity = progress;
      },
      duration: 500,
      delay: 1200,
      easing: _.easeInQuad
    }));
  }


  initTreesAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.tree.transforms.translateY = 30 * (1 - progress);
        this.objects.tree.opacity = progress;
      },
      duration: 500,
      delay: 1200,
      easing: _.easeInQuad
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.tree2.transforms.translateY = 30 * (1 - progress);
        this.objects.tree2.opacity = progress;
      },
      duration: 500,
      delay: 1500,
      easing: _.easeInQuad
    }));
  }


  initSeaCalfAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.seaCalf.transforms.translateY = 30 * progressReversed;
        this.objects.seaCalf.transforms.rotate = -30 * Math.sin(progressReversed * 2);

        this.objects.ice.transforms.translateY = 30 * progressReversed;
        this.objects.ice.transforms.rotate = -30 * Math.sin(progressReversed * 2);
      },
      duration: 2000,
      delay: 1000,
      easing: _.easeOutElastic
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.seaCalf.opacity = progress;
        this.objects.ice.opacity = progress;
      },
      duration: 100,
      delay: 1000,
      easing: _.easeInQuad
    }));
  }


  initSnowflakesAnimations() {
    this.animations.push(new Animation({
      func: (progress, details) => {
        this.objects.snowflake.transforms.translateY =
          2 * Math.sin(1.5 * (details.currentTime - details.startTime) / 1000);
      },
      duration: `infinite`
    }));

    this.animations.push(new Animation({
      func: (progress, details) => {
        this.objects.snowflake2.transforms.translateY =
          2 * Math.sin(1.5 * (details.currentTime - details.startTime) / 1000);
      },
      duration: `infinite`,
      delay: 800
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.snowflake.opacity = progress;
      },
      duration: 500,
      delay: 1500,
      easing: _.easeInQuad
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.snowflake2.opacity = progress;
      },
      duration: 500,
      delay: 1900,
      easing: _.easeInQuad
    }));
  }


  drawBlob() {
    const b = this.locals.blob;
    const angle = b.angle * Math.PI / 180;

    if (b.opacity === 0) {
      return;
    }

    const s = this.size / 100;

    this.ctx.save();
    this.ctx.globalAlpha = b.opacity;
    this.ctx.fillStyle = `#acc3ff`;

    this.ctx.beginPath();
    this.ctx.arc(
      b.centerX * s,
      b.centerY * s,
      b.radius * s,
      Math.PI / 2,
      Math.PI * 3 / 2
    );
    this.ctx.bezierCurveTo(
      (b.centerX + 10) * s,
      (b.centerY - b.radius) * s,
      (b.endX - b.deltasLength * Math.sin(angle)) * s,
      (b.endY + b.deltasLength * Math.cos(angle)) * s,
      b.endX * s,
      b.endY * s
    );
    this.ctx.bezierCurveTo(
      (b.endX - b.deltasLength * Math.sin(angle)) * s,
      (b.endY + b.deltasLength * Math.cos(angle)) * s,
      (b.centerX + 10) * s,
      (b.centerY + b.radius) * s,
      b.centerX * s,
      (b.centerY + b.radius) * s
    );

    this.ctx.fill();
    this.ctx.restore();
  }
}
