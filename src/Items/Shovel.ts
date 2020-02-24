import { Action, ActionDirection } from "../Actions/Action";
import { Actor } from "../Actors/Actor";
import { World } from "../world";
import { Wall, Floor } from "../Rooms/Environment";
import { GameObject } from "../GameObject";
import { Item } from "./Item";
import { Tile } from "../tile";

class ShovelAction extends Action {
    private dir: ActionDirection;

    constructor(actor: Actor, dir: ActionDirection) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {
        let room = world.getActiveRoom();
        
        let toPosX = null;
        let toPosY = null;
        if (this.dir == ActionDirection.Up) {
            toPosX = this.actor.x;
            toPosY = this.actor.y - 1;
        }
        if (this.dir == ActionDirection.Down) {
            toPosX = this.actor.x;
            toPosY = this.actor.y + 1;
        }
        
        if (this.dir == ActionDirection.Left) {
            toPosX = this.actor.x - 1;
            toPosY = this.actor.y;
        }
        if (this.dir == ActionDirection.Right) {
            toPosX = this.actor.x + 1;
            toPosY = this.actor.y;
        }

        if (room.objects[toPosX][toPosY] instanceof Wall) {
            // Add the wall to the actors inventory
            this.actor.inventory.push(room.objects[toPosX][toPosY]);

            // Put a floor tile where the Wall that we just dug was
            room.objects[toPosX][toPosY] = new Floor(toPosX, toPosY, room.floorTile);
            return true;
        }

        return false;
    }
}

export class Shovel extends Item {

    constructor(x: number, y: number, tile: Tile) {
        super(x, y, tile);
    }

    use(actor: Actor, dir: ActionDirection, world: World) {
        let action = new ShovelAction(actor, dir);
        let success = action.perform(world);  
        return success;
    }
}