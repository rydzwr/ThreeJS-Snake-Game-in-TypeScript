import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import * as CANNON from 'cannon-es'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from 'three'

const scene = new THREE.Scene();

// ------------------------ CREATE LIGHTS AND SHADOWS ------------------------

const light = new THREE.DirectionalLight();
light.position.set(25, 50, 25);
light.castShadow = true;
light.shadow.mapSize.width = 16384;
light.shadow.mapSize.height = 16384;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
light.shadow.camera.left = -100;
light.shadow.camera.right = 100;
scene.add(light);

// ------------------------ CAMERA ------------------------

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const chaseCam = new THREE.Object3D();
chaseCam.position.set(0, 0, 0);
const chaseCamPivot = new THREE.Object3D();
chaseCamPivot.position.set(0, 2, 4);
chaseCam.add(chaseCamPivot);
scene.add(chaseCam);

// ------------------------ RENDERER ------------------------

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const phongMaterial = new THREE.MeshPhongMaterial();

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// ------------------------ ORBIT CONTROLS (MOUSE) ------------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render);

// ------------------------ SETTING UP MATERIALS ------------------------

const groundMaterial = new CANNON.Material('groundMaterial');
groundMaterial.friction = -10;
groundMaterial.restitution = 0.25;

const snakeHeadMaterial = new CANNON.Material('snakeHeadMaterial');
snakeHeadMaterial.friction = -10;
snakeHeadMaterial.restitution = 0;

const foodMaterial = new CANNON.Material('foodMaterial');
foodMaterial.friction = 10;
foodMaterial.restitution = 0;

// ------------------------ BUILDING GROUND ------------------------

const grid = new THREE.GridHelper(1000,1000);
scene.add(grid);

const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMesh: THREE.Mesh = new THREE.Mesh(groundGeometry, phongMaterial);
groundMesh.rotateX(-Math.PI / 2);
groundMesh.receiveShadow = true;
grid.rotateX(Math.PI / 2);
groundMesh.add(grid);
scene.add(groundMesh);
const groundShape = new CANNON.Box(new CANNON.Vec3(50, 1, 50));
const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
groundBody.addShape(groundShape);
groundBody.position.set(0, -1, 0);
world.addBody(groundBody);

// ------------------------ BUILDING SNAKE HEAD ------------------------

const snakeHeadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const snakeHeadMesh: THREE.Mesh = new THREE.Mesh(snakeHeadGeometry, phongMaterial);

const snakeHeadBoundingBox = new THREE.Box3(new Vector3(), new Vector3());
snakeHeadBoundingBox.setFromObject(snakeHeadMesh);

snakeHeadMesh.position.y = 3;
snakeHeadMesh.castShadow = true;
scene.add(snakeHeadMesh);
snakeHeadMesh.add(chaseCam);

const snakeHeadShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
const snakeHead = new CANNON.Body({ mass: 1 , material: snakeHeadMaterial});
snakeHead.addShape(snakeHeadShape);
snakeHead.position.x = snakeHeadMesh.position.x;
snakeHead.position.y = snakeHeadMesh.position.y;
snakeHead.position.z = snakeHeadMesh.position.z;
world.addBody(snakeHead);

// ------------------------ EVENT LISTENERS ------------------------

const keyMap: { [id: string]: boolean } = {}
const onDocumentKey = (e: KeyboardEvent) => {
    keyMap[e.key] = e.type === 'keydown'
}

document.addEventListener('keydown', onDocumentKey, false);
document.addEventListener('keyup', onDocumentKey, false);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

// ------------------------ FOOD SPAWN ------------------------

const foodGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const foodMesh: THREE.Mesh = new THREE.Mesh(foodGeometry, phongMaterial);

const foodBoundingBox = new THREE.Box3(new Vector3(), new Vector3());


const foodShape = new CANNON.Box(new CANNON.Vec3());
const food = new CANNON.Body({ mass: 1 , material: foodMaterial});

for (let i = 0; i < 1000; i++) {

    foodMesh.position.x = Math.random() * 10;
    foodMesh.position.y = 1;
    foodMesh.position.z = Math.random() * 10;
    foodMesh.castShadow = true;
    scene.add(foodMesh);

    food.addShape(foodShape);
    food.position.x = foodMesh.position.x;
    food.position.y = foodMesh.position.y;
    food.position.z = foodMesh.position.z;
    foodBoundingBox.setFromObject(foodMesh);
    world.addBody(food);
}

