import { Color, DirectionalLight, Light, Object3D, Vector3 } from 'three'
import { GameObjectLifecycle } from './GameObjectLifecycle'

export class MyCustomLight extends Object3D implements GameObjectLifecycle {
    public hasLifecycle = 1;

    public constructor() {
        super();
        this.name = "light";

        const light = new DirectionalLight();
        light.position.set(25, 50, 25);
        light.castShadow = true;
        this.add(light);
    }

    public updateGradient(snakePosition: Vector3)
    {

    }

    public postInit(): void {

    }

    public update(deltaTime: number): void {

    }
}