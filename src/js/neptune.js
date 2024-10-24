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

new OrbitControls(camera, renderer.domElement);

const nepGroup = new THREE.Group();
nepGroup.rotation.z = (-28.32 * Math.PI) / 180;
scene.add(nepGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/neptune/neptunemap.jpg"),
});

const nepMesh = new THREE.Mesh(geometry, material);
nepGroup.add(nepMesh);

const stars = getStarfield({ numStars: 450 });
scene.add(stars);

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
sunlight.position.set(-6, 0.5, 1.5);
scene.add(sunlight);

function animate() {
    requestAnimationFrame(animate);

    nepMesh.rotation.y += 0.0013;
    stars.rotation.y -= 0.0013;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
