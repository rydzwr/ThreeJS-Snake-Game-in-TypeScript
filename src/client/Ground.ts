import * as THREE from 'three'

export class Ground {
    private static instance: Ground;
    private phongMaterial = new THREE.MeshPhongMaterial({color: 0x8f4d21});
    //private grid = new THREE.GridHelper(100,100);
    private groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 100);
    private groundMesh: THREE.Mesh = new THREE.Mesh(this.groundGeometry, this.phongMaterial);

    buildGround(scene: THREE.Scene) {
        //scene.add(this.grid);
        this.groundMesh.rotateX(-Math.PI / 2);
        this.groundMesh.receiveShadow = true;
        //this.grid.rotateX(Math.PI / 2);
        //this.groundMesh.add(this.grid);
        scene.add(this.groundMesh);
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new Ground();
        else return this.instance;
    }
}