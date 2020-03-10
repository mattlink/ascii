// Used for converting JSON into object instances

import { Room } from "./Rooms/Room";
import { Player } from "./Actors/Player";
import { Tile } from "./tile";
import { Mob } from "./Actors/Mob";
import { World } from "./world";
import { Item } from "./Items/Item";
import { Shovel } from "./Items/Shovel";
import { Sword } from "./Items/Sword";
import { Menu, MenuOption, MenuTitle } from "./Systems/Menu/Menu";

export class Importer {

    /** Menu Importing (menus,json) */
    public static importMenus(json): Record<string, Menu> {
        if (!json.menus) {
            console.error('IMPORTER: Error importing menus. Please make sure menus.json has a \"menus\" field.');
        }

        Menu.width = json.width;
        Menu.height = json.height;
        Menu.defaultFg = json.defaultFg;
        Menu.defaultBg = json.defaultBg;
        Menu.defaultSelectedFg = json.defaultSelectedFg;
        Menu.defaultSelectedBg = json.defaultSelectedBg;

        let menus: Record<string, Menu> = {};

        json.menus.forEach(m => {
            let menu = new Menu();
            menu.name = m.name;

            menu.addElement(new MenuTitle(m.title));

            m.options.forEach(o => {
                let option = new MenuOption(o.name, o.letter);
                if (o.toMenu != null) option.toMenu = o.toMenu;
                if (o.toState != null) option.toState = o.toState;

                if (o.hidden) {
                    menu.options[o.letter] = option;
                } else {
                    menu.addElement(option);
                }
            });

            menus[m.name] = menu;
        });

        return menus;

    }

    /** World Importing (world.json) */
    public static importWorld(json): World {
        if (!json.world) {
            console.error("IMPORTER (World): No `world` provided. Please alter the config file.");
        }
        
        let world = new World();

        if (json.world.rooms) {
            json.world.rooms.forEach(roomJson => {
                let room = this.importRoom({ "room": roomJson });
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

        // initialize the room before loading in actors, and items
        room.init((json.room.BSPIterations || 0), (json.room.CAIterations || 0)); 
        
        if (json.room.actors) {
            json.room.actors.forEach(actor => {
                if (actor.type == 'Mob') {
                    room.addActor(
                        this.importMob(actor)
                    );
                }

                if (actor.type == 'Player') {
                    room.addActor(
                        this.importPlayer(actor)
                    );
                }
            });
        }

        if (json.room.items) {
            json.room.items.forEach(itemJson => {
                let item = this.importItem(itemJson);
                room.placeItem(item);
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

    public static importItem(json): Item {
        let item: Item;
        if (json.type == 'Shovel') {
            item = new Shovel(json.x, json.y, this.importTile(json.tile));
        }
        if (json.type == 'Sword') {
            item = new Sword(json.x, json.y, this.importTile(json.tile));
        }
        return item;
    }

    public static importTile(json): Tile {
        return new Tile(
            json.ascii,
            json.fg,
            json.bg
        )
    }
}