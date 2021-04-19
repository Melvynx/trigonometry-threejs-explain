import './style.css';
import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
  new THREE.LineBasicMaterial({ color: '#f1c40f' })
);
scene.add(mesh);

const mesh2 = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(0.3, 0.3, 0.3)),
  new THREE.LineBasicMaterial({ color: '#2ecc71' })
);
scene.add(mesh2);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

let time = Date.now();
let isLimite = false;

function tick() {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  console.log('deltaTime:', deltaTime);

  time = currentTime;

  mesh.rotation.y += 0.0005 * deltaTime;
  mesh2.rotation.x += 0.0001 * deltaTime;
  mesh2.rotation.y += 0.0003 * deltaTime;

  if (mesh.scale.y >= 2) {
    if (isLimite) isLimite = false;
  } else if (mesh.scale.y <= 1) {
    if (!isLimite) isLimite = true;
  }

  if (isLimite) mesh.scale.y += 0.0001 * deltaTime;
  else mesh.scale.y -= 0.0001 * deltaTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
