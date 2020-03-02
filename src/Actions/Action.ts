import { Actor } from "../Actors/Actor";
import { World } from "../world";

export enum ActionDirection {
    Up,
    Down,
    Left,
    Right,

    UpLeft,
    UpRight,
    DownLeft,
    DownRight
}

export abstract class Action {
    actor: Actor;
    constructor(actor: Actor) {
        this.actor = actor;
    }
    abstract perform(world: World): void;

    public static DirectionToCoords(actorX: number, actorY: number, dir: ActionDirection) {
        let posX = actorX;
        let posY = actorY;

        switch (dir) {
            case ActionDirection.Up:
                posY -= 1;
                break;

            case ActionDirection.Down:
                posY += 1;
                break;
            
            case ActionDirection.Left:
                posX -= 1;
                break;

            case ActionDirection.Right:
                posX += 1;
                break;

            case ActionDirection.UpLeft:
                posX -= 1;
                posY -= 1;
                break;

            case ActionDirection.UpRight:
                posX += 1;
                posY -= 1;
                break;

            case ActionDirection.DownLeft:
                posX -= 1;
                posY += 1;
                break;
            
            case ActionDirection.DownRight:
                posX += 1;
                posY += 1;
                break;
        }

        return [posX, posY];
    }
}