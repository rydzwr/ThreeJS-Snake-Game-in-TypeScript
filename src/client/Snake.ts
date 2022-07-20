import * as THREE from 'three'
import { AxesHelper, Object3D, Vector3 } from 'three'
import { Food } from './Food'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { InputManager } from './Input'
import { MyScene } from './Scene'
import { SnakeTailElement } from './SnakeTailElement'

export class Snake extends Object3D implements GameObjectLifecycle {
    public hasLifecycle = 1;

    // ------------------------ MAIN SHAPE ------------------------
    private skullMaterial = new THREE.MeshPhongMaterial({color: 0x307016});
    private snakeHeadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.9, 0.7, 1.2);
    private snakeHeadMesh: THREE.Mesh = new THREE.Mesh(this.snakeHeadGeometry, this.skullMaterial);
    private snakeHeadBoundingBox = new THREE.Box3(new Vector3(), new Vector3());

    // ------------------------ FOREHEAD ------------------------
    private foreheadMaterial = new THREE.MeshPhongMaterial({color: 0x45b518});
    private foreheadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.9);
    private foreheadMesh: THREE.Mesh = new THREE.Mesh(this.foreheadGeometry, this.foreheadMaterial);

    // ------------------------ NOSE ------------------------
    private noseMaterial = new THREE.MeshPhongMaterial({color: 0x307016});
    private noseGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.5);
    private noseMesh: THREE.Mesh = new THREE.Mesh(this.noseGeometry, this.noseMaterial);

    // ------------------------ NOSE HOLE ------------------------
    private noseHoleMaterial = new THREE.MeshPhongMaterial({color: 0x2a2e29});
    private noseHoleGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.1);
    private noseHoleMesh: THREE.Mesh = new THREE.Mesh(this.noseHoleGeometry, this.noseHoleMaterial);
    private noseHoleMesh2 = this.noseHoleMesh.clone();

    // ------------------------ EYE ------------------------
    private eyeMaterial = new THREE.MeshPhongMaterial({color: 0x9e0000});
    private eyeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
    private eyeMesh: THREE.Mesh = new THREE.Mesh(this.eyeGeometry, this.eyeMaterial);
    private eyeMesh2 = this.eyeMesh.clone();

    // ------------------------ SNAKE TAIL OBJECT ------------------------
    private tailObjMaterial = new THREE.MeshPhongMaterial({color: 0x307016});
    private tailObjGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    private tailObjMesh: THREE.Mesh = new THREE.Mesh(this.tailObjGeometry, this.tailObjMaterial)

    private iterator: number = 0.35

    private thrusting = false;
    private steering = false;
    private speeding = false;

    private worldBorder: number = 49.5;
    private negativeWorldBorder: number = -49.5;

    private moveForward = 0;
    private moveSites = 0;

    constructor() {
        super()
        this.name = "snake";
        this.add(new AxesHelper(2));
    }

    buildSnakeHead() {
        this.snakeHeadMesh.position.y = 0.35;
        this.snakeHeadMesh.castShadow = true;
        this.add(this.snakeHeadMesh);
        //this.snakeHeadMesh.add(chaseCam);

        //forehead
        this.snakeHeadMesh.add(this.foreheadMesh)
        this.foreheadMesh.position.set(0,0.45,0.15)

        //nose
        this.snakeHeadMesh.add(this.noseMesh)
        this.noseMesh.position.set(0,-0.1,-0.8)

        //nose holes
        this.noseMesh.add(this.noseHoleMesh)
        this.noseHoleMesh.position.set(0.2,0.23,-0.3)

        this.noseMesh.add(this.noseHoleMesh2)
        this.noseHoleMesh2.position.set(-0.2,0.23,-0.3)

        //eyes
        this.foreheadMesh.add(this.eyeMesh)
        this.eyeMesh.position.set(0.2,0.23,-0.3)

        this.foreheadMesh.add(this.eyeMesh2)
        this.eyeMesh2.position.set(-0.2,0.23,-0.3)

        this.buildTail(4)
    }

    buildTail(length: number) {
        const scene = MyScene.getInstance().Scene;
        let prev: Object3D = this;
        for (let i = 0; i < length; i++) {
            const el = new SnakeTailElement(prev, 0.65);
            const pos = this.snakeHeadMesh.position;
            el.position.set(pos.x, pos.y, pos.z + i  * 0.65 + 1.2);
            scene.add(el);
            prev = el;
        }

        /*for (let i = 0; i < length; i++) {
            const snakeTailObj = this.tailObjMesh.clone();
            this.iterator += 0.55;
            snakeTailObj.position.set(0, 0, this.iterator)
            this.snakeHeadMesh.add(snakeTailObj)
        }*/
    }

    public getSnakeHeadBoundingBox() {
        return this.snakeHeadBoundingBox;
    }

    public postInit(): void {
        this.buildSnakeHead();
    }

    public update(deltaTime: number): void {
        const input = InputManager.getInstance();
        const scene = MyScene.getInstance().Scene;

        const speed = 2;
        const rotationSpeed = 1.5;

        let isMoving = false;

        if (input.getKeyDown('w') || input.getKeyDown('ArrowUp')) {
            this.translateZ(-speed * deltaTime);
            isMoving = true;
        }

        if (input.getKeyDown('s') || input.getKeyDown('ArrowDown')) {
            this.translateZ(speed * deltaTime);
            isMoving = true;
        }

        if (isMoving && (input.getKeyDown('d') || input.getKeyDown('ArrowRight')))
            this.rotateY(-rotationSpeed * deltaTime);

        if (isMoving && (input.getKeyDown('a') || input.getKeyDown('ArrowLeft')))
            this.rotateY(rotationSpeed * deltaTime);

        if (this.snakeHeadMesh.position.x >= this.worldBorder)
            this.snakeHeadMesh.position.x = this.worldBorder;
        if (this.snakeHeadMesh.position.x <= this.negativeWorldBorder)
            this.snakeHeadMesh.position.x = this.negativeWorldBorder;

        if (this.snakeHeadMesh.position.z >= this.worldBorder)
            this.snakeHeadMesh.position.z = this.worldBorder;
        if (this.snakeHeadMesh.position.z <= this.negativeWorldBorder)
            this.snakeHeadMesh.position.z = this.negativeWorldBorder;

        this.snakeHeadBoundingBox.setFromObject(this.snakeHeadMesh);

        const food = scene.getObjectByName("food") as Food;
        if (this.snakeHeadBoundingBox.intersectsBox(food.getFoodBoundingBox())) {

            scene.remove(food);
            this.buildTail(1)
            scene.add(new Food(new Vector3(10, 0, 10)));
        }
    }
}