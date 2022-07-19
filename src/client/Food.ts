import * as THREE from 'three'
import { Vector3 } from 'three'

export class Food {
    private static instance: Food

    private phongMaterial = new THREE.MeshPhongMaterial({ color: 0xad1111 })
    private foodBoundingBox = new THREE.Box3(new Vector3(), new Vector3())
    private foodGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    private foodMesh: THREE.Mesh = new THREE.Mesh(this.foodGeometry, this.phongMaterial)

    private newFoodMesh = this.foodMesh.clone()

    private foodCount: number = 0
    private foodRotationSpeed: number = 0.025

    spawnFirstFood(scene: THREE.Scene) {

        /*
        for (let i = 0; i < 10; i++) {
            const startFood = this.foodMesh.clone()
            startFood.name = 'food'
            startFood.position.x = Math.random() * 10
            startFood.position.y = 0.5
            startFood.position.z = Math.random() * 10
            startFood.castShadow = true
            scene.add(startFood)
            this.foodBoundingBox.setFromObject(startFood)
        }

         */

        this.foodMesh.name = 'food'
        this.foodMesh.position.x = Math.random() * 10
        this.foodMesh.position.y = 0.5
        this.foodMesh.position.z = Math.random() * 10
        this.foodMesh.castShadow = true
        scene.add(this.foodMesh)
        this.foodBoundingBox.setFromObject(this.foodMesh)
        console.log('First Food Spawned')

    }

    spawnNewFood(scene: THREE.Scene) {
        this.newFoodMesh.name = 'food'
        this.newFoodMesh.position.x = Math.random() * 100 - 10
        this.newFoodMesh.position.y = 0.5
        this.newFoodMesh.position.z = Math.random() * 100 - 10
        this.newFoodMesh.castShadow = true
        scene.add(this.newFoodMesh)

        this.foodBoundingBox.setFromObject(this.newFoodMesh)
        console.log('New Food Spawned')
    }

    animateFood() {
        this.foodMesh.rotation.z += this.foodRotationSpeed
        this.foodMesh.rotation.x += this.foodRotationSpeed

        this.newFoodMesh.rotation.z += this.foodRotationSpeed
        this.newFoodMesh.rotation.x += this.foodRotationSpeed
    }

    countFood(scene: THREE.Scene) {
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === 'food') {
                this.foodCount++
                console.log('Food Count: ' + this.foodCount)
            }
        }
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