import * as THREE from 'three'
import { Vector3 } from 'three'
import { Food } from './Food'

export class Snake {
    private static instance: Snake;

    // ------------------------ MAIN SHAPE ------------------------
    private skullMaterial = new THREE.MeshPhongMaterial({color: 0x307016});
    private snakeHeadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.9, 0.7, 1.2);
    private snakeHeadMesh: THREE.Mesh = new THREE.Mesh(this.snakeHeadGeometry, this.skullMaterial);
    private snakeHeadBoundingBox = new THREE.Box3(new Vector3(), new Vector3());

    // ------------------------ FOREHEAD ------------------------
    private foreheadMaterial = new THREE.MeshPhongMaterial({color: 0x45b518});
    private foreheadGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.9);
    private foreheadMesh: THREE.Mesh = new THREE.Mesh(this.foreheadGeometry, this.foreheadMaterial);

    // ------------------------ NOSE ------------------------
    private noseMaterial = new THREE.MeshPhongMaterial({color: 0x307016});
    private noseGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.5);
    private noseMesh: THREE.Mesh = new THREE.Mesh(this.noseGeometry, this.noseMaterial);

    // ------------------------ NOSE HOLE ------------------------
    private noseHoleMaterial = new THREE.MeshPhongMaterial({color: 0x2a2e29});
    private noseHoleGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.1);
    private noseHoleMesh: THREE.Mesh = new THREE.Mesh(this.noseHoleGeometry, this.noseHoleMaterial);
    private noseHoleMesh2 = this.noseHoleMesh.clone();

    // ------------------------ EYE ------------------------
    private eyeMaterial = new THREE.MeshPhongMaterial({color: 0x9e0000});
    private eyeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
    private eyeMesh: THREE.Mesh = new THREE.Mesh(this.eyeGeometry, this.eyeMaterial);
    private eyeMesh2 = this.eyeMesh.clone();

    private food = Food.getInstance()

    private iterator: number = 0.35

    buildSnakeHead(scene: THREE.Scene /*, chaseCam: THREE.Object3D */) {

        this.snakeHeadBoundingBox.setFromObject(this.snakeHeadMesh);

        this.snakeHeadMesh.position.y = 0.35;
        this.snakeHeadMesh.castShadow = true;
        scene.add(this.snakeHeadMesh);
        //this.snakeHeadMesh.add(chaseCam);

        //forehead
        this.snakeHeadMesh.add(this.foreheadMesh)
        this.foreheadMesh.position.set(0,0.45,0.15)

        //nose
        this.snakeHeadMesh.add(this.noseMesh)
        this.noseMesh.position.set(0,-0.1,-0.8)

        //nose holes
        this.noseMesh.add(this.noseHoleMesh)
        this.noseHoleMesh.position.set(0.2,0.23,-0.3)

        this.noseMesh.add(this.noseHoleMesh2)
        this.noseHoleMesh2.position.set(-0.2,0.23,-0.3)

        //eyes
        this.foreheadMesh.add(this.eyeMesh)
        this.eyeMesh.position.set(0.2,0.23,-0.3)

        this.foreheadMesh.add(this.eyeMesh2)
        this.eyeMesh2.position.set(-0.2,0.23,-0.3)

        this.buildTail(2)
    }

    buildTail(length: number) {
        for (let i = 0; i < length; i++) {
            const snakeTailObject = this.food.getNewFoodMesh().clone();
            this.snakeHeadMesh.add(snakeTailObject)

            this.iterator += 0.55;
            snakeTailObject.position.set(0, 0, this.iterator)
            this.snakeHeadMesh.add(snakeTailObject)
        }
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