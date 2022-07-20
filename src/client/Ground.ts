import * as THREE from 'three'
import { GridHelper, Object3D } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'

export class Ground extends Object3D implements GameObjectLifecycle {
    public hasLifecycle = 1;

    constructor() {
        super()
        this.name = "ground";

        const phongMaterial = new THREE.MeshPhongMaterial({color: 0x8f4d21})
        const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMesh: THREE.Mesh = new THREE.Mesh(groundGeometry, phongMaterial);
        const grid: THREE.GridHelper = new GridHelper(100, 100)

        groundMesh.rotateX(-Math.PI / 2);
        groundMesh.receiveShadow = true;
       // this.add(grid)
        this.add(groundMesh);
    }

    public postInit(): void {
    }

    public update(deltaTime: number): void {
    }
}