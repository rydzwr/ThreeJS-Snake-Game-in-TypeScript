import { DirectionalLight, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { MyScene } from './Scene'
import { Utils } from './Utils'
import { InputManager } from './Input'

export class MyCamera extends PerspectiveCamera implements GameObjectLifecycle {
    public hasLifecycle = 1

    private target: Object3D | undefined = undefined
    private offset = new Vector3(0, 10, 10);
    private originalOffset = this.offset;
    private velocityRef = new Vector3(0,0,0);
    private smoothTime = 0.1;
    private maxSpeed = 7;
    private zoomSpeed = 0.02;
    private isScrolling: any;

    public constructor() {
        super(60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000);
        this.name = 'camera'

        document.addEventListener( 'wheel', (event) => {
            window.clearTimeout(this.isScrolling);

           // let forward = new Vector3(0,0,0);
           // this.getWorldDirection(forward);

           // this.offset.add(this.originalOffset.normalize().multiplyScalar(event.deltaY * this.zoomSpeed));

           /* window.setTimeout(() => {

            }, 60);*/
        });
    }

    public get Target() {
        return this.target
    }

    public set Target(val: Object3D | undefined) {
        this.target = val
    }

    public get Offset() {
        return this.offset
    }

    public set Offset(val: Vector3) {
        this.offset = val
        this.originalOffset = val
    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {
        /*if (this.target) {
            this.camera.lookAt(this.target.position)

            //this.camera.position.set(this.target.position.x, 0, this.target.position.z)
            this.camera.position.x = this.target.position.x
            this.camera.position.z = this.target.position.z
            //this.camera.position.y += cameraYMove
        }*/

        if (this.target) {
            this.lookAt(this.target.position);

            const targetPos = this.target.position.clone().add(this.offset);
            const newPos = Utils.SmoothDamp(this.position.clone(), targetPos.clone(), this.velocityRef, this.smoothTime, this.maxSpeed, deltaTime)

            this.position.set(newPos.x, newPos.y, newPos.z);
        }
    }
}