import { GameObject } from '../GameObject'; 
import { Tile } from '../tile';
import { World } from '../world';
import { Action } from '../Actions/Action';
import { Item } from '../Items/Item';

// essentially, "Actors" are GameObjects that are allowed to takeTurns and have names.

export class Corpse extends GameObject {

    constructor(actor: Actor) {
        super(actor.x, actor.y, new Tile('%', actor.getTile().fg, actor.getTile().bg));
        this.name = actor.name + ' corpse';
    }

}

export abstract class Actor extends GameObject {

    public nextAction: Action;
    public name: string;

    public equipt: Item;

    public inventory: GameObject[];

    public debug: boolean = false;

    constructor(name: string, x: number, y: number, tile: Tile){
        super(x, y, tile);
        this.name = name;
        this.inventory = [];
    }

    abstract takeTurn(world: World): void;

    abstract death(world: World): GameObject[];
}