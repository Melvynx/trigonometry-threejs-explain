import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import colorTexture from './img/textures/metaltrim/color.jpg';
import heightTexture from './img/textures/metaltrim/height.png';
import normalTexture from './img/textures/metaltrim/normal.jpg';
import roughnessTexture from './img/textures/metaltrim/roughness.jpg';
import metallicTexture from './img/textures/metaltrim/metallic.jpg';
import opacityTexture from './img/textures/metaltrim/opacity.jpg';
import aoTexture from './img/textures/metaltrim/ambientOcclusion.jpg';

const textureLoader = new THREE.TextureLoader();
const metaltrimColor = textureLoader.load(colorTexture);
const metaltrimHeight = textureLoader.load(heightTexture);
const metaltrimNormal = textureLoader.load(normalTexture);
const metaltrimRougness = textureLoader.load(roughnessTexture);
const metaltrimMetalness = textureLoader.load(metallicTexture);
const metaltrimAlpha = textureLoader.load(opacityTexture);
const metaltrimAmbientOcclusion = textureLoader.load(aoTexture);

const gui = new dat.GUI();
gui.width = 400;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// light
const ambiantLight = new THREE.AmbientLight('#ffffff', 0.5);
const pointLight = new THREE.PointLight('#ffffff', 0.5);
const pointLight2 = new THREE.PointLight('#ffff22', 0.5);
const pointLight3 = new THREE.PointLight('#dd11bb', 0.5);
pointLight.position.set(2, 2, 2);
pointLight2.position.set(-2, -2, 2);
pointLight3.position.set(-2, 2, -2);

// const ph = new THREE.PointLightHelper(pointLight3);

scene.add(ambiantLight, pointLight, pointLight2, pointLight3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 16, 16),
  new THREE.MeshStandardMaterial({
    map: metaltrimColor,
    normalMap: metaltrimNormal,
    aoMap: metaltrimAlpha,
    transparent: true,
    roughnessMap: metaltrimRougness,
    metalnessMap: metaltrimMetalness,
  })
);
cube.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(cube.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ color: '#333333' })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

const axes = new THREE.AxesHelper(10);

scene.add(cube, plane, axes);

const parameters = {
  hAmplitude: 1,
  hPeriode: 1,
  dephassage: 0,
  valeurMediane: 0,
  vAmplitude: 1,
  vPeriode: 1,
  activateRound: true,
  activateVerticale: false,
  activateHorizontalX: true,
  activateHorizontalZ: true,
  vAbs: false,
  hAbs: false,
};
gui.add(parameters, 'hAmplitude', 0, 10, 0.01).name('Amplitude horizontal');
gui.add(parameters, 'vAmplitude', 0, 10, 0.01).name('Amplitude vertical');
gui.add(parameters, 'vPeriode', 0, 10, 0.01).name('Periode vertical');
gui.add(parameters, 'hPeriode', 0, 10, 0.01).name('Periode horizontal');
gui.add(parameters, 'dephassage', 0, 10, 0.01).name('Dephassage general');
gui.add(parameters, 'valeurMediane', -10, 10, 0.01).name('Valeurmédiane general');
gui.add(parameters, 'activateRound').name('Activé la rotation');
gui.add(parameters, 'activateVerticale').name('Activé la bond verticale');
gui.add(parameters, 'activateHorizontalX').name('Activé la rotation X');
gui.add(parameters, 'activateHorizontalZ').name('Activé la rotation Z');
gui.add(parameters, 'vAbs').name('ABS: vertical');
gui.add(parameters, 'hAbs').name('ABS: horizontal');
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const {
    hAmplitude,
    hPeriode,
    dephassage,
    valeurMediane,
    activateRound,
    activateVerticale,
    vAbs,
    hAbs,
    vPeriode,
    vAmplitude,
    activateHorizontalX,
    activateHorizontalZ,
  } = parameters;

  if (activateRound) {
    if (activateHorizontalX) {
      cube.position.x =
        hAmplitude * Math.cos(hPeriode * elapsedTime + dephassage) + valeurMediane;
    }
    if (activateHorizontalZ) {
      cube.position.z =
        hAmplitude * Math.sin(hPeriode * elapsedTime + dephassage) + valeurMediane;
    }
    if (hAbs) {
      cube.position.z = Math.abs(cube.position.z);
      cube.position.x = Math.abs(cube.position.x);
    }
  }

  if (activateVerticale) {
    if (!vAbs) {
      cube.position.y =
        vAmplitude * Math.sin(vPeriode * elapsedTime + dephassage) + valeurMediane;
    } else {
      cube.position.y = Math.abs(
        vAmplitude * Math.sin(vPeriode * elapsedTime + dephassage) + valeurMediane
      );
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
