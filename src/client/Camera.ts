import { DirectionalLight, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'
import { MyScene } from './Scene'

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

    public checkScrollDirection(): number {
        let cameraYMove = 0
        window.addEventListener('wheel', function(event) {
            function checkScrollDirectionIsUp(event: any) {
                if (event.wheelDelta) {
                    return event.wheelDelta > 0;
                }
                return event.deltaY < 0;
            }

            if (checkScrollDirectionIsUp(event)) {
                console.log('UP');
                cameraYMove += 1
            } else {
                console.log('Down');
                cameraYMove -= 1
            }
        })
        return cameraYMove
    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {
        const cameraYMove = this.checkScrollDirection()
        if (this.target) {
            this.camera.lookAt(this.target.position)

            //this.camera.position.set(this.target.position.x, 0, this.target.position.z)
            this.camera.position.x = this.target.position.x
            this.camera.position.z = this.target.position.z
            this.camera.position.y += cameraYMove
        }
    }
}