import { Actor } from "../Actors/Actor";
import { Action } from "./Action";
import { World } from "../world";
import { Item } from "../Items/Item";

export class PickupItemAction extends Action {
    constructor(actor: Actor) {
        super(actor);
    }

    perform(world: World) {
        if (world.getActiveRoom().getObject(this.actor.x, this.actor.y) instanceof Item) {
            
        }
    }

}