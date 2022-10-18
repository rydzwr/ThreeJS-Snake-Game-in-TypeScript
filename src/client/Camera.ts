import { DirectionalLight, Object3D, PerspectiveCamera, Quaternion, Vector3 } from 'three'
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
    private moveSpeed = 0.05;
    private isScrolling: any;
    private freeMode = false;
    private isDragging = false;

    public constructor() {
        super(60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000);
        this.name = 'camera'

        document.addEventListener( 'wheel', (event) => {
            //window.clearTimeout(this.isScrolling);

            //let forward = new Vector3(0,0,0);
           // this.getWorldDirection(forward);

           // this.offset.add(this.originalOffset.normalize().multiplyScalar(event.deltaY * this.zoomSpeed));

           /* window.setTimeout(() => {

            }, 60);*/
        });

        document.addEventListener('mousemove', (e) => this.moveCamera(e));
    }

    public moveCamera(e: MouseEvent) {
        if (this.isDragging) {
            let rot = new Quaternion();
            this.getWorldQuaternion(rot);

            let forward = new Vector3(0,0,1).applyQuaternion(rot).setY(0);
            let right = new Vector3(1, 0, 0).applyQuaternion(rot).setY(0);

            this.position.add(forward.normalize().multiplyScalar(-e.movementY * this.moveSpeed));
            this.position.add(right.normalize().multiplyScalar(-e.movementX * this.moveSpeed));
        }
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

    public get FreeMode() {
        return this.freeMode;
    }

    public set FreeMode(val: boolean) {
        this.freeMode = val;
        this.isDragging = val;
    }

    public get IsDragging() {
        return this.isDragging;
    }

    public set IsDragging(val: boolean) {
        this.isDragging = val;
    }

    public set Offset(val: Vector3) {
        this.offset = val
        this.originalOffset = val
    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {
        if ((this.target) && (!this.freeMode)) {
            this.lookAt(this.target.position);

            const targetPos = this.target.position.clone().add(this.offset);
            //const newPos = Utils.SmoothDamp(this.position.clone(), targetPos.clone(), this.velocityRef, this.smoothTime, this.maxSpeed, deltaTime)
            const newPos = targetPos

            this.position.set(newPos.x, newPos.y, newPos.z);
        }
    }
}