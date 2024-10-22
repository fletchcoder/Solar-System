import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const jupGroup = new THREE.Group();
jupGroup.rotation.z = (-3.13 * Math.PI) / 180;
scene.add(jupGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1.8, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/jupiter/jupitermap.jpg"),
});

const jupMesh = new THREE.Mesh(geometry, material);
jupGroup.add(jupMesh);

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const stars = getStarfield({ numStars: 500 });
scene.add(stars);

const sunlight = new THREE.DirectionalLight(0xffffff, 1.2);
sunlight.position.set(-10, 0.5, 1.5);
scene.add(sunlight);

function animate() {
    requestAnimationFrame(animate);

    jupMesh.rotation.y += 0.006;
    stars.rotation.y -= 0.006;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener("resize", handleWindowResize, false);
