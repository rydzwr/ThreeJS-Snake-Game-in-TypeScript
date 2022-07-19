import { Food } from './Food'
import { Snake } from './Snake'
import { Scene } from './Scene'

export class CollisionDetector {
    private static instance: CollisionDetector
    private food = Food.getInstance()
    private snakeHead = Snake.getInstance()
    private snakeHeadMesh = this.snakeHead.getSnakeHeadMesh()
    private snakeHeadBoundingBox = this.snakeHead.getSnakeHeadBoundingBox()

    private scene = Scene.getInstance().getScene();

    detect() {
        // @ts-ignore
        this.snakeHeadBoundingBox.copy(this.snakeHeadMesh.geometry.boundingBox).applyMatrix4(this.snakeHeadMesh.matrixWorld)

        if (this.snakeHead.getSnakeHeadBoundingBox().intersectsBox(this.food.getFoodBoundingBox())) {

            this.scene.remove(this.food.getFoodMesh())
            Snake.getInstance().buildTail(1)
            this.food.setFoodCount(0)
            Food.getInstance().spawnNewFood(this.scene)
            Food.getInstance().countFood(this.scene)
            console.log('INTERSECTION!!!')
        }

        if (this.snakeHead.getSnakeHeadBoundingBox().intersectsBox(this.food.getFoodBoundingBox())) {

            this.scene.remove(this.food.getFoodMesh())
            Snake.getInstance().buildTail(1)
            this.food.setFoodCount(0)
            Food.getInstance().spawnNewFood(this.scene)
            Food.getInstance().countFood(this.scene)
            console.log('INTERSECTION!!!')
        }
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new CollisionDetector()
        else return this.instance
    }
}