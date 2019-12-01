import { Actor } from "../../Entity/Actor";
import { World } from "../../world";

export abstract class Action {
    actor: Actor;
    constructor(actor: Actor) {
        this.actor = actor;
    }
    abstract perform(world: World): void;
}