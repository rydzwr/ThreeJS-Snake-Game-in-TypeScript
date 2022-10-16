import { Box3, BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'

export class FoodSpawner extends Object3D implements GameObjectLifecycle {
    public hasLifecycle = 1;

    private mesh: Mesh;
    private bbMesh: Mesh;
    private bb: Box3;

    constructor(position: Vector3) {
        super()
        this.name = "foodSpawner";

        const phongMaterial = new MeshPhongMaterial({ color: 0xad1111 })
        const foodSpawnerGeometry = new BoxGeometry(5, 0.5, 5)

        const foodSpawnerBBSize = new BoxGeometry(4.5, 0.5, 4.5);
        this.bbMesh = new Mesh(foodSpawnerBBSize, phongMaterial);

        this.bbMesh.position.set(position.x, position.y, position.z);

        this.mesh = new Mesh(foodSpawnerGeometry, phongMaterial)
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true
        this.add(this.mesh)
        this.add(this.bbMesh)

        this.bb = new Box3(new Vector3(), new Vector3())
        this.bb.setFromObject(this.bbMesh)
    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {
    }

    public getfoodSpawnerBoundingBox() {
        return this.bb
    }
}
