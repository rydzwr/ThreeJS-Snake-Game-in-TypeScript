import { Snake } from './Snake'

export class MovingController {
    private static instance: MovingController;
    private snakeHeadMesh = Snake.getInstance().getSnakeHeadMesh();

    private thrusting = false;
    private steering = false;
    private speeding = false;

    private moveForward = 0;
    private moveSites = 0;

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

        if (!this.speeding) {
            if (this.moveForward < -0.15) {
                this.moveForward = -0.15;
            }
        }

        if (!this.thrusting) {
            //not going forward or backwards so gradually slow down
            if (this.moveForward > 0) {
                this.moveForward -= 0.02;
            }
            if (this.moveForward < 0) {
                this.moveForward += 0.02;
            }
        }
        if (!this.steering) {
            //not going left or right so gradually slow down
            if (this.moveSites > 0) {
                this.moveSites -= 0.02;
            }
            if (this.moveSites < 0) {
                this.moveSites += 0.02;
            }
        }


        this.snakeHeadMesh.translateZ(this.moveForward);
        this.snakeHeadMesh.translateX(this.moveSites);
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new MovingController();
        else return this.instance;
    }
}