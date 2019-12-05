import { Action, Direction } from "./Action";
import { Actor }  from "../../Entity/Actor";
import { World } from "../../world";
import { Floor } from "../../Entity/Environment";
import { GameObject } from "../../Entity/GameObject";

// export enum WalkDirection {
//     Up,
//     Down,
//     Left,
//     Right
// }

export class WalkAction extends Action {
    
    private dir: Direction;

    constructor(dir: Direction, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(world: World) {

        let fromObject = world.getObject(this.actor.x, this.actor.y);

        if (this.dir == Direction.Up) {
            let object = world.getObject(this.actor.x, this.actor.y - 1);
            if (!object.collides) {

                if (fromObject instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.y = this.actor.y - 1;

                if (object instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
                
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == Direction.Down) {
            let object = world.getObject(this.actor.x, this.actor.y + 1);
            if (!object.collides) {           
                
                if (fromObject instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.y = this.actor.y + 1;

                if (object instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == Direction.Left) {
            let object = world.getObject(this.actor.x - 1, this.actor.y);
            if (!object.collides) {
                if (fromObject instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.x = this.actor.x - 1;

                if (object instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
                
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == Direction.Right) {
            
            let object = world.getObject(this.actor.x + 1, this.actor.y);
            if (!object.collides) {
                if (fromObject instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.x = this.actor.x + 1;

                if (object instanceof Floor) {
                    (<Floor>world.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
                
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }

        // In theory, if we DONT do the rendering update here, then the movement is completely independent of the renderer which is ideal

    }
}

