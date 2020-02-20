import { GameObject } from '../GameObject'; 
import { Tile } from '../tile';
import { World } from '../world';
import { Action } from '../Actions/Action';
import { Item } from '../Items/Item';

// essentially, "Actors" are GameObjects that are allowed to takeTurns and have names.

export abstract class Actor extends GameObject {

    public nextAction: Action;
    public name: string;

    public equipt: Item;

    public debug: boolean = false;

    constructor(name: string, x: number, y: number, tile: Tile){
        super(x, y, tile);
        this.name = name;
    }

    abstract takeTurn(world: World): void;
}