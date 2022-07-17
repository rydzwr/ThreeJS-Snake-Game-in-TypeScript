import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export class Ground {
    private static instance: Ground;
    private phongMaterial = new THREE.MeshPhongMaterial();
    private groundMaterial = new CANNON.Material('groundMaterial');
    private grid = new THREE.GridHelper(100,100);
    private groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 100);
    private groundMesh: THREE.Mesh = new THREE.Mesh(this.groundGeometry, this.phongMaterial);

    buildGround(scene: THREE.Scene, world: CANNON.World) {
        this.groundMaterial.friction = 10;
        this.groundMaterial.restitution = 0.25;

        scene.add(this.grid);

        this.groundMesh.rotateX(-Math.PI / 2);
        this.groundMesh.receiveShadow = true;
        this.grid.rotateX(Math.PI / 2);
        this.groundMesh.add(this.grid);
        scene.add(this.groundMesh);
        const groundShape = new CANNON.Box(new CANNON.Vec3(50, 1, 50));
        const groundBody = new CANNON.Body({ mass: 0, material: this.groundMaterial });
        groundBody.addShape(groundShape);
        groundBody.position.set(0, -1, 0);
        world.addBody(groundBody);
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new Ground();
        else return this.instance;
    }
}