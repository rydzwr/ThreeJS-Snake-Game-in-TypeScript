export interface GameObjectLifecycle {
    hasLifecycle: number;
    postInit(): void;
    update(deltaTime: number): void;
}