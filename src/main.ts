import { Importer } from "./importer";
import { Game } from "./Game";
import { World } from "./world";
import { Renderer } from "./Systems/renderer";
import { Player } from "./Actors/Player";
import { IO } from "./Systems/io";
import { Menu, MenuOption, MenuInfo, MenuTitle } from './Systems/Menu/Menu';
import { InventoryMenu } from './Systems/Menu/InventoryMenu';
import { GameObject } from './GameObject';
import { Tile } from './tile';

import * as worldConfig from "./world.json";
import * as menusConfig from "./menus.json";
import { Floor } from "./Rooms/Environment";
import { EquipAction } from "./Actions/EquipAction";

enum GameState {
    Play,
    Look,
    Menu
}
class game extends Game {

    menus: Record<string, Menu> = {};
    activeMenu: string = null;

    renderer: Renderer;

    world: World;

    state: GameState;
    lookCursor: GameObject;

    load() {

        // TODO: Check for an existing save in localStorage
        this.renderer = new Renderer();
        this.state = GameState.Menu;
        
        this.menus = Importer.importMenus(menusConfig);

        this.activeMenu = 'start';

        this.lookCursor = new GameObject(0, 0, new Tile('X', 'white','black'));

        // Add windows for all the menus we imported
        for (let key in this.menus) {
            this.renderer.addWindow(key, Menu.width, Menu.height);
        }

        /* Set Up Game-time Menus & Windows */
        this.renderer.addWindow('messagebox', Menu.width, 1);
        this.renderer.addWindow('game', Menu.width, Menu.height, true);
        this.renderer.addWindow('inventory', Menu.width, Menu.height);
        this.renderer.addWindow('status_info', Menu.width);
        
        /**
         * Load the world.
         */
        this.world = Importer.importWorld(worldConfig);

        (<MenuTitle>this.menus['start'].elements[0]).title = `Saravá!`;
        // (<MenuTitle>this.menus['start'].elements[0]).title = `Caves of Bartle`;

        // Create the message box
        this.menus['messagebox'] = new Menu();
        this.menus['messagebox'].addElement(new MenuInfo('You feel tired.', ''));

        // Create the inventory menu
        this.menus['inventory'] = new InventoryMenu('Inventory');
        this.menus['inventory'].options['Escape'] = new MenuOption("Exit", "Escape");
        this.menus['inventory'].options['Escape'].toState = 'Play';

        // Create status info bar 
        this.menus['status_info'] = new Menu();
        this.menus['status_info'].addElement(new MenuInfo('Turns: 0'));
        this.menus['status_info'].addElement(new MenuInfo('Health: ' + this.world.getPlayer().health + '/100'));
        this.menus['status_info'].addElement(new MenuInfo('Level: ' + this.world.getActiveLevel().depth));
        
        
        this.renderer.hideAllWindows();

        // Pre-Render the game area for the first time, while still hidden
        this.renderer.renderRoom(this.world.getActiveRoom(), 'game');
        this.renderer.renderMenu(this.menus['start'], this.renderer.windows['start'].getContext());
    
        
        // Show the start menu
        this.renderer.hideAllWindows();
        this.renderer.windows['start'].show();

    }

