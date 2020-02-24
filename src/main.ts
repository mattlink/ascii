import { Importer } from "./importer";
import { Game } from "./Game";
import { World } from "./world";
import { Window } from './Systems/window';
import { Renderer } from "./Systems/renderer";
import { Player } from "./Actors/Player";
import { IO } from "./Systems/io";
import { Menu, MenuTitle, MenuTable } from './Systems/Menu/Menu';

import * as worldConfig from "./world.json";
import { MenuWindow } from "./Systems/Menu/MenuWindow";

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

        // Create an inventory menu
        this.menus['inventory'] = new Menu(this.world.getActiveRoom().getWidth(), this.world.getActiveRoom().getHeight());
        this.menus['inventory'].addElement(new MenuTitle('Inventory'))
        this.menus['inventory'].addElement(new MenuTable());
        this.menuWindows['inventory'] = new MenuWindow(this.menus['inventory'], -1, -1, this.world.getActiveRoom().getWidth(), this.world.getActiveRoom().getHeight());
        this.menuWindows['inventory'].hide();

        this.renderer = new Renderer();
        this.renderer.addWindow(this.window);
        this.renderer.addMenuWindow(this.menuWindows['inventory']);

        this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());

        this.world.getActiveRoom().getActors().forEach(actor => {

            if (actor instanceof Player && this.world.getPlayer() == null) this.world.setPlayer(actor);

            this.renderer.updateGameObject(actor, this.window.getContext());
            this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.window.getContext());
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
                
                this.state = GameState.Play;
                console.log('state changing to play');
                return;
            }


        }
        

        if (this.state == GameState.Play) {

            if (!(IO.validGameControls.indexOf(key) > -1)) return;

             // switch state to "viewing inventory"
            if (key == 'i') {
                // hide the game window
                this.window.hide();

                // show the inventory menu
                this.menuWindows['inventory'].show();

                this.state = GameState.Menu;

                console.log('state changing to menu');
                return;
            }

            this.world.getPlayer().receiveKeyInput(key);
            this.world.takeTurn();
        }
    }

    draw() {

        if (this.state == GameState.Menu) {
            // locate the menu that we should be viewing (inventory, pause, etc)
            console.log("DRAWING MENU STATE");
            (<MenuTable>this.menus['inventory'].elements[1]).elements = this.world.getPlayer().inventory;
            this.renderer.renderMenu(this.menus['inventory'], this.menuWindows['inventory'].getContext());
        }


        if (this.state == GameState.Play) {
            console.log('DRAWING GAME STATE');
            this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());

            // Draw everything /around/ each actor
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.window.getContext());
            });

            // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.updateGameObject(actor, this.window.getContext());
            });
        }
        
    }
}

let g = new ga();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
})
