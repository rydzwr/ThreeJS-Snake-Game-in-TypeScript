import { Snake } from './Snake'

export class MovingController {
    private static instance: MovingController;
    private snakeHeadMesh = Snake.getInstance().getSnakeHeadMesh();

    private thrusting = false;
    private steering = false;
    private speeding = false;
    private jumping = false;

    private worldBorder: number = 49.5;
    private negativeWorldBorder: number = -49.5;

    private moveForward = 0;
    private moveSites = 0;
    private jumpForce = 0;

    private keyMap: { [id: string]: boolean } = {}
    private onDocumentKey = (e: KeyboardEvent) => {
        this.keyMap[e.key] = e.type === 'keydown'
    }

    moveSnakeHead() {
        document.addEventListener('keydown', this.onDocumentKey, false);
        document.addEventListener('keyup', this.onDocumentKey, false);

        this.steering = false;
        this.thrusting = false;
        this.speeding = false;
        this.jumping = false;

        if (this.snakeHeadMesh.position.y < 0.4)
            this.jumpForce = 0

        if (this.keyMap['s'] || this.keyMap['ArrowUp']) {
            if (this.moveForward < 0.15) this.moveForward += 0.002;
            this.thrusting = true;
        }
        if (this.keyMap['w'] || this.keyMap['ArrowDown']) {
            if (this.moveForward > -0.15) this.moveForward -= 0.002;
            this.thrusting = true;
        }
        if (this.keyMap['a'] || this.keyMap['ArrowLeft']) {
            if (this.moveSites > -0.1) this.moveSites -= 0.01;
            this.steering = true;
        }
        if (this.keyMap['d'] || this.keyMap['ArrowRight']) {
            if (this.moveSites < 0.1) this.moveSites += 0.01;
            this.steering = true;
        }
        if (this.keyMap['shift'] || this.keyMap['Shift'] && this.keyMap['w'] || this.keyMap['ArrowDown']) {
            if (this.moveForward < 0.15) this.moveForward -= 0.005;
            this.speeding = true;
        }

        if (this.keyMap[' '])
            if (this.jumpForce < 0.15) this.jumpForce += 0.01;


        if (this.snakeHeadMesh.position.y >= 1.2 && this.jumpForce > 0) {
            this.jumpForce -= 0.07
        }

        if (!this.speeding) {
            if (this.moveForward < -0.15) {
                this.moveForward = -0.15;
            }
        }

        if (!this.thrusting) {
            //not going forward or backwards so gradually slow down
            if (this.moveForward > 0) {
                this.moveForward -= 0.03;
            }
            if (this.moveForward < 0) {
                this.moveForward += 0.03;
            }
        }
        if (!this.steering) {
            //not going left or right so gradually slow down
            if (this.moveSites > 0) {
                this.moveSites -= 0.03;
            }
            if (this.moveSites < 0) {
                this.moveSites += 0.03;
            }
        }

        if (this.snakeHeadMesh.position.x >= this.worldBorder)
            this.snakeHeadMesh.position.x = this.worldBorder;
        if (this.snakeHeadMesh.position.x <= this.negativeWorldBorder)
            this.snakeHeadMesh.position.x = this.negativeWorldBorder;

        if (this.snakeHeadMesh.position.z >= this.worldBorder)
            this.snakeHeadMesh.position.z = this.worldBorder;
        if (this.snakeHeadMesh.position.z <= this.negativeWorldBorder)
            this.snakeHeadMesh.position.z = this.negativeWorldBorder;

        if (this.snakeHeadMesh.position.y <= 0.5)
            this.snakeHeadMesh.position.y = 0.5;

        this.snakeHeadMesh.translateY(this.jumpForce);
        this.snakeHeadMesh.translateZ(this.moveForward);
        this.snakeHeadMesh.translateX(this.moveSites);
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new MovingController();
        else return this.instance;
    }
}