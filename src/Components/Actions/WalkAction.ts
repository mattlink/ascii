import { Action } from "./Action";
import { Actor }  from "../../Entity/Actor";
import { World } from "../../world";

export enum WalkDirection {
    Up,
    Down,
    Left,
    Right
}

export class WalkAction extends Action {
    
    private dir: WalkDirection;

    constructor(dir: WalkDirection, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {
        // TODO: We want to handle collisions here

        if (this.dir == WalkDirection.Up) {
            if (!(this.actor.y - 1 <= 0)) {
                this.actor.y = this.actor.y - 1;
            }
        }
        else if (this.dir == WalkDirection.Down) {
            if (this.actor.y + 1 < world.getHeight() - 1) {
                this.actor.y = this.actor.y + 1;
            }
        }
        else if (this.dir == WalkDirection.Left) {
            if (!(this.actor.x - 1 <= 0)) {
                this.actor.x = this.actor.x - 1;
            }
        }
        else if (this.dir == WalkDirection.Right) {
            if (this.actor.x + 1 < world.getWidth() - 1) {
                this.actor.x = this.actor.x + 1;
            }
        }

        // In theory, if we DONT do the rendering update here, then the movement is completely independent of the renderer which is ideal

    }
}