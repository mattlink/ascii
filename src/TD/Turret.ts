import { ShopItem } from "./ShopItem";
import { Tile } from "../tile";
import { World } from "../world";
import { Floor } from "../Rooms/Environment";
import { Actor } from "../Actors/Actor";

export class Turret extends ShopItem {

    static tile = new Tile('T', 'yellow', 'black');
    static range = 3;
    public cost = 20;

    constructor(x: number, y: number) {
        super(x, y, Turret.tile);
        //this.collides = true;
        this.destructible = true;
    }

    takeTurn(world: World) {

        // Locate the nearest enemy
        let shortestDist = Turret.range;
        let enemy: Actor = null;

        // Check to the right
        for (let i = this.x; i < Math.min(this.x + Turret.range, world.getRoom().getWidth()); i++) {
            if (world.getRoom().objects[i][this.y] instanceof Floor && (<Floor>world.getRoom().objects[i][this.y]).getOccupation() != null) {
                let d = i - this.x;
                if (d < shortestDist) {
                    shortestDist = d;
                    enemy = (<Floor>world.getRoom().objects[i][this.y]).getOccupation();
                }
            }
        }

        // Check to the left
        for (let i = Math.max(this.x - Turret.range, 0); i < this.x; i++) {
            if (world.getRoom().objects[i][this.y] instanceof Floor && (<Floor>world.getRoom().objects[i][this.y]).getOccupation() != null) {
                let d = this.x - i;
                if (d < shortestDist) {
                    shortestDist = d;
                    enemy = (<Floor>world.getRoom().objects[i][this.y]).getOccupation();
                }
            }
        }

        // Check below
        for (let j = this.y; j < Math.min(this.y + Turret.range, world.getRoom().getHeight()); j++) {
            if (world.getRoom().objects[this.x][j] instanceof Floor && (<Floor>world.getRoom().objects[this.x][j]).getOccupation() != null) {
                let d = j - this.y;
                if (d < shortestDist) {
                    shortestDist = d;
                    enemy = (<Floor>world.getRoom().objects[this.x][j]).getOccupation();
                }
            }
        }

        // Check above
        for (let j = Math.max(this.y - Turret.range, 0); j < this.y; j++) {
            if (world.getRoom().objects[this.x][j] instanceof Floor && (<Floor>world.getRoom().objects[this.x][j]).getOccupation() != null) {
                let d = this.y - j;
                if (d < shortestDist) {
                    shortestDist = d;
                    enemy = (<Floor>world.getRoom().objects[this.x][j]).getOccupation();
                }
            }
        }

        // Attack the closest enemy
        if (enemy == null) {
            return;
        }

        // Invoke the enemy's death (this is where the enemy is actually removed)
        if (enemy.health == 0) {
            enemy.death(world);

            // Remove the enemy from the room.
            (<Floor>world.getRoom().objects[enemy.x][enemy.y]).removeOccupation();

            world.getRoom().actors = world.getRoom().actors.filter(a => {
                return a != enemy;
            });

            return;
        }

        // Damage the enemy
        enemy.tile.bg = 'red';
        enemy.health -= 1;

        // Remove the enemy tile if it has run out of health (this is where the enemy is visually removed)
        if (enemy.health == 0) {
            enemy.tile = world.getRoom().floorTile;

            // reward the player for killing the Orc
            world.addFunds(5);

        }
    }
}
