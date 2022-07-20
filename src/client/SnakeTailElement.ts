import { AxesHelper, Object3D, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import * as THREE from 'three'

export class SnakeTailElement extends Object3D implements GameObjectLifecycle {
    public  hasLifecycle = 1

    private target: Object3D;
    private distance: number;

    constructor(previous: Object3D, distance: number) {
        super()
        this.name = "snakeElement";
        this.target = previous;
        this.distance = distance;

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
            //this.lookAt(this.target.position);

            const forward = new Vector3(0,0,0);
            this.getWorldDirection(forward);

            const targetPos = this.target.position.clone()
            //targetPos.add(forward.multiplyScalar(this.distance));

            this.position.set(targetPos.x, 0.5, targetPos.z + this.distance);
        }
    }
}