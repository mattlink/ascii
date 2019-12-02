import { Actor } from "../../Entity/Actor";
import { Action } from "./Action";
import { World } from "../../world";

export class WaitAction extends Action {
    constructor(actor: Actor) {
        super(actor);
    }

    perform(world: World) {
        // Do nothing. Just wait.
    }
}