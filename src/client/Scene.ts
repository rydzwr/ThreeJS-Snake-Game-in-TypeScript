import * as THREE from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { MyCustomLight } from './Light'
import { PerspectiveCamera, Scene, Vector3 } from 'three'
import { Ground } from './Ground'
import { Food } from './Food'
import { MyCamera } from './Camera'
import { Snake } from './Snake'

export class MyScene implements GameObjectLifecycle {
    public hasLifecycle = 1;

    private static instance: MyScene
    private scene = new THREE.Scene()
    private activeCamera: PerspectiveCamera;

    constructor() {
        // Add all of our game objects here
        const camera = new MyCamera();
        this.scene.add(camera);
        this.activeCamera = camera.Camera;

        this.scene.add(new MyCustomLight());
        this.scene.add(new Ground());

        const snake = new Snake();
        this.scene.add(snake);
        this.scene.add(new Food(new Vector3(5, 0.5, 5)));

        camera.position.set(0, 8, 7);
        camera.Target = snake;
    }

    public postInit(): void {
        this.scene.traverse((obj) => {
            if ('hasLifecycle' in obj)
                (<unknown>obj as GameObjectLifecycle).postInit();
        });
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