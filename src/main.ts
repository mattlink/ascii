import { Game } from "./Game";
import { World } from "./world";
import { Renderer } from "./Systems/renderer";
import { IO } from "./Systems/io";
import { Menu, MenuInfo, MenuOption, MenuTitle } from './Systems/Menu/Menu';
import { Tile } from "./tile";
import { Floor } from "./Rooms/Environment";
import { GameObject } from "./GameObject";
import { Turret } from "./TD/Turret";
import { Wall } from "./TD/Wall";
import { ShopItem } from "./TD/ShopItem";
import { Importer } from "./importer";

import * as menuConfig from "./menu.json";

enum GameState {
    Start,
    Play,
    Over
}

enum CursorState {
    Default,
    Turret,
    Wall
}

class game extends Game {

    gameState: GameState = GameState.Start;

    menus: Record<string, Menu> = {};
    activeMenu: string = null;

    renderer: Renderer;

    world: World;

    cursor: GameObject;
    cursorState: CursorState;

    funds: number; // How much cash the player has available

    load() {

        // TODO: Check for an existing save in localStorage
        this.renderer = new Renderer();
        
        this.menus = Importer.importMenus(menuConfig);
        this.activeMenu = 'start';
        // Add windows for all the menus we imported
        for (let key in this.menus) {
            this.renderer.addWindow(key, Menu.width, Menu.height);
        }

        // Pre-render the start menu
        this.renderer.renderMenu(this.menus['start'], this.renderer.windows['start'].getContext());

        // Create the world
        const WORLD_HEIGHT = 30;
        const WORLD_WIDTH = 50;

        this.world = new World(this);
        this.world.init(WORLD_WIDTH, WORLD_HEIGHT);

        this.cursor = new GameObject(this.world.getRoom().getWidth() / 2, this.world.getRoom().getHeight() / 2, new Tile('X', 'red', 'white'));
        this.cursorState = CursorState.Default;

        this.funds = 30; // start with this much cash

        // Create windows
        this.renderer.addWindow('gameinfo', this.world.getRoom().getWidth(), 4.5);
        this.renderer.addWindow('game', this.world.getRoom().getWidth(), this.world.getRoom().getHeight(), true);
        this.renderer.addWindow('shop', this.world.getRoom().getWidth(), 8);
        this.renderer.hideAllWindows();

        // Create Menus for gameinfo and shop
        this.menus['gameinfo'] = new Menu();
        this.menus['gameinfo'].addElement(new MenuInfo('Nexus Health: 100'));
        this.menus['gameinfo'].addElement(new MenuInfo('$ 30'));
        this.menus['gameinfo'].addElement(new MenuInfo(''));

        this.menus['shop'] = new Menu();
        this.menus['shop'].addElement(new MenuInfo('SHOP:'));
        this.menus['shop'].addElement(new MenuOption('Turret $20', 't'));
        this.menus['shop'].addElement(new MenuOption('Wall $10', 'w'));

        // Render world and menus for the first time
        this.renderer.renderRoom(this.world.getRoom(), 'game');
        for (let key in this.menus) {
            this.renderer.renderMenu(this.menus[key], this.renderer.windows[key].getContext());
        }
        // Show all the windows
        // this.renderer.showWindows(['gameinfo', 'game', 'shop']);
        this.renderer.windows['start'].show();

        this.world.appendMessage("Welcome to Orc Siege!");
        this.world.appendMessage("Protect your Nexus with Walls and Turrets.");


    }

    // Bind basic mouse behavior to every tile
    initMouse() {
        let cols = Array.prototype.slice.call(this.renderer.windows['game'].getContext().children);
        for (let i = 0; i < cols.length; i++) {
            let colrows = Array.prototype.slice.call(cols[i].children);
            for (let j = 0; j < colrows.length; j++) {
                IO.defineMouseOver(colrows[j], function(e, game){
                    game.cursor.x = i;
                    game.cursor.y = j;
                    if (game.cursorState == CursorState.Default) {
                        game.cursor.tile.ascii = colrows[j].innerHTML;
                        game.cursor.tile.fg = colrows[j].style.color;
                        game.cursor.tile.bg = colrows[j].style.backgroundColor;
                    }
                    game.renderer.renderGameObject(game.cursor, game.renderer.windows['game'].getContext());
                }, this);
                IO.defineMouseOut(colrows[j], function(e, game) {
                    let objs = game.world.getRoom().objects;
                    if (objs[i][j] instanceof Floor && objs[i][j].getOccupation() != null) {
                        let actor = objs[i][j].getOccupation();
                        colrows[j].innerHTML = actor.getTile().ascii;
                        colrows[j].style.color = actor.getTile().fg;
                        colrows[j].style.backgroundColor = actor.getTile().bg;
                    } else {
                        colrows[j].innerHTML = (<Tile>objs[i][j].tile).ascii;
                        colrows[j].style.color = (<Tile>objs[i][j].tile).fg;
                        colrows[j].style.backgroundColor = (<Tile>objs[i][j].tile).bg;
                    }
                }, this);
                IO.defineMouseClick(colrows[j], function(e, game){
                    switch(game.cursorState) {
                        case CursorState.Turret:
                            game.placeShopItem(new Turret(i, j));
                            break;
                        case CursorState.Wall:
                            game.placeShopItem(new Wall(i, j));
                            break;
                        default:
                            break;
                    }
                    game.renderer.renderGameObject(game.world.getRoom().objects[i][j], game.renderer.windows['game'].getContext());
                }, this);
            }
        }
    }

