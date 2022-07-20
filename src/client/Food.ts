import {
    AmbientLight,
    Box3,
    BoxGeometry,
    HemisphereLight,
    Light,
    Mesh,
    MeshPhongMaterial,
    Object3D, SpotLight,
    Vector3,
} from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'

export class Food extends Object3D implements GameObjectLifecycle {
    private static readonly foodRotationSpeed = 0.5 * Math.PI;

    public hasLifecycle = 1;

    private mesh: Mesh;
    private bb: Box3;

    constructor(position: Vector3) {
        super()
        this.name = "food";

        const phongMaterial = new MeshPhongMaterial({ color: 0xad1111 })
        const foodGeometry = new BoxGeometry(0.5, 0.5, 0.5)

        this.mesh = new Mesh(foodGeometry, phongMaterial)
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true
        this.add(this.mesh)

        this.bb = new Box3(new Vector3(), new Vector3())
        this.bb.setFromObject(this.mesh)
    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {
        this.mesh.rotation.z += Food.foodRotationSpeed * deltaTime;
        this.mesh.rotation.x += Food.foodRotationSpeed * deltaTime;
    }

    public getFoodBoundingBox() {
        return this.bb
    }
}