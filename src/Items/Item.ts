import { Action, ActionDirection } from "../Actions/Action";
import { Actor } from "../Actors/Actor";
import { World } from "../world";
import { Wall } from "../Rooms/Environment";
import { GameObject } from "../GameObject";

export abstract class Item extends GameObject {
    // Associated action
    // abstract action: Action;

    abstract damage: number;

    abstract use(actor: Actor, dir: ActionDirection, world: World);
}