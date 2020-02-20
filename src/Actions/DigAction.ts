// import { Action, ActionDirection } from './Action';
// import { Actor } from '../Actors/Actor';
// import { World } from '../world'; 
// import { GameObject } from '../GameObject';

// export class DigAction extends Action {
//     private dir: ActionDirection;
//     private onObject: GameObject;

//     constructor(dir: ActionDirection, actor: Actor, onObject?: GameObject) {
//         super(actor);
//         this.dir = dir;
//         this.onObject = onObject;
//     }

//     perform(world: World) {
//         let room = world.getActiveRoom();
        
//         let toObject = null;
//         if (this.dir == ActionDirection.Up) toObject = room.getObject(this.actor.x, this.actor.y - 1);
//         if (this.dir == ActionDirection.Down) toObject = room.getObject(this.actor.x, this.actor.y + 1);
//         if (this.dir == ActionDirection.Left) toObject = room.getObject(this.actor.x - 1, this.actor.y);
//         if (this.dir == ActionDirection.Right) toObject = room.getObject(this.actor.x + 1, this.actor.y);

        
//     }
// }