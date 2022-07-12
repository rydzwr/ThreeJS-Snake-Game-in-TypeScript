import * as THREE from 'three'

export class Light {
    private static instance: Light;

    createLight(scene: THREE.Scene) {
        const light = new THREE.DirectionalLight();
        light.position.set(25, 50, 25);
        light.castShadow = true;
        light.shadow.mapSize.width = 16384;
        light.shadow.mapSize.height = 16384;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        scene.add(light);
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new Light();
        else return this.instance;
    }
}