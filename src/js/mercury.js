import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const mercGroup = new THREE.Group();
mercGroup.rotation.z = (-0.03 * Math.PI) / 180;
scene.add(mercGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/mercury/mercurymap.jpg"),
});

const mercMesh = new THREE.Mesh(geometry, material);
mercGroup.add(mercMesh);

const stars = getStarfield({ numStars: 100 });
scene.add(stars);

const light = new THREE.AmbientLight();
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 5);
sunlight.position.set(-4, 0.5, 1.5);
scene.add(sunlight);

function animate() {
    requestAnimationFrame(animate);

    mercMesh.rotation.y += 0.0005;
    stars.rotation.y -= 0.0005;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
