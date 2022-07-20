export class InputManager {
    private static instance: InputManager
    private keyMap: { [id: string]: boolean } = {};

    constructor() {
        document.addEventListener('keydown', (e) => this.keyMap[e.key] = (e.type === 'keydown'), false);
        document.addEventListener('keyup', (e) => this.keyMap[e.key] = (e.type === 'keydown'), false);
    }

    public getKeyDown(id: string)
    {
        return this.keyMap[id];
    }

    public getKeyUp(id: string)
    {
        return !this.keyMap[id];
    }

    public static getInstance() {
        if (this.instance === undefined)
            return this.instance = new InputManager()
        else return this.instance
    }
}