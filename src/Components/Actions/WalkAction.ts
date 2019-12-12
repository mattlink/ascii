import { Action, Direction } from "./Action";
import { Actor }  from "../../Entity/Actors/Actor";
import { Room } from "../../Entity/Rooms/Room";
import { Floor } from "../../Entity/Environment";

export class WalkAction extends Action {
    
    private dir: Direction;

    constructor(dir: Direction, actor: Actor) {
        super(actor);
        this.dir = dir;
    }

    perform(room: Room) {

        let fromObject = room.getObject(this.actor.x, this.actor.y);

        if (this.dir == Direction.Up) {
            let object = room.getObject(this.actor.x, this.actor.y - 1);
            if (!object.collides) {

                if (fromObject instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.y = this.actor.y - 1;

                if (object instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
                
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == Direction.Down) {
            let object = room.getObject(this.actor.x, this.actor.y + 1);
            if (!object.collides) {           
                
                if (fromObject instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.y = this.actor.y + 1;

                if (object instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == Direction.Left) {
            let object = room.getObject(this.actor.x - 1, this.actor.y);
            if (!object.collides) {
                if (fromObject instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.x = this.actor.x - 1;

                if (object instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
                }
                
            } else {
                if (this.actor.debug) {
                    console.log('COLLISION: ', this.actor);
                }
            }
        }
        else if (this.dir == Direction.Right) {
            
            let object = room.getObject(this.actor.x + 1, this.actor.y);
            if (!object.collides) {
                if (fromObject instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).removeOccupation();
                }

                this.actor.x = this.actor.x + 1;

                if (object instanceof Floor) {
                    (<Floor>room.objects[this.actor.x][this.actor.y]).setOccupation(this.actor);
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

