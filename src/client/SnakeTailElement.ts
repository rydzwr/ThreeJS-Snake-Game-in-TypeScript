import { AxesHelper, Object3D, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import * as THREE from 'three'

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
        this.add(new AxesHelper(1));
    }

    public postInit(): void {
    }

    public update(deltaTime: number): void {
        if (this.target) {
            this.lookAt(this.target.position);

            const targetPos = this.target.localToWorld(new Vector3(0, 0, -this.distance));
            const newPos = this.SmoothDamp(this.position.clone(), targetPos.clone(), this.velocityRef, this.smoothTime, this.maxSpeed, deltaTime)
            //const newPos = this.position.clone().lerp(targetPos, this.maxSpeed * deltaTime);

           // console.log(targetPos);
           // console.log(newPos);
            this.position.set(newPos.x, newPos.y, newPos.z);
        }
    }

    public SmoothDamp(current: Vector3, target: Vector3, currentVelocity: Vector3,
                      smoothTime: number, maxSpeed: number, deltaTime: number): Vector3 {
        let output = new Vector3(0, 0, 0);

        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;

        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

        const change = current.clone().sub(target);
        const originalTo = target.clone();

        const maxChange = maxSpeed * smoothTime;
        const maxChangeSq = maxChange * maxChange;
        const sqrmag = change.lengthSq();

        if (sqrmag > maxChangeSq)
        {
            const mag = change.length();
            change.divideScalar(mag * maxChange);
        }

        target = current.clone().sub(change);
        const temp = currentVelocity.clone().add(change.clone().multiplyScalar(omega)).multiplyScalar(deltaTime);
        currentVelocity.sub(temp.clone().multiplyScalar(omega)).multiplyScalar(exp);
        output.add(target).add(change.clone().add(temp).multiplyScalar(exp))

        const origMinusCurrent = originalTo.clone().sub(current);
        const outMinusOrig = output.clone().sub(originalTo);

        if (origMinusCurrent.dot(outMinusOrig) > 0)
        {
            output = new Vector3(0,0,0).add(originalTo);
            currentVelocity = output.clone().sub(originalTo).divideScalar(deltaTime);
        }

        return output;
    }
}