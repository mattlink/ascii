import { Actor } from "../Actors/Actor";
import { Action } from "./Action";
import { World } from "../world";
import { Floor } from "../Rooms/Environment";
import { Item } from "../Items/Item";
import { GameObject } from "../GameObject";
import { EquipAction } from "./EquipAction";

export class PickupItemAction extends Action {
    constructor(actor: Actor) {
        super(actor);
    }

    perform(world: World) {
        let onObject = world.getActiveRoom().getObject(this.actor.x, this.actor.y);
        if (onObject instanceof Floor && (<Floor>onObject).getObjects().length > 0) {
             
            let item = <Item>(<Floor>onObject).getObjects().shift();

            this.actor.addInventoryItem(item);
            world.appendMessage("You pick up the " + item.name + ".");

            // If the actor had nothing else in their inventory, equip this item
            if (Object.keys(this.actor.inventory).length == 1) {
                let equipAction = new EquipAction(this.actor, item);
                equipAction.perform(world);
            }

            // replace the tile with floor (since the item is no longer on floor, but in player's inventory)
            world.getActiveRoom().objects[this.actor.x][this.actor.y] = new GameObject(this.actor.x, this.actor.y, world.getActiveRoom().floorTile);
        }
    }

}