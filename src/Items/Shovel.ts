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
        
        let toCoords = Action.DirectionToCoords(this.actor.x, this.actor.y, this.dir);

        let toPosX = toCoords[0];
        let toPosY = toCoords[1];

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
        this.name = "shovel";
    }

    use(actor: Actor, dir: ActionDirection, world: World) {
        let action = new ShovelAction(actor, dir);
        let success = action.perform(world);  
        return success;
    }
}