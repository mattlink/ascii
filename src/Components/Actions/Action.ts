import { Actor } from "../../Entity/Actors/Actor";
import { Room } from "../../Entity/Rooms/Room";

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
    abstract perform(room: Room): void;
}