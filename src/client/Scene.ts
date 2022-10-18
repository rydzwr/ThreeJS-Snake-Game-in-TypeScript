import * as THREE from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { MyCustomLight } from './Light'
import { PerspectiveCamera, Scene, Vector3 } from 'three'
import { Ground } from './Ground'
import { Food } from './Food'
import { MyCamera } from './Camera'
import { Snake } from './Snake'
import { FoodSpawner } from './FoodSpawner'
import { FoodManager } from './FoodManager'

export class MyScene implements GameObjectLifecycle {
    public hasLifecycle = 1;

    private static instance: MyScene
    private scene = new THREE.Scene()
    private activeCamera: PerspectiveCamera;

    constructor() {
        this.scene.add(new MyCustomLight());
        this.scene.add(new Ground());

        const snake = new Snake()
        this.scene.add(snake);
        this.scene.add(new FoodSpawner(new Vector3(0, 0.5, 0)));

        const camera = new MyCamera();
        this.scene.add(camera);
        this.activeCamera = camera;
        camera.position.set(6, 8, -8);
        camera.Offset = new Vector3(10, 10, -10);
        camera.Target = snake;

        document.addEventListener('mousedown', (event) => {
            camera.FreeMode = true;
            camera.IsDragging = true;
        });

        document.addEventListener('mouseup', (event) => {
            camera.IsDragging = false;
        });
    }

    public postInit(): void {
        this.scene.traverse((obj) => {
            if ('hasLifecycle' in obj)
                (<unknown>obj as GameObjectLifecycle).postInit();
        });
        FoodManager.getInstance().spawnStartingFood();
    }

    public update(deltaTime: number): void {
        this.scene.traverse((obj) => {
            if ('hasLifecycle' in obj)
                (<unknown>obj as GameObjectLifecycle).update(deltaTime);
        });
    }

    public get Scene(): Scene
    {
        return this.scene;
    }

    public get ActiveCamera()
    {
        return this.activeCamera;
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new MyScene()
        else return this.instance
    }
}