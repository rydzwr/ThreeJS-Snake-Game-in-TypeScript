import * as THREE from 'three'

export class Scene {
    private static instance: Scene;
    private scene = new THREE.Scene();

    getScene(): THREE.Scene {
        return this.scene;
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new Scene()
        else return this.instance
    }
}