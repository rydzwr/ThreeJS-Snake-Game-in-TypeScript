import { Food } from './Food'
import { Snake } from './Snake'
import { Scene } from './Scene'

export class CollisionDetector {
    private static instance: CollisionDetector
    private food = Food.getInstance()
    private snakeHead = Snake.getInstance()
    private snakeHeadMesh = this.snakeHead.getSnakeHeadMesh()
    private snakeHeadBoundingBox = this.snakeHead.getSnakeHeadBoundingBox()
    private foodEaten: number = 0
    private iterator: number = 1;

    detect() {
        // @ts-ignore
        this.snakeHeadBoundingBox.copy(this.snakeHeadMesh.geometry.boundingBox).applyMatrix4(this.snakeHeadMesh.matrixWorld)

        if (this.snakeHead.getSnakeHeadBoundingBox().intersectsBox(this.food.getFoodBoundingBox())) {
            const foodMesh = this.food.getFoodMesh();
            foodMesh.position.set(0, 0, 1)
            this.snakeHead.getSnakeHeadMesh().add(foodMesh)
            this.food.setFoodCount(0)
            this.foodEaten++
            console.log(this.foodEaten);
            if (this.foodEaten >= 2) {
                this.iterator++;
                const snakeTailObject = this.food.getNewFoodMesh().clone();
                snakeTailObject.position.set(0, 0, this.iterator)
                foodMesh.add(snakeTailObject)
            }
        }
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new CollisionDetector()
        else return this.instance
    }
}