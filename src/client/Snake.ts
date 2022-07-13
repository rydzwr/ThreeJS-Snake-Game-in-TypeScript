import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { Vector3 } from 'three'

export class Snake {
    private static instance: Snake;
    private phongMaterial = new THREE.MeshPhongMaterial();
    private snakeHeadMaterial = new CANNON.Material('snakeHeadMaterial');
    private snakeHeadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    private snakeHeadMesh: THREE.Mesh = new THREE.Mesh(this.snakeHeadGeometry, this.phongMaterial);
    private snakeHeadBoundingBox = new THREE.Box3(new Vector3(), new Vector3());
    private snakeHeadShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
    private snakeHead = new CANNON.Body({ mass: 1 , material: this.snakeHeadMaterial});

    buildSnakeHead(scene: THREE.Scene, chaseCam: THREE.Object3D, world: CANNON.World) {
        this.snakeHeadMaterial.friction = 10;
        this.snakeHeadMaterial.restitution = 0;

        this.snakeHeadBoundingBox.setFromObject(this.snakeHeadMesh);

        this.snakeHeadMesh.position.y = 0.5;
        this.snakeHeadMesh.castShadow = true;
        scene.add(this.snakeHeadMesh);
        this.snakeHeadMesh.add(chaseCam);

        this.snakeHead.addShape(this.snakeHeadShape);
        this.snakeHead.position.x = this.snakeHeadMesh.position.x;
        this.snakeHead.position.y = this.snakeHeadMesh.position.y;
        this.snakeHead.position.z = this.snakeHeadMesh.position.z;
        world.addBody(this.snakeHead);
    }

    public getSnakeHeadMesh() {
        return this.snakeHeadMesh;
    }

    public getSnakeHeadBoundingBox() {
        return this.snakeHeadBoundingBox;
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new Snake();
        else return this.instance;
    }
}