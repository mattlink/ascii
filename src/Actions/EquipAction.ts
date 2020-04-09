import { Player } from "../Actors/Player";
import { Actor } from "../Actors/Actor";
import { GameObject } from "../GameObject";
import { World } from "../world";
import { Action } from "./Action";
import { Item } from "../Items/Item";

export class EquipAction extends Action {

    item: GameObject; // the item/object we're attempting to equip

    constructor(actor: Actor, item: GameObject) {
        super(actor);
        this.item = item;
    }

    perform(world: World) {
        if (!(this.item instanceof Item)) {
            if (this.actor instanceof Player) world.appendMessage("You fail to equip the " + this.item.name + ".");
            return;
        }

        this.actor.equipt = <Item>this.item;
        if (this.actor instanceof Player) world.appendMessage("You equip the " + this.item.name + ".");
        return;
    }

}