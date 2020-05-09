import { GameObject } from "../GameObject";
import { ShopItem } from "./ShopItem";
import { Tile } from "../tile";

export class Turret extends ShopItem {

    static tile = new Tile('T', 'yellow', 'black');
    public cost = 20;

    constructor(x: number, y: number) {
        super(x, y, Turret.tile);
        this.collides = true;
    }
}