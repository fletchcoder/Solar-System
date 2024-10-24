import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 2.1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

const venusGroup = new THREE.Group();
venusGroup.rotation.z = (2.64 * Math.PI) / 180;
scene.add(venusGroup);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/venus/venusmap.jpg"),
    bumpMap: loader.load("/src/images/textures/planets/venus/venusbump.jpg"),
    bumpScale: 1,
});

const venusMesh = new THREE.Mesh(geometry, material);
venusGroup.add(venusMesh);

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(-10, 0.5, 1.5);
scene.add(sunlight);

const stars = getStarfield({ numStars: 300 });
scene.add(stars);

function animate() {
    requestAnimationFrame(animate);

    venusGroup.rotation.y -= 0.000125;
    stars.rotation.y += 0.000125;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
