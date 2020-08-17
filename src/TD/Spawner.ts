import { Actor } from "../Actors/Actor";
import { GameObject } from "../GameObject";
import { Room } from '../Rooms/Room'
import { Tile } from "../tile";
import { World } from '../world';
import { Orc } from '../Actors/Orc'

export class Spawner extends Actor {
    public level: number = 0;
    public turn: number = 0;
    private room : Room;

    constructor(x: number, y: number, room: Room) {
        super('Spawner', x, y, new Tile('S', 'red', 'black'));
        this.room = room;
    }

    takeTurn(world: World): void {
        if (this.turn % 3 == 0) {
            this.room.addActor(new Orc("Orc", this.x, this.y, new Tile('O', 'green', 'purple')));
        }

        this.turn = this.turn + 1;
    };

    death(_world: World): GameObject[] {
        return [];
    };
}
