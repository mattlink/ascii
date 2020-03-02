import { Importer } from "./importer";
import { Game } from "./Game";
import { World } from "./world";
import { Window } from './Systems/window';
import { Renderer } from "./Systems/renderer";
import { Player } from "./Actors/Player";
import { IO } from "./Systems/io";
import { Menu, MenuTitle, MenuOption, MenuInfo } from './Systems/Menu/Menu';
import { InventoryMenu } from './Systems/Menu/InventoryMenu';

import * as worldConfig from "./world.json";
import { MenuWindow } from "./Systems/Menu/MenuWindow";
import { Shovel } from "./Items/Shovel";
import { Tile } from "./tile";

enum GameState {
    Play,
    Menu
}

class ga extends Game {

    window: Window;

    menuWindows: Record<string, MenuWindow> = {};
    menus: Record<string, Menu> = {};

    renderer: Renderer;

    world: World;

    state: GameState;

    load() {
        this.state = GameState.Play;
        this.world = Importer.importWorld(worldConfig);

        this.window = new Window(-1, -1, this.world.getActiveRoom().getWidth(), this.world.getActiveRoom().getHeight(), this.world.getActiveRoom().getTiles());

        // create a message box
        this.menus['messagebox'] = new Menu(this.world.getActiveRoom().getWidth(), 1);
        this.menus['messagebox'].addElement(new MenuInfo('You feel tired.', ''));
        this.menuWindows['messagebox'] = new MenuWindow(this.menus['messagebox'], -1, -1, this.world.getActiveRoom().getWidth(), 1);

        // Create an inventory menu
        this.menus['inventory'] = new InventoryMenu(this.world.getActiveRoom().getWidth(), this.world.getActiveRoom().getHeight(), 'Inventory');
        this.menuWindows['inventory'] = new MenuWindow(this.menus['inventory'], -1, -1, this.world.getActiveRoom().getWidth(), this.world.getActiveRoom().getHeight());
        this.menuWindows['inventory'].hide();

        this.menus['status_info'] = new Menu(this.world.getActiveRoom().getWidth(), 20);
        this.menus['status_info'].addElement(new MenuTitle('Turns: 0'));
        this.menuWindows['status_info'] = new MenuWindow(this.menus['status_info'], -1, -1, this.world.getActiveRoom().getWidth(), 20);
        // this.menuWindows['status_info'].hide();

        this.renderer = new Renderer();
        this.renderer.addMenuWindow(this.menuWindows['messagebox']);
        this.renderer.addWindow(this.window);
        this.renderer.addMenuWindow(this.menuWindows['inventory']);
        this.renderer.addMenuWindow(this.menuWindows['status_info']);

        this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());
        

        this.world.getActiveRoom().getActors().forEach(actor => {
            if (actor instanceof Player && this.world.getPlayer() == null) 
            {
                this.world.setPlayer(actor);
                (<InventoryMenu>this.menus['inventory']).establishInventory(this.world.getPlayer().inventory);

                // this.renderer.renderArea(this.world.getPlayer().x - 6,  this.world.getPlayer().y - 6, 12, 12, this.world.getActiveRoom(), this.window.getContext());

                this.renderer.renderGameObject(actor, this.window.getContext());
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.window.getContext());
                return;
            }
        });

    }

    update(key: string) {

        if (this.state == GameState.Menu) {
            if (!(IO.validMenuControls.indexOf(key) > -1)) return;

            // switch state back to playing 
            if (key == 'Escape') {

                // hide the menu window
                this.menuWindows['inventory'].hide();

                // show the game window
                this.window.show();
                this.menuWindows['status_info'].show();
                this.menuWindows['messagebox'].show();
                
                this.state = GameState.Play;
                return;
            }


        }
        

        if (this.state == GameState.Play) {

            if (!(IO.validGameControls.indexOf(key) > -1)) return;

             // switch state to "viewing inventory"
            if (key == 'i') {
                // hide the game window
                this.window.hide();
                this.menuWindows['status_info'].hide();
                this.menuWindows['messagebox'].hide();

                // show the inventory menu
                this.menuWindows['inventory'].show();

                this.state = GameState.Menu;
                return;
            }

            this.world.getPlayer().receiveKeyInput(key);
            this.world.takeTurn();
        }
    }

    draw() {

        if (this.state == GameState.Menu) {
            // locate the menu that we should be viewing (inventory, pause, etc)
            (<InventoryMenu>this.menus['inventory']).establishInventory(this.world.getPlayer().inventory);
            this.renderer.renderMenu(this.menus['inventory'], this.menuWindows['inventory'].getContext());
        }


        if (this.state == GameState.Play) {
            // this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());
            // this.renderer.renderView(this.world.getPlayer(), this.world.getActiveRoom(), this.window.getContext());
            (<MenuInfo>this.menus['messagebox'].elements[0]).content = this.world.getCurrentMessages().join(" ");
            this.renderer.renderMenu(this.menus['messagebox'], this.menuWindows['messagebox'].getContext());

            // Draw everything /around/ each actor
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.window.getContext());
            });

            // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderGameObject(actor, this.window.getContext());
            });

            let vd = this.world.getPlayer().visionDistance;
            for (let i = 0; i < 4; i++) {
                // i == 0 --> up

                // i == 1 --> right

                // i == 2 --> down

                // i == 3 --> left

            }

            // display status info
            (<MenuTitle>this.menus['status_info'].elements[0]).title = 'Turns: ' + this.world.getTurnsPassed();
            this.renderer.renderMenu(this.menus['status_info'], this.menuWindows['status_info'].getContext());

        }
        
    }
}

let g = new ga();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
})