    placeShopItem(item: ShopItem) {

        // the object that we're trting to place the item on
        let obj = this.world.getRoom().objects[item.x][item.y];

        // check if we're trying to place this item on top of another item we've already placed
        if (obj instanceof ShopItem) {

            if (this.funds + obj.cost < item.cost) {
                this.world.appendMessage("You don't have enough money for that.");
                (<MenuInfo>this.menus['gameinfo'].elements[2]).content = this.world.getCurrentMessages().join(" ");
                this.renderer.renderMenu(this.menus['gameinfo'], this.renderer.windows['gameinfo'].getContext());
                this.world.clearMessage();
                return;
            }


            // refund its value
            this.funds += obj.cost;
            // remove the the old item from the world
            this.world.items.splice(this.world.items.indexOf(obj));

           // replace the object with the new item
           this.world.getRoom().objects[item.x][item.y] = item;

           // charge the user for this item
           this.funds -= item.cost;
        }

        // otherwise just place the item and charge the user
        else {

            if (this.funds < item.cost) {
                this.world.appendMessage("You don't have enough money for that.");
                (<MenuInfo>this.menus['gameinfo'].elements[2]).content = this.world.getCurrentMessages().join(" ");
                this.renderer.renderMenu(this.menus['gameinfo'], this.renderer.windows['gameinfo'].getContext());
                this.world.clearMessage();
                return;
            }

            this.world.getRoom().objects[item.x][item.y] = item;
            this.funds -= item.cost;
        }

        // add the item to the world
        this.world.items.push(item);

        // update the display of currently available funds
        (<MenuInfo>this.menus['gameinfo'].elements[1]).content = '$ ' + this.funds;
        this.renderer.renderMenu(this.menus['gameinfo'], this.renderer.windows['gameinfo'].getContext());
    }


    updateCursor() {
        switch(this.cursorState) {
            case CursorState.Turret:
                this.cursor.tile = Turret.tile;
                break;
            case CursorState.Wall:
                this.cursor.tile = Wall.tile;
                break;
            default:
                this.cursor.tile = new Tile('X', 'red', 'white')
                break;
        }
        this.renderer.renderGameObject(this.cursor, this.renderer.windows['game'].getContext());

    }

    update(key: string) {

        if (this.gameState == GameState.Play) {
            if (!(IO.shopControls.indexOf(key) > -1) && !(IO.gameControls.indexOf(key) > -1)) return;

            // Check if the nexus is dead
            if (this.world.getPlayer().health <= 0) {
                this.world.appendMessage("The Orcs destroyed your Nexus. Refresh page to try again.");
                this.gameState = GameState.Over;
                (<MenuInfo>this.menus['gameinfo'].elements[2]).content = this.world.getCurrentMessages().join(" ");
                this.renderer.renderMenu(this.menus['gameinfo'], this.renderer.windows['gameinfo'].getContext());
            }

            if (key == 'f') this.world.takeTurn();

            if (key == 'w') {
                this.cursorState = CursorState.Wall;
                this.updateCursor();
            }

            if (key == 't') {
                // set the cursor to a turret
                this.cursorState = CursorState.Turret;
                this.updateCursor();
            }

            if (key == 'Backspace') {
                this.cursorState = CursorState.Default;
                this.updateCursor();
            }
        }

        // Start menu logic
        if (this.gameState == GameState.Start) {
            let i = Object.keys(this.menus[this.activeMenu].options).indexOf(key);
            if (i == -1) return;

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
                    this.gameState = GameState.Play;
                    
                    this.activeMenu = 'game';
                    this.renderer.showWindows(['gameinfo', 'game', 'shop']);
                    return;
                }
            }
        }

    }

    draw() {
        if (this.gameState == GameState.Play) {
            // Draw everything around each actor (above, below, left, and right)
            this.world.getRoom().getActors().forEach(actor => {
                this.renderer.renderObjectContext(actor, this.world.getRoom(), this.renderer.windows['game'].getContext());
            });

            // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
            this.world.getRoom().getActors().forEach(actor => {
                this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
            });

            // Update Menus' content
            (<MenuInfo>this.menus['gameinfo'].elements[0]).content = 'Nexus Health: ' + this.world.getPlayer().health;
            (<MenuInfo>this.menus['gameinfo'].elements[1]).content = '$ ' + this.funds;
            (<MenuInfo>this.menus['gameinfo'].elements[2]).content = this.world.getCurrentMessages().join(" ");

            // Render Menus
            for (let key in this.menus) {
                this.renderer.renderMenu(this.menus[key], this.renderer.windows[key].getContext());
            }
        }
    }

}

let g = new game();
g.load();
g.initMouse();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
});
