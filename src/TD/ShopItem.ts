import { GameObject } from "../GameObject";
import { World } from "../world";

export abstract class ShopItem extends GameObject {
    public cost;

    abstract takeTurn(world: World);
}