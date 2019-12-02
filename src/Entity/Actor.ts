import { GameObject } from './GameObject'; 
import { Tile } from '../tile';
import { World } from '../world';
import { Action } from '../Components/Actions/Action';

// essentially, "Actors" are GameObjects that are allowed to takeTurns.

export abstract class Actor extends GameObject {

    public nextAction: Action;

    constructor(x: number, y: number, tile: Tile){
        super(x, y, tile);
    }

    abstract takeTurn(world: World): void;
}