    update(key: string) {

        /**
         * Menu 
         */
        if (this.state == GameState.Menu) {

            if (!(IO.validMenuControls.indexOf(key) > -1) && !(this.keyQueue.isHolding())) return;

            // We're trying to equipt an item
            if (this.keyQueue.isHoldingKey('E')) {

                this.attemptEquip(key);
            
                this.keyQueue.releaseHold();

                this.renderer.showWindows(['game', 'messagebox', 'status_info']);
                this.state = GameState.Play;
                this.activeMenu = null;

                return;
            }

            let i = Object.keys(this.menus[this.activeMenu].options).indexOf(key);
            if (i > -1) {

                // toMenu
                if (this.menus[this.activeMenu].options[key].toMenu != null) {
                    this.activeMenu = this.menus[this.activeMenu].options[key].toMenu;
                    this.renderer.showWindows([this.activeMenu]);
                    return;
                }

                // toState
                let toState = this.menus[this.activeMenu].options[key].toState;
                if (toState != null) {
                    if (toState == 'Play') {
                        this.state = GameState.Play;
                        
                        this.activeMenu = 'game';
                        this.renderer.showWindows(['game', 'status_info', 'messagebox']);
                        return;
                    }
                }
            }

        }

        /** 
         * Look Mode
         */
        if (this.state == GameState.Look) {
            if (!(IO.validLookControls.indexOf(key) > -1)) return;

            if (key == 'ArrowUp') {
                if (this.lookCursor.y - 1 < 0) return;
                this.lookCursor.y -= 1;
            }

            if (key == 'ArrowDown') {
                if (this.lookCursor.y + 1 > this.world.getActiveRoom().getHeight() - 1) return;
                this.lookCursor.y += 1;
            }

            if (key == 'ArrowRight') {
                if (this.lookCursor.x + 1 > this.world.getActiveRoom().getWidth() - 1) return;
                this.lookCursor.x += 1;
            }

            if (key == 'ArrowLeft') {
                if (this.lookCursor.x - 1 < 0) return;
                this.lookCursor.x -= 1;
            }

            if (key == 'Escape') {
                this.renderer.renderGameObject(this.world.getActiveRoom().getObject(this.lookCursor.x, this.lookCursor.y), this.renderer.windows['game'].getContext());
                this.state = GameState.Play;
                return;
            }

            let obj = this.world.getActiveRoom().getObject(this.lookCursor.x, this.lookCursor.y);
            let name = obj.name;
            if (obj instanceof Floor && (<Floor>obj).getOccupation() != null) {
                name = (<Floor>obj).getOccupation().name;
            }

            if (obj instanceof Floor && (<Floor>obj).getObjects().length > 0) {
                name = (<Floor>obj).getObjects()[0].name;
            }

            (<MenuInfo>this.menus['messagebox'].elements[0]).content = name;

        }

        /**
         * Play 
         */
        if (this.state == GameState.Play) {

            if (!(IO.validGameControls.indexOf(key) > -1) && !(this.keyQueue.isHolding())) return;

            /* Equipt Item */
            if (key == 'E') {
                this.world.clearMessage();
                this.world.appendMessage("Which item would you like to equip? (choose letter) or [space] to view inventory.");
                this.keyQueue.hold('E');
                return;
            }

            if (this.keyQueue.isHoldingKey('E') ) {

                // Open up inventory 
                if (key == ' ') {
                    this.renderer.showWindows(['inventory']);
                    this.activeMenu = 'inventory';
                    this.state = GameState.Menu;
                    return;
                }

                if (!(key == undefined)) {
                    this.attemptEquip(key);
                
                    this.keyQueue.releaseHold();
                    return;
                }
            }

             // switch state to "viewing inventory"
            if (key == 'i') {

                this.renderer.showWindows(['inventory']);

                this.activeMenu = 'inventory';
                this.state = GameState.Menu;
                return;
            }

            if (key == 'L') {
                this.state = GameState.Look;
                this.activeMenu = null;
                this.lookCursor.x = this.world.getPlayer().x;
                this.lookCursor.y = this.world.getPlayer().y;
                return;
            }

            if (key == 'Escape') {
                this.renderer.showWindows(['pause']);
                this.activeMenu = 'pause';
                this.state = GameState.Menu;
                return;
            }

            if (key == '?') {
                this.renderer.showWindows(['help']);
                this.activeMenu = 'help',
                this.state = GameState.Menu;
                return;
            }

            this.world.getPlayer().receiveKeyInput(key);
            this.world.takeTurn();
        }
    }

    draw() {

        if (this.state == GameState.Menu) {
            if (this.activeMenu == 'inventory') (<InventoryMenu>this.menus['inventory']).establishInventory(this.world.getPlayer().inventory);
            this.renderer.renderMenu(this.menus[this.activeMenu], this.renderer.windows[this.activeMenu].getContext());
        }

        if (this.state == GameState.Look) {

            // Render the look cursor's context
            this.renderer.renderObjectContext(this.lookCursor, this.world.getActiveRoom(), this.renderer.windows['game'].getContext());

            // Render every actor in the room
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());    
            });

            // Render the actual look cursor
            this.renderer.renderGameObject(this.lookCursor, this.renderer.windows['game'].getContext());

            // Render the messagebox to display the look cursor info
            this.renderer.renderMenu(this.menus['messagebox'], this.renderer.windows['messagebox'].getContext());

        }


        if (this.state == GameState.Play) {

            // Update and render the world message box
            (<MenuInfo>this.menus['messagebox'].elements[0]).content = this.world.getCurrentMessages().join(" ");            
            this.renderer.renderMenu(this.menus['messagebox'], this.renderer.windows['messagebox'].getContext());

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
            

            // Update the status info and render it
            (<MenuInfo>this.menus['status_info'].elements[0]).content = 'Turns: ' + this.world.getTurnsPassed();
            (<MenuInfo>this.menus['status_info'].elements[1]).content = 'Health: ' + this.world.getPlayer().health + '/100';
            (<MenuInfo>this.menus['status_info'].elements[2]).content = 'Level: ' + this.world.getActiveLevel().depth;
            this.renderer.renderMenu(this.menus['status_info'], this.renderer.windows['status_info'].getContext());

        }
        
    }

    private attemptEquip(key: string) {
        this.world.clearMessage();
        let inventoryKeys = Object.keys(this.world.getPlayer().inventory);
        if (!(inventoryKeys.indexOf(key) > -1)) {
            this.world.appendMessage("Invalid item.");
        } else {
            let equipAction = new EquipAction(this.world.getPlayer(), this.world.getPlayer().inventory[key]);
            equipAction.perform(this.world);
        }
    }
}

let g = new game();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
});

