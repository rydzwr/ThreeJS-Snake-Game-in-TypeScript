import { Vector3 } from 'three'
import { Food } from './Food'
import { MyScene } from './Scene'

export class FoodManager {
    private static instance: FoodManager
    private scene

    private foodArray: any = []

    constructor() {
        this.scene = MyScene.getInstance().Scene
    }

    public spawnStartingFood() {
        for (let i = 0; i < 10; i++) {
            const min = Math.ceil(5)
            const max = Math.floor(30)
            const randomX = Math.floor(Math.random() * (max - min + 1)) + min
            const randomZ = Math.floor(Math.random() * (max - min + 1)) + min
            const newFood = new Food(new Vector3(randomX, 0.5, randomZ))
            newFood.name = 'food'
            this.scene.add(newFood)
        }
    }

    public addFood() {
        const min = Math.ceil(5)
        const max = Math.floor(30)
        const randomX = Math.floor(Math.random() * (max - min + 1)) + min
        const randomZ = Math.floor(Math.random() * (max - min + 1)) + min
        const newFood = new Food(new Vector3(randomX, 0.5, randomZ))
        newFood.name = 'food'
        this.scene.add(newFood)
    }

    public countFoodOnScene() {
        let counter = 0
        this.scene.traverse((obj) => {
            if (obj instanceof Food) counter++
        })
        //console.log(counter)
    }

    public addToFoodArray(food: Food) {
        this.foodArray.push(food)
    }

    public getFoodArray() {
        return this.foodArray
    }

    public static getInstance() {
        if (this.instance === undefined) return (this.instance = new FoodManager())
        else return this.instance
    }
}
