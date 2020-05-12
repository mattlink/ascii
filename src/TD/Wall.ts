import { ShopItem } from "./ShopItem";
import { Tile } from "../tile";

export class Wall extends ShopItem {

    static tile = new Tile('W', 'brown', 'black');
    public cost = 10;

    constructor(x: number, y: number) {
        super(x, y, Wall.tile);
        this.destructible = true;
        this.name = 'Wall';
    }

    takeTurn() {
        // wall's should do nothing as part of their turn
    }
}
