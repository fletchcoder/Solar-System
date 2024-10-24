import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { getFresnelRingMat } from "./getFresnelMat.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 2.2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const uranusGroup = new THREE.Group();
uranusGroup.rotation.z = (-82.23 * Math.PI) / 180;
scene.add(uranusGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/uranus/uranusmap.jpg"),
});

const uranusMesh = new THREE.Mesh(geometry, material);
uranusGroup.add(uranusMesh);

const outerRingGeometry = new THREE.RingGeometry(2.2, 2.3, 100, 1, 5, 10);
const outerRingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
});

const outerMesh = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
uranusGroup.add(outerMesh);

const middleRingGeometry = new THREE.RingGeometry(2, 2.2, 100, 1, 5, 10);
const middleRingMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b0b71,
    side: THREE.DoubleSide,
});

const middleMesh = new THREE.Mesh(middleRingGeometry, middleRingMaterial);
uranusGroup.add(middleMesh);

const innerRingGeometry = new THREE.RingGeometry(1.8, 2, 100, 1, 5, 10);
const innerRingMaterial = new THREE.MeshStandardMaterial({
    color: 0xa3abad,
    side: THREE.DoubleSide,
});

const innerMesh = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
uranusGroup.add(innerMesh);

const glowMat = getFresnelRingMat({ rimHex: 0xffffff, facingHex: 0xffffff });
const glowMesh = new THREE.Mesh(outerRingGeometry, glowMat);
glowMesh.scale.setScalar(1.045);
uranusGroup.add(glowMesh);

const stars = getStarfield({ numStars: 500 });
scene.add(stars);

const light = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
sunlight.position.set(-8, 0.5, 1.5);
scene.add(sunlight);

function animate() {
    requestAnimationFrame(animate);

    uranusMesh.rotation.y += 0.0015;
    stars.rotation.y -= 0.0015;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleWindowResize, false);