// ------------------------ GUI ------------------------

const gui = new GUI();
const physicsFolder = gui.addFolder('Physics');
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1);
physicsFolder.open();
const snakeHeadPositionFolder = gui.addFolder('Snake Head Position');
snakeHeadPositionFolder.add(snakeHead.position, 'x', -20.0, 20.0, 0.1);
snakeHeadPositionFolder.add(snakeHead.position, 'y', -20.0, 20.0, 0.1);
snakeHeadPositionFolder.add(snakeHead.position, 'z', -20.0, 20.0, 0.1);
snakeHeadPositionFolder.open();
const snakeHeadRotationFolder = gui.addFolder('Snake Head Rotation');
snakeHeadRotationFolder.add(snakeHead.quaternion, 'x', -20.0, 20.0, 0.1);
snakeHeadRotationFolder.add(snakeHead.quaternion, 'y', -20.0, 20.0, 0.1);
snakeHeadRotationFolder.add(snakeHead.quaternion, 'z', -20.0, 20.0, 0.1);
snakeHeadRotationFolder.add(snakeHead.quaternion, 'w', -20.0, 20.0, 0.1);
snakeHeadRotationFolder.open();
const foodPositionFolder = gui.addFolder('Food Position');
foodPositionFolder.add(food.position, 'x', -20.0, 20.0, 0.1);
foodPositionFolder.add(food.position, 'y', -20.0, 20.0, 0.1);
foodPositionFolder.add(food.position, 'z', -20.0, 20.0, 0.1);
foodPositionFolder.open();

const clock = new THREE.Clock();
let delta;

const v = new THREE.Vector3();

function checkCollisions() {
    if (snakeHeadBoundingBox.intersectsBox(foodBoundingBox)) {
        food.position.set(0, 0, 1);
        snakeHeadMesh.add(foodMesh);
    }
}

let thrusting = false;
let steering = false;

let moveForward = 0;
let moveSites = 0;
function animate() {
    requestAnimationFrame(animate);

    // @ts-ignore
    snakeHeadBoundingBox.copy(snakeHeadMesh.geometry.boundingBox).applyMatrix4(snakeHeadMesh.matrixWorld);

    checkCollisions();

    delta = Math.min(clock.getDelta(), 0.1);
    world.step(delta);

    // ------------------------ Copy coordinates from Cannon Objects to Three.js Objects ------------------------
    snakeHeadMesh.position.set(
        snakeHead.position.x,
        snakeHead.position.y,
        snakeHead.position.z
    );
    snakeHeadMesh.quaternion.set(
        snakeHead.quaternion.x,
        snakeHead.quaternion.y,
        snakeHead.quaternion.z,
        snakeHead.quaternion.w
    );
    foodMesh.position.set(
        food.position.x,
        food.position.y,
        food.position.z
    );
    foodMesh.quaternion.set(
        food.quaternion.x,
        food.quaternion.y,
        food.quaternion.z,
        food.quaternion.w
    );


    // ------------------------ MOVING LOGIC ------------------------

    steering = false;
    thrusting = false;
    if (keyMap['w'] || keyMap['ArrowUp']) {
        if (moveForward < 100.0) moveForward -= 0.1;
        thrusting = true;
    }
    if (keyMap['s'] || keyMap['ArrowDown']) {
        if (moveForward > -100.0) moveForward += 0.1;
        thrusting = true;
    }
    if (keyMap['a'] || keyMap['ArrowLeft']) {
        if (moveSites < 100.0) moveSites -= 0.1;
        steering = true;
    }
    if (keyMap['d'] || keyMap['ArrowRight']) {
        if (moveSites > -100.0) moveSites += 0.1;
        steering = true;
    }
    if (keyMap[' ']) {

    }

    snakeHeadMesh.translateZ(moveForward);
    snakeHeadMesh.translateX(moveSites);

    // ------------------------ SLOWLY STOPPING LOGIC ------------------------

    if (!thrusting) {
        //not going forward or backwards so gradually slow down
    }

    if (!steering) {

    }

    // ------------------------ CAMERA FOCUS ON SNAKE HEAD ------------------------

    camera.lookAt(snakeHeadMesh.position);

    chaseCamPivot.getWorldPosition(v);
    if (v.y < 1) {
        v.y = 1;
    }
    camera.position.lerpVectors(camera.position, v, 0.05);

    // ------------------------ RENDER / DRAW ------------------------

    render();

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();