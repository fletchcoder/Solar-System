import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 2.5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const marsGroup = new THREE.Group();
marsGroup.rotation.z = (-25.19 * Math.PI) / 180;
scene.add(marsGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/mars/marsmap1k.jpg"),
    bumpMap: loader.load("/src/images/textures/planets/mars/marsbump1k.jpg"),
    bumpScale: 1.004,
});

const marsMesh = new THREE.Mesh(geometry, material);
marsGroup.add(marsMesh);

const stars = getStarfield({ numStars: 400 });
scene.add(stars);

const light = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 1.5);
sunlight.position.set(-2, 0.5, 1.5);
scene.add(sunlight);

function animate() {
    requestAnimationFrame(animate);

    marsMesh.rotation.y += 0.0025;
    stars.rotation.y -= 0.0025;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
