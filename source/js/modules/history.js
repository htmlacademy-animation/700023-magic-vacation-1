import * as THREE from 'three';
import { gsap } from "gsap";

export default async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

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
  const materials = sources.map((link) =>
    new THREE.MeshBasicMaterial({ map: loader.load(link), side: THREE.DoubleSide, transparent: true })
  );

  // Вставляем слайды
  const meshes = [];
  loadManager.onLoad = () => {
    materials.forEach((material, i) => {
      const { width, height } = material.map.image;
      const aspect = width / height;
      const planeH = targetHeight;
      const planeW = planeH * aspect;
      const geo = new THREE.PlaneGeometry(planeW, planeH);
      const mesh = new THREE.Mesh(geo, material);

      mesh.position.z = -i * (planeW + gap);
      scene.add(mesh);
      meshes.push(mesh);

      if (i === materials.length - 1) {
        lastSlideZ = mesh.position.z; // позиция самого дальнего слайда
      }
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
};
