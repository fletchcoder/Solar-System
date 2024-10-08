import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const sunGroup = new THREE.Group();
sunGroup.rotation.z = (-7.25 * Math.PI) / 180;
scene.add(sunGroup);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("../src/images/textures/stars/sunmap.jpg"),
});

const sunMesh = new THREE.Mesh(geometry, material);
sunGroup.add(sunMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
