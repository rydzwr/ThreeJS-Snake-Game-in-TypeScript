import * as THREE from 'three'
import { AxesHelper, Object3D, Vector3 } from 'three'
import { Food } from './Food'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { InputManager } from './Input'
import { MyScene } from './Scene'
import { SnakeTailElement } from './SnakeTailElement'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Snake extends Object3D implements GameObjectLifecycle {
    public hasLifecycle = 1

    // ------------------------ MAIN SHAPE ------------------------
    private skullMaterial = new THREE.MeshPhongMaterial({ color: 0x307016 })
    private snakeHeadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.9, 0.7, 1.2)
    private snakeHeadMesh: THREE.Mesh = new THREE.Mesh(this.snakeHeadGeometry, this.skullMaterial)
    private snakeHeadBoundingBox = new THREE.Box3(new Vector3(), new Vector3())

    // ------------------------ FOREHEAD ------------------------
    private foreheadMaterial = new THREE.MeshPhongMaterial({ color: 0x45b518 })
    private foreheadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.9)
    private foreheadMesh: THREE.Mesh = new THREE.Mesh(this.foreheadGeometry, this.foreheadMaterial)

    // ------------------------ NOSE ------------------------
    private noseMaterial = new THREE.MeshPhongMaterial({ color: 0x307016 })
    private noseGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.5)
    private noseMesh: THREE.Mesh = new THREE.Mesh(this.noseGeometry, this.noseMaterial)

    // ------------------------ NOSE HOLE ------------------------
    private noseHoleMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2e29 })
    private noseHoleGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.1)
    private noseHoleMesh: THREE.Mesh = new THREE.Mesh(this.noseHoleGeometry, this.noseHoleMaterial)
    private noseHoleMesh2 = this.noseHoleMesh.clone()

    // ------------------------ EYE ------------------------
    private eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x9e0000 })
    private eyeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1)
    private eyeMesh: THREE.Mesh = new THREE.Mesh(this.eyeGeometry, this.eyeMaterial)
    private eyeMesh2 = this.eyeMesh.clone()

    private blenderSnakeHeadMesh: any;

    constructor() {
        super()
        this.name = 'snake'
        //this.add(new AxesHelper(2))
    }

    blenderSnakeHead() {
        const loader = new GLTFLoader()
        const url = '/resources/snake_head.gltf'
        const scene = MyScene.getInstance().Scene
        loader.load(url, (gltf) => {
            this.blenderSnakeHeadMesh = gltf.scene;
            scene.add(this.blenderSnakeHeadMesh)
        })
    }

    buildSnakeHead() {

        this.blenderSnakeHead()

        this.position.y = 0.35
        this.snakeHeadMesh.position.set(this.position.x, this.position.y, this.position.z)
        this.position.set(40,0.35,-40)
        this.castShadow = true
        this.add(this.snakeHeadMesh)

        //forehead
        this.snakeHeadMesh.add(this.foreheadMesh)
        this.foreheadMesh.position.set(0, 0.45, 0.15)

        //nose
        this.snakeHeadMesh.add(this.noseMesh)
        this.noseMesh.position.set(0, -0.1, -0.8)

        //nose holes
        this.noseMesh.add(this.noseHoleMesh)
        this.noseHoleMesh.position.set(0.2, 0.23, -0.3)

        this.noseMesh.add(this.noseHoleMesh2)
        this.noseHoleMesh2.position.set(-0.2, 0.23, -0.3)

        //eyes
        this.foreheadMesh.add(this.eyeMesh)
        this.eyeMesh.position.set(0.2, 0.23, -0.3)

        this.foreheadMesh.add(this.eyeMesh2)
        this.eyeMesh2.position.set(-0.2, 0.23, -0.3)

        this.buildTail(10)
    }

    buildTail(length: number) {
        const scene = MyScene.getInstance().Scene
        let smoothTime = 0.3;
        let prev: Object3D = this
        for (let i = 0; i < length; i++) {
            const el = new SnakeTailElement(prev, (i == 0) ? 1 : 0.65, smoothTime)
            const pos = this.position
            el.position.set(pos.x, 0.35, (pos.z + i  * 0.65 + 1));
            scene.add(el)
            prev = el
            smoothTime = Math.max(smoothTime - 0.02, 0.1);
        }
    }

    addSnakeElement() {
        const scene = MyScene.getInstance().Scene
        let elements = new Array<SnakeTailElement>()
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === 'snakeElement') {
                elements.push(scene.children[i] as SnakeTailElement)
            }
        }

        const last = elements[elements.length - 1]
        const el = new SnakeTailElement(last, 0.65)
        const pos = this.position
        el.position.set(pos.x, pos.y, pos.z)
        scene.add(el)
    }

    public getSnakeHeadBoundingBox() {
        return this.snakeHeadBoundingBox
    }

    public postInit(): void {
        this.buildSnakeHead()
        this.snakeHeadMesh.rotateY(Math.PI);
    }

    public update(deltaTime: number): void {

        const input = InputManager.getInstance()
        const scene = MyScene.getInstance().Scene

        const speed = 2
        const sprintSpeed = 5
        const rotationSpeed = 1.5

        let isMoving = false

        // ---------------- TO DO -----------------
        // Steering left/right can stuck when speeding with shift

        if (input.getKeyDown('w') || input.getKeyDown('ArrowUp')) {
            this.translateZ(speed * deltaTime)
            isMoving = true
        }

        if (input.getKeyDown('s') || input.getKeyDown('ArrowDown')) {
            this.translateZ(-speed * deltaTime)
            isMoving = true
        }

        if (isMoving && (input.getKeyDown('d') || input.getKeyDown('ArrowRight'))) {
            this.rotateY(-rotationSpeed * deltaTime)
        }

        if (isMoving && (input.getKeyDown('a') || input.getKeyDown('ArrowLeft'))) {
            this.rotateY(rotationSpeed * deltaTime)
        }

        if (input.getKeyDown('Shift') && input.getKeyDown('w')) {
            this.translateZ(sprintSpeed * deltaTime)
        }

        this.snakeHeadBoundingBox.setFromObject(this.snakeHeadMesh)

        const food = scene.getObjectByName('food') as Food
        if (this.snakeHeadBoundingBox.intersectsBox(food.getFoodBoundingBox())) {

            const min = Math.ceil(5)
            const max = Math.floor(30)
            const randomX = Math.floor(Math.random() * (max - min + 1)) + min
            const randomZ = Math.floor(Math.random() * (max - min + 1)) + min

            scene.remove(food)
            this.addSnakeElement()
            scene.add(new Food(new Vector3(randomX, 0.5, randomZ)))
        }
    }
}