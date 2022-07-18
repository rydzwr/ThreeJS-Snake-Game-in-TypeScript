import * as THREE from 'three'
import { Vector3 } from 'three'
import * as CANNON from 'cannon-es'

export class Food {
    private static instance: Food
    private phongMaterial = new THREE.MeshPhongMaterial()
    private foodMaterial = new CANNON.Material('foodMaterial')
    private foodBoundingBox = new THREE.Box3(new Vector3(), new Vector3())
    private foodGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    private foodMesh: THREE.Mesh = new THREE.Mesh(this.foodGeometry, this.phongMaterial)
    private foodShape = new CANNON.Box(new CANNON.Vec3())
    private food = new CANNON.Body({ mass: 1, material: this.foodMaterial })

    private newFoodMesh = this.foodMesh.clone()

    private foodCount: number = 0

    spawnFirstFood(scene: THREE.Scene) {
        this.foodMaterial.friction = 10
        this.foodMaterial.restitution = 0
        this.foodMesh.name = 'food'

        this.foodMesh.position.x = Math.random() * 10
        this.foodMesh.position.y = 0.5
        this.foodMesh.position.z = Math.random() * 10
        this.foodMesh.castShadow = true
        scene.add(this.foodMesh)

        this.food.addShape(this.foodShape)
        this.food.position.x = this.foodMesh.position.x
        this.food.position.y = this.foodMesh.position.y
        this.food.position.z = this.foodMesh.position.z
        this.foodBoundingBox.setFromObject(this.foodMesh)
        console.log('First Food Spawned')
    }

    spawnNewFood(scene: THREE.Scene) {
            this.newFoodMesh.name = 'food'
            this.newFoodMesh.position.x = Math.random() * 50 - 10
            this.newFoodMesh.position.y = 0.5
            this.newFoodMesh.position.z = Math.random() * 50 - 10
            this.newFoodMesh.castShadow = true
            scene.add(this.newFoodMesh)

            this.foodBoundingBox.setFromObject(this.newFoodMesh)
            console.log('New Food Spawned')
    }

    countFood(scene: THREE.Scene) {
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === 'food') {
                this.foodCount++
                console.log('Food Count: ' + this.foodCount)
            }
        }
    }

    public getNewFoodMesh() {
        return this.newFoodMesh
    }

    public setFoodCount(count: number) {
        this.foodCount = count
    }

    public getFoodBoundingBox() {
        return this.foodBoundingBox
    }

    public getFoodMesh() {
        return this.foodMesh
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new Food()
        else return this.instance
    }
}