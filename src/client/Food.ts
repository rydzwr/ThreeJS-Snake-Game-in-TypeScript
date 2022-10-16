import * as THREE from 'three'
import { Box3, BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Scene, Vector3 } from 'three'
import { FoodManager } from './FoodManager'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { MyScene } from './Scene'
import { Utils } from './Utils'

export class Food extends Object3D implements GameObjectLifecycle {
    private static readonly foodRotationSpeed = 0.5 * Math.PI

    public hasLifecycle = 1

    private mesh: Mesh
    private foodBoundingBox = new THREE.Box3(new Vector3(), new Vector3())
    private phongMaterial = new MeshPhongMaterial({ color: 0xad1111 })
    private foodGeometry = new BoxGeometry(0.5, 0.5, 0.5)

    // ---------- Moving Logic ------------
    private targetPos: Vector3
    private velocityRef = new Vector3(0, 0, 0)
    private smoothTime = 0.15
    private maxSpeed = 10

    constructor(targetPos: Vector3) {
        super()
        this.name = 'food'
        this.targetPos = targetPos

        this.mesh = new Mesh(this.foodGeometry, this.phongMaterial)
        this.mesh.position.set(0, 0.5, 0)
        this.mesh.castShadow = true
        this.add(this.mesh)
    }

    public postInit(): void {}

    public update(deltaTime: number): void {
        this.mesh.rotation.z += Food.foodRotationSpeed * deltaTime
        this.mesh.rotation.x += Food.foodRotationSpeed * deltaTime

        this.lookAt(this.position)

        const newPos = Utils.SmoothDamp(
            this.position.clone(),
            this.targetPos.clone(),
            this.velocityRef,
            this.smoothTime,
            this.maxSpeed,
            deltaTime
        )
        this.mesh.position.set(newPos.x, newPos.y, newPos.z)
        this.position.set(newPos.x, newPos.y, newPos.z)
        this.foodBoundingBox.setFromObject(this.mesh)

        if (
            this.position.x <= this.targetPos.x - 0.001 &&
            this.position.y <= this.targetPos.y - 0.001 &&
            this.position.z <= this.targetPos.z - 0.001
        ) {
            FoodManager.getInstance().addToFoodArray(this)
        }
    }

    public removeFoodFromScene() {
        this.foodBoundingBox.makeEmpty()
        this.foodGeometry.dispose()
        this.foodGeometry.dispose()
        MyScene.getInstance().Scene.remove(this)
    }

    public getFoodBoundingBox() {
        return this.foodBoundingBox
    }
}
