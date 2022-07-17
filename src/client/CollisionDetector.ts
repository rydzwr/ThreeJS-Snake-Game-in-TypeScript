import { Food } from './Food'
import { Snake } from './Snake'
import { Scene } from './Scene'
import { World } from './World'

export class CollisionDetector {
    private static instance: CollisionDetector
    private food = Food.getInstance()
    private snakeHead = Snake.getInstance()
    private snakeHeadMesh = this.snakeHead.getSnakeHeadMesh()
    private snakeHeadBoundingBox = this.snakeHead.getSnakeHeadBoundingBox()
    private iterator: number = 0.3;
    private scene = Scene.getInstance().getScene();
    private world = World.getInstance().getWorld();

    detect() {
        // @ts-ignore
        this.snakeHeadBoundingBox.copy(this.snakeHeadMesh.geometry.boundingBox).applyMatrix4(this.snakeHeadMesh.matrixWorld)

        if (this.snakeHead.getSnakeHeadBoundingBox().intersectsBox(this.food.getFoodBoundingBox())) {

            this.scene.remove(this.food.getFoodMesh())
            const snakeTailObject = this.food.getNewFoodMesh().clone();
            this.snakeHead.getSnakeHeadMesh().add(snakeTailObject)
            this.food.setFoodCount(0)

            this.iterator += 0.5;
            snakeTailObject.position.set(0, 0, this.iterator)
            this.snakeHeadMesh.add(snakeTailObject)

            Food.getInstance().spawnNewFood(this.scene, this.world)
            Food.getInstance().countFood(this.scene)
        }
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new CollisionDetector()
        else return this.instance
    }
}