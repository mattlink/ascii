// Used for converting JSON into object instances

import { Room } from "./Rooms/Room";
import { Player } from "./Actors/Player";
import { Tile } from "./tile";
import { Mob } from "./Actors/Mob";
import { World } from "./world";

export class Importer {
    public static importWorld(json): World {
        if (!json.world) {
            console.error("IMPORTER (World): No `world` provided. Please alter the config file.");
        }
        
        let world = new World();

        if (json.world.rooms) {
            json.world.rooms.forEach(roomJson => {
                let room = this.importRoom({ "room": roomJson });
                room.init();
                world.addRoom(room);
            });
        }

        return world;
    }

    public static importRoom(json): Room {

        if (!json.room) {
            console.error("IMPORTER (Room): No `room` provided. Please alter the config file.");
            return;
        }

        let room = new Room(json.room.width, json.room.height, json.room.name);

        if (json.room.floorTile) {
            room.floorTile = new Tile(json.room.floorTile.ascii, json.room.floorTile.fg, json.room.floorTile.bg);
        }

        if (json.room.wallTile) {
            room.wallTile = new Tile(json.room.wallTile.ascii, json.room.wallTile.fg, json.room.wallTile.bg);
        }
        
        if (json.room.actors) {
            json.room.actors.forEach(actor => {
                if (actor.type == 'mob') {
                    room.addActor(
                        this.importMob(actor)
                    );
                }

                if (actor.type == 'player') {
                    room.addActor(
                        this.importPlayer(actor)
                    );
                }
            });
        }

        return room;
    }

    public static importMob(json): Mob {
        return new Mob(
            json.name, 
            json.x, 
            json.y, 
            this.importTile(json.tile)
        );
    }

    public static importPlayer(json): Player {
        return new Player(
            json.x,
            json.y, 
            this.importTile(json.tile)
        )
    }

    public static importTile(json): Tile {
        return new Tile(
            json.ascii,
            json.fg,
            json.bg
        )
    }
}