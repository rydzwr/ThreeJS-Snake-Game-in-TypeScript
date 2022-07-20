import { DirectionalLight, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'

export class MyCamera extends Object3D implements GameObjectLifecycle {
    public hasLifecycle = 1

    private camera: PerspectiveCamera
    private target: Object3D | undefined = undefined

    public constructor() {
        super()
        this.name = 'camera'

        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        )
        this.add(this.camera)
    }

    public get Camera() {
        return this.camera
    }

    public get Target() {
        return this.target
    }

    public set Target(val: Object3D | undefined) {
        this.target = val
    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {
        if (this.target) {
            this.camera.lookAt(this.target.position)

            //this.camera.position.set(this.target.position.x, 0, this.target.position.z)
            this.camera.position.x = this.target.position.x
            this.camera.position.z = this.target.position.z
        }
    }
}