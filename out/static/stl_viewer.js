import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
const canvas = document.getElementById("model-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / (canvas.clientHeight),
    0.1,
    1000
);
camera.position.z = 100;
// scene.background = new THREE.Color( 0x091010 );
scene.background = new THREE.Color( 0x222222 );

scene.add(new THREE.AmbientLight(0xffffff, 0.1));
const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(-3, -3, 3);
light.position.set(0, 0, 10);
scene.add(light);

const loader = new STLLoader();
const geom_path = canvas.dataset.geom
// alert(geom_path);
// const geom_path = '../asset/guitar_mute_C-hole.stl'
const geometry = await loader.loadAsync(
    geom_path
)

// const surf = new THREE.MeshStandardMaterial({ color: 0xa0a0aa })
// const surf = new THREE.MeshNormalMaterial({ color: 0xa0a0aa })
const surf = new THREE.MeshLambertMaterial({ color: 0xa0a0aa })

const mesh = new THREE.Mesh(
    geometry,
    surf,
);
scene.add(mesh);

let isDragging = false;
let prevX = 0;
let prevY = 0;
let pX = 0;
let pY = 0;
let rotate = true;
canvas.addEventListener("mousedown", (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; rotate=false;});
window.addEventListener("mouseup", () => (isDragging = false));
window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    mesh.rotation.y += (e.clientX - prevX) * 0.01;
    pX = (e.clientX - prevX) * 0.01;
    prevX = e.clientX;
    mesh.rotation.x += (e.clientY - prevY) * 0.01;
    pY = (e.clientY - prevY) * 0.01;
    prevY = e.clientY;
});
canvas.addEventListener('dblclick', () => {
    rotate = true;
    mesh.rotation.x = 0;
    // mesh.rotation.y = 0;
});
// canvas.addEventListener("mousewheel", function (e) {
//   e.preventDefault();
//   e.stopPropagation();
// }, false);
// canvas.addEventListener("scroll", function (e){
//     mesh.rotation.x = window.scrollY;
// });

function onWindowResize() {
    camera.aspect = canvas.clientWidth / (canvas.clientHeight);
    camera.updateProjectionMatrix();
    renderer.setSize( canvas.clientWidth, canvas.clientHeight);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    if(rotate){
        mesh.rotation.y += 0.003;
    }
    // // fake momentum
    // if (pX**2 > 0.002){
    //     pX -= (pX - 0.00015)*0.1;
    // }
    // if (pY**2 > 0.002){
    //     mesh.rotation.x -= (mesh.rotation.x - 0)*0.01;
    //     // pY *= 0.9;
    // }
    // if (pX**2 < 0.0015**2) mesh.rotation.y += 0.0015;
    pX *= 0.945;
    pY *= 0.945;
    mesh.rotation.y += pX;
    mesh.rotation.x += pY;
    renderer.render(scene, camera);
}
animate();