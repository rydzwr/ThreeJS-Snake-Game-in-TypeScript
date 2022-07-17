import * as CANNON from 'cannon-es'

export class World {
    private static instance: World;
    private word = new CANNON.World();

    getWorld(): CANNON.World {
        return this.word;
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new World()
        else return this.instance
    }
}