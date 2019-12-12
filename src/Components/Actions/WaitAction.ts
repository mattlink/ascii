import { Actor } from "../../Entity/Actors/Actor";
import { Action } from "./Action";
import { Room } from "../../Entity/Rooms/Room";

export class WaitAction extends Action {
    constructor(actor: Actor) {
        super(actor);
    }

    perform(room: Room) {
        // Do nothing. Just wait.
    }
}