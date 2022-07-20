import { AxesHelper, Object3D, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import * as THREE from 'three'
import { Utils } from './Utils'

export class SnakeTailElement extends Object3D implements GameObjectLifecycle {
    public  hasLifecycle = 1

    private target: Object3D;
    private distance: number;
    private velocityRef = new Vector3(0,0,0);
    private smoothTime;
    private maxSpeed = 10;

    constructor(previous: Object3D, distance: number, smoothTime: number = 0.15) {
        super()
        this.name = "snakeElement";
        this.target = previous;
        this.distance = distance;
        this.smoothTime = smoothTime;

        const tailObjMaterial = new THREE.MeshPhongMaterial({color: 0x307016});
        const tailObjGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        const tailObjMesh: THREE.Mesh = new THREE.Mesh(tailObjGeometry, tailObjMaterial)

        this.add(tailObjMesh);
       // this.add(new AxesHelper(1));
    }

    public postInit(): void {
    }

    public update(deltaTime: number): void {
        if (this.target) {
            this.lookAt(this.target.position);

            const targetPos = this.target.localToWorld(new Vector3(0, 0, -this.distance));
            const newPos = Utils.SmoothDamp(this.position.clone(), targetPos.clone(), this.velocityRef, this.smoothTime, this.maxSpeed, deltaTime)

            this.position.set(newPos.x, newPos.y, newPos.z);
        }
    }
}