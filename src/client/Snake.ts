import * as THREE from 'three'
import { AxesHelper, Camera, Mesh, Object3D, Vector3 } from 'three'
import { Food } from './Food'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { InputManager } from './Input'
import { MyScene } from './Scene'
import { SnakeTailElement } from './SnakeTailElement'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FoodSpawner } from './FoodSpawner'
import { FoodManager } from './FoodManager'

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

    private blenderSnakeHeadMesh: any

    constructor() {
        super()
        this.name = 'snake'
        //this.add(new AxesHelper(2))
    }

    blenderSnakeHead() {
        const scene = MyScene.getInstance().Scene
        const loader = new GLTFLoader()
        loader.load(
            '/resources/snake_head.gltf',
            function (gltf) {
                // gltf.scene.traverse(function (child) {
                //     if ((child as THREE.Mesh).isMesh) {
                //         const m = (child as THREE.Mesh)
                //         m.receiveShadow = true
                //         m.castShadow = true
                //     }
                //     if (((child as THREE.Light)).isLight) {
                //         const l = (child as THREE.Light)
                //         l.castShadow = true
                //         l.shadow.bias = -.003
                //         l.shadow.mapSize.width = 2048
                //         l.shadow.mapSize.height = 2048
                //     }
                // })
                scene.add(gltf.scene)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    }

    buildSnakeHead() {
        this.blenderSnakeHead()

        this.position.y = 0.35
        this.snakeHeadMesh.position.set(this.position.x, this.position.y, this.position.z)
        this.position.set(40, 0.35, -40)
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
        let smoothTime = 0.3
        let prev: Object3D = this
        for (let i = 0; i < length; i++) {
            const el = new SnakeTailElement(prev, i == 0 ? 1 : 0.65, smoothTime)
            const pos = this.position
            el.position.set(pos.x, 0.35, pos.z + i * 0.65 + 1)
            scene.add(el)
            prev = el
            smoothTime = Math.max(smoothTime - 0.02, 0.1)
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
        this.snakeHeadMesh.rotateY(Math.PI)
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

        const foodSpawner = scene.getObjectByName('foodSpawner') as FoodSpawner
        if (this.snakeHeadBoundingBox.intersectsBox(foodSpawner.getfoodSpawnerBoundingBox())) {
            this.translateZ(-speed * deltaTime)
        }

        const foodArray = FoodManager.getInstance().getFoodArray();

        for (let i = 0; i < foodArray.length; i++) {
            const food = foodArray[i] as Food
            if (this.snakeHeadBoundingBox.intersectsBox(food.getFoodBoundingBox())) {
                console.log('intersection!')
                scene.remove(food);
                food.removeFoodFromScene()
                this.addSnakeElement()
                FoodManager.getInstance().addFood();
            }  
        }
        
    }
}
