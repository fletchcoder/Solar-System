import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";

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

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("../src/images/textures/stars/suntexture.png"),
});

const sunMesh = new THREE.Mesh(geometry, material);
sunGroup.add(sunMesh);

const fresnelMat = getFresnelMat({ rimHex: 0xfee707, facingHex: 0xfee707 });
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.005);
sunGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);

    sunMesh.rotation.y += 0.004;
    glowMesh.rotation.y += 0.004;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener("resize", handleWindowResize, false);
