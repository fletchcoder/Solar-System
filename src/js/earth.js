import * as THREE from "three";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

new OrbitControls(camera, renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.44 * Math.PI) / 180;
scene.add(earthGroup);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshPhongMaterial({
    map: loader.load("/src/images/textures/planets/earth/earthmap1k.jpg"),
    specularMap: loader.load(
        "/src/images/textures/planets/earth/earthspec1k.jpg"
    ),
    bumpMap: loader.load("/src/images/textures/planets/earth/earthbump1k.jpg"),
    bumpScale: 2,
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/earth/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("/src/images/textures/planets/earth/earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const glowMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, glowMat);
glowMesh.scale.setScalar(1.005);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 300 });
scene.add(stars);

const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 1.8);
sunlight.position.set(-2, 1, 1.5);
scene.add(sunlight);

function animate() {
    requestAnimationFrame(animate);

    cloudsMesh.rotation.y += 0.0025;
    earthMesh.rotation.y += 0.002;
    glowMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.002;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener("resize", handleWindowResize, false);
