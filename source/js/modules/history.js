import * as THREE from 'three';
import { gsap } from "gsap";

export default async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Вершинный шейдер
  const vertexShader = `
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}
`;

  // Фрагментный шейдер
  const fragmentShader = `
precision mediump float;

uniform sampler2D map;
uniform float degree; // сила сдвига [0..1]

#define NUM_BUBBLES 3
uniform vec2  uCenters[NUM_BUBBLES];   // центры в UV (0..1)
uniform float uRadii[NUM_BUBBLES];     // радиусы в UV
uniform float uStrengths[NUM_BUBBLES]; // 0..1 сила искажения

varying vec2 vUv;

// вспомогательная функция RGB->HSV
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz),
               vec4(c.gb, K.xy),
               step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r),
               vec4(c.r, p.yzx),
               step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0*d + e)),
              d / (q.x + e),
              q.x);
}

// вспомогательная функция HSV->RGB
vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp( abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),
                    6.0) - 3.0) - 1.0,
                    0.0,
                    1.0 );
  return c.z * mix(vec3(1.0), rgb, c.y);
}

// -------- пузырь (bulge) -----
vec2 warpBubble(vec2 uv, vec2 center, float radius, float strength){
  vec2 d = uv - center;
  float r = length(d);
  if (r > radius || radius <= 0.0) return uv;
  float nd = r / radius;                  // 0..1
  float k = 1.0 - strength * (1.0 - nd*nd); // мягкий профиль: центр растягивается
  vec2 warped = center + d * k;
  return clamp(warped, vec2(0.0), vec2(1.0));
}

void main() {
  // 1) применяем 3 пузырика к UV
  vec2 uv = vUv;
  for (int i = 0; i < NUM_BUBBLES; i++){
    uv = warpBubble(uv, uCenters[i], uRadii[i], uStrengths[i]);
  }

  // 2) выборка текстуры
  vec4 texel = texture2D(map, uv);

  // 3) Hue-сдвиг: синий (~0.666) в сторону голубого (~0.5) на ~0.166 * degree
  vec3 hsv = rgb2hsv(texel.rgb);
  hsv.x += degree * 0.1; // 0.1 ~ 36° на цветовом круге
  hsv.x = mod(hsv.x, 1.0); // чтобы не вышло за диапазон [0..1]
  // обратно в RGB
  vec3 rgb = hsv2rgb(hsv);

  gl_FragColor = vec4(rgb, texel.a);
}
`;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(new THREE.Color(0x5f458c), 0.6);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector(`.animation-screen`).appendChild(renderer.domElement);

  // начальное положение камеры
  camera.position.z = 2.6;

  const loadManager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(loadManager);
  const sources = [
    `/img/module-5/scenes-textures/scene-0.png`,
    `/img/module-5/scenes-textures/scene-1.png`,
    `/img/module-5/scenes-textures/scene-2.png`,
    `/img/module-5/scenes-textures/scene-3.png`,
    `/img/module-5/scenes-textures/scene-4.png`,
  ];

  const gap = 0.4;
  const targetHeight = 2.2;
  const materials = sources.map((link, index) => {
    const hasBubble = index === 2;
    const bubbleCenters = hasBubble
      ? [
        new THREE.Vector2(0.30, 0.55),
        new THREE.Vector2(0.65, 0.40),
        new THREE.Vector2(0.50, 0.75)
      ]
      : [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.0, 0.0)
      ];

    const bubbleRadii = hasBubble ? [0.18, 0.2, 0.15] : [0.0, 0.0, 0.0];
    const bubbleStrengths = hasBubble ? [0.65, 0.85, 0.60] : [0.0, 0.0, 0.0];

    return new THREE.RawShaderMaterial({
      uniforms: {
        map: { value: loader.load(link) },
        degree: { value: 0.0 },
        uCenters: { value: bubbleCenters },
        uRadii: { value: bubbleRadii },
        uStrengths: { value: bubbleStrengths }
      },
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader,
    });
  });

  // Вставляем слайды
  const meshes = [];
  loadManager.onLoad = () => {
    let lastPosition = 0;

    materials.forEach((material, i) => {
      const { width, height } = material.uniforms.map.value.image;
      const aspect = width / height;
      const planeH = targetHeight;
      const planeW = planeH * aspect;
      const geo = new THREE.PlaneGeometry(planeW, planeH);
      const mesh = new THREE.Mesh(geo, material);

      if (i <= 1) {
        mesh.position.z = -i * (planeW + gap);
        lastPosition = mesh.position.z;
      } else {
        mesh.position.z = lastPosition;
        mesh.position.x = planeW * (i - 1);
      }

      scene.add(mesh);
      meshes.push(mesh);
    });
  };

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  window.addEventListener(`resize`, () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.body.addEventListener(`screenChanged`, (e) => {
    if (meshes.length <= 0) {
      return;
    }

    if (e.detail.screenName === `story` && camera.position.z === 2.6) {
      gsap.to(camera.position, {
        z: -2.2,
        duration: 2,
        ease: `power2.inOut`
      });
    } else {
      camera.position.z = 2.6;
    }
  });

  const storyElement = document.getElementById(`story`);
  const bubbleMaterial = materials[2];
  const bubbleCenter = bubbleMaterial ? bubbleMaterial.uniforms.uCenters.value[1] : null;
  const initialBubbleCenter = bubbleCenter ? bubbleCenter.clone() : null;
  const bubbleSwingAmplitude = 0.12;
  let bubbleRiseTween = null;
  let bubbleSwingTween = null;

  storyElement.addEventListener(`slideChanged`, (e) => {
    const index = e.detail.swiper.snapIndex;

    gsap.to(camera.position, {
      x: index * 4.4,
      duration: 2,
      ease: `power2.inOut`
    });

    if (index === 1) {
      gsap.to(materials[2].uniforms.degree, {
        value: 0.2,
        duration: 2,
        delay: 1.8,
      });

      if (bubbleCenter) {
        if (bubbleRiseTween) {
          bubbleRiseTween.kill();
        }
        if (bubbleSwingTween) {
          bubbleSwingTween.kill();
        }

        bubbleRiseTween = gsap.to(bubbleCenter, {
          y: 1.15,
          duration: 3,
          repeat: -1,
          ease: `none`
        });

        bubbleSwingTween = gsap.to(bubbleCenter, {
          x: bubbleCenter.x + bubbleSwingAmplitude,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: `sine.inOut`
        });
      }
    } else {
      gsap.to(materials[2].uniforms.degree, {
        value: 0.0,
        duration: 2,
      });

      if (bubbleCenter && initialBubbleCenter) {
        if (bubbleRiseTween) {
          bubbleRiseTween.kill();
        }
        if (bubbleSwingTween) {
          bubbleSwingTween.kill();
        }
        bubbleCenter.copy(initialBubbleCenter);
      }
    }
  });
};
