import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Food } from './Food'
import { CollisionDetector } from './CollisionDetector'
import { Snake } from './Snake'
import { MovingController } from './MovingController'
import { Ground } from './Ground'
import { Light } from './Light'
import { Scene } from './Scene'

const scene = Scene.getInstance().getScene();

// ------------------------ CREATE LIGHTS AND SHADOWS ------------------------

Light.getInstance().createLight(scene);

// ------------------------ CAMERA ------------------------

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
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

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render);

Ground.getInstance().buildGround(scene, world);

Snake.getInstance().buildSnakeHead(scene, chaseCam, world);
const snakeHeadMesh = Snake.getInstance().getSnakeHeadMesh();


window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

const stats = Stats();
document.body.appendChild(stats.dom);


const gui = new GUI();
const physicsFolder = gui.addFolder('Physics');
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1);
physicsFolder.open();

const clock = new THREE.Clock();
let delta;

const v = new THREE.Vector3();

Food.getInstance().spawnFirstFood(scene, world);
Food.getInstance().countFood(scene);

function animate() {
    requestAnimationFrame(animate);

    CollisionDetector.getInstance().detect();

   Food.getInstance().spawnNewFood(scene, world);

    Food.getInstance().animateFood();

    delta = Math.min(clock.getDelta(), 0.1);
    world.step(delta);

    MovingController.getInstance().moveSnakeHead();

    camera.lookAt(snakeHeadMesh.position);

    chaseCamPivot.getWorldPosition(v);
    if (v.y < 1) {
        v.y = 1
    }
    camera.position.lerpVectors(camera.position, v, 0.05);

    render();

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();