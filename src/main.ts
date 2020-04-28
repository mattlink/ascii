import { Game } from "./Game";
import { World } from "./world";
import { Renderer } from "./Systems/renderer";
import { IO } from "./Systems/io";
import { Menu, MenuInfo } from './Systems/Menu/Menu';
import { Room } from "./Rooms/Room";
import { Tile } from "./tile";
import { Player } from "./Actors/Player";
import { Level } from "./Level";

class game extends Game {

    menus: Record<string, Menu> = {};
    activeMenu: string = null;

    renderer: Renderer;

    world: World;

    load() {

        // TODO: Check for an existing save in localStorage
        this.renderer = new Renderer();

        this.world = new World();

        /* Set Up Game Window */
        this.renderer.addWindow('game', 25, 25, true);
        // this.renderer.addWindow('stats', 25, 3);
        this.renderer.hideAllWindows();

        let room = new Room(25, 25, "Forest");
        room.floorTile = new Tile('.', 'black', 'white');
        room.wallTile = new Tile('Y', 'green', 'white');

        let level = new Level(this.world, 'Level0', 0, 3, room);
        this.world.addLevel(level);

        this.world.spawnThings();
        this.world.initLevels();
        // this.world.connectLevels();

        this.renderer.renderRoom(this.world.getActiveRoom(), 'game');
        this.renderer.showWindows(['game']);

    }

    update(key: string) {

        if (!(IO.validGameControls.indexOf(key) > -1) && !(this.keyQueue.isHolding())) return;

        this.world.getPlayer().receiveKeyInput(key);
        this.world.takeTurn();

    }

    draw() {

        // If the active room has changed then we must render the entire room
        if (this.world.getActiveLevel().getActiveRoomChanged()) {
            this.renderer.renderRoom(this.world.getActiveRoom(), 'game');
        }

        // Draw everything around each actor (above, below, left, and right)
        this.world.getActiveRoom().getActors().forEach(actor => {
            this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.renderer.windows['game'].getContext());
        });

        // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
        this.world.getActiveRoom().getActors().forEach(actor => {
            this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
        });
        

        // // Update the status info and render it
        // (<MenuInfo>this.menus['stats'].elements[0]).content = 'Level: 0';
        // // (<MenuInfo>this.menus['stats'].elements[1]).content = 'Health: ' + this.world.getPlayer().health + '/100';
        // // (<MenuInfo>this.menus['stats'].elements[2]).content = 'Level: ' + this.world.getActiveLevel().depth;
        // this.renderer.renderMenu(this.menus['stats'], this.renderer.windows['stats'].getContext());
    }

}

let g = new game();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
});

