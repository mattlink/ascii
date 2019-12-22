import { Actor } from "../../Entity/Actors/Actor";
import { World } from "../../world";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export abstract class Action {
    actor: Actor;
    constructor(actor: Actor) {
        this.actor = actor;
    }
    abstract perform(world: World): void;
}