import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 3.2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const saturnGroup = new THREE.Group();
saturnGroup.rotation.z = (-26.73 * Math.PI) / 180;
scene.add(saturnGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1.5, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/saturn/saturnmap.jpg"),
});

const saturnMesh = new THREE.Mesh(geometry, material);
saturnGroup.add(saturnMesh);

const ringGeometry = new THREE.RingGeometry(1.8, 2.2, 75, 1, 5, 6.8);
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xf9edd0,
    side: THREE.DoubleSide,
});

const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.rotation.x = 26.73;
ringMesh.rotation.y = (-26.73 * Math.PI) / 180;
scene.add(ringMesh);

const outerRingGeometry = new THREE.RingGeometry(2.3, 2.4, 75, 1, 5, 6.8);
const outerRingMaterial = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/saturn/saturnringcolor.jpg"),
    side: THREE.DoubleSide,
});

const outerMesh = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
outerMesh.rotation.x = 26.73;
outerMesh.rotation.y = (-26.73 * Math.PI) / 180;
scene.add(outerMesh);

const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(-14, 0.5, 1.5);
scene.add(sunlight);

const stars = getStarfield({ numStars: 600 });
scene.add(stars);

function animate() {
    requestAnimationFrame(animate);

    ringMesh.rotation.z += 2;
    outerMesh.rotation.z += 10;
    saturnMesh.rotation.y += 0.0055;
    stars.rotation.y -= 0.0055;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener("resize", handleWindowResize, false);
