import { Game } from "./Game";
import { World } from "./world";
import { Renderer } from "./Systems/renderer";
import { IO } from "./Systems/io";
import { Menu, MenuInfo, MenuOption, MenuTitle, MenuTextInput, MenuSubmit, MenuCheckBox } from './Systems/Menu/Menu';
import { Tile } from "./tile";
import { Floor } from "./Rooms/Environment";
import { GameObject } from "./GameObject";
import { Turret } from "./TD/Turret";
import { Wall } from "./TD/Wall";
import { ShopItem } from "./TD/ShopItem";

import { Orc } from "./Actors/Orc";

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
    cashMilestone: number = 0;

    load() {

        // TODO: Check for an existing save in localStorage
        this.renderer = new Renderer();

        this.activeMenu = 'start';

        // Create the world
        const WORLD_HEIGHT = 30;
        const WORLD_WIDTH = 50;

        this.world = new World(this);
        this.world.init(WORLD_WIDTH, WORLD_HEIGHT);

        this.cursor = new GameObject(this.world.getRoom().getWidth() / 2, this.world.getRoom().getHeight() / 2, new Tile('X', 'red', 'white'));
        this.cursorState = CursorState.Default;

        this.funds = 30; // start with this much cash

        // Create windows for each menu and the game itself
        this.renderer.addWindow('start', this.world.getRoom().getWidth(), this.world.getRoom().getHeight());
        this.renderer.addWindow('login', this.world.getRoom().getWidth(), this.world.getRoom().getHeight());
        this.renderer.addWindow('create_account', this.world.getRoom().getWidth(), this.world.getRoom().getHeight());
        this.renderer.addWindow('about_game', this.world.getRoom().getWidth(), this.world.getRoom().getHeight());
        this.renderer.addWindow('gameinfo', this.world.getRoom().getWidth(), 4.5);
        this.renderer.addWindow('game', this.world.getRoom().getWidth(), this.world.getRoom().getHeight(), true);
        this.renderer.addWindow('selection', this.world.getRoom().getWidth(), 5);
        this.renderer.addWindow('shop', this.world.getRoom().getWidth(), 8);
        this.renderer.hideAllWindows();

        // Create Menus 
        this.menus['start'] = new Menu([
            [new MenuTitle('Orc Siege')],
            [new MenuOption('Start', 's', 'Play')],
            [new MenuOption('Login', 'l', null, 'login')],
            [new MenuOption('Create Account', 'c', null, 'create_account')],
            [new MenuOption('How to Play', '?', null, 'about_game')]
        ]);

        this.menus['login'] = new Menu([
            [new MenuTitle('Login')],
            [new MenuInfo('Logging in allows your score to be recorded on the leaderboard', '', true, true)],
            [new MenuInfo('')],
            [new MenuTextInput('Username')],
            [new MenuTextInput('Password', true)],
            [new MenuCheckBox(true, 'Stay logged in')],
            [new MenuSubmit('Login', IO.submitLogin)],
            [new MenuOption('', 'Escape', null, 'start', true)],
        ]);

        this.menus['create_account'] = new Menu([
            [new MenuTitle('Create Account')],
            [new MenuTextInput('Username')],
            [new MenuTextInput('Password', true)],
            [new MenuTextInput('Repeat Passwprd', true)],
            [new MenuSubmit('Create Account')],
            [new MenuOption('', 'Escape', null, 'start', true)],
        ])

        this.menus['about_game'] = new Menu([
            [new MenuTitle('About Game (How to Play)')],
            [new MenuOption('', 'Escape', null, 'start', true)],
                [new MenuInfo("Controls:"   )],
                [new MenuInfo("Press 'f' to advance the game by one tick.")],
                [new MenuInfo("Select a shop item by pressing its key binding. (t for turret, w for wall, etc).")],
                [new MenuInfo("Place an item by clicking on the space you want to put it.")],
                [new MenuInfo("Press escape to clear the cursor.")],
                [new MenuInfo("Using the default cursor, click an item to view it and then press 's' to sell it.")],
                [new MenuInfo("-----------------------------------------------------------------------------------------")],
                [new MenuInfo("Gameplay:")],
                [new MenuInfo("Get money by killing Orcs. Kill Orcs with Turrets.")],
                [new MenuInfo("You lose when the Orcs kill your Nexus.")],
                [new MenuInfo("Orcs get increasingly stronger as you gain more money.")],
                [new MenuInfo("See how long you can last, and how much money you can make.")],
                [new MenuInfo("Oh no did the game break? Refresh the page to restart.")],
                [new MenuInfo("(Press esc to go back)")] 
        ]);

        this.menus['gameinfo'] = new Menu(
            [
                [new MenuInfo('Nexus Health: 100'),         new MenuInfo('Orcs Killed: 0')],
                [new MenuInfo('$ 30'),                      new MenuInfo('Turns: 0')],
                [new MenuInfo('')]
            ], true
        );

        this.menus['selection'] = new Menu(
            [
                [new MenuInfo('SELECTED:')],
                [new MenuInfo('Nothing selected')],
                [new MenuInfo('')],
                [new MenuInfo('')],
            ], true
        );
        
        this.menus['shop'] = new Menu(
            [
                [new MenuInfo('SHOP:')],
                [new MenuOption('Turret $20', 't')],
                [new MenuOption('Wall $5', 'w')],
            ], true
        );

        // Render world and menus for the first time
        this.renderer.renderRoom(this.world.getRoom(), 'game');
        for (let key in this.menus) {
            this.renderer.renderMenu(this.menus[key], this.renderer.windows[key].getContext());
        }
        // Show all the windows
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
                    else if (game.cursorState == CursorState.Turret) {
                        game.renderer.renderTurretCursor(game.cursor, game.world.getRoom(), game.renderer.windows['game'].getContext());
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
                        if (game.cursorState == CursorState.Turret) {
                            game.renderer.renderArea(game.cursor.x - (Turret.range + 1), game.cursor.y - (Turret.range + 1), 2 * (Turret.range + 2), 2 * (Turret.range + 2), game.world.getRoom(), game.renderer.windows['game'].getContext());
                        }
                    }
                }, this);
                IO.defineMouseClick(colrows[j], function(e, game){
                    let objs = game.world.getRoom().objects;
                    switch(game.cursorState) {
                        case CursorState.Turret:
                            if (objs[i][j] instanceof Floor && objs[i][j].getOccupation() != null || objs[i][j] instanceof GameObject && !(objs[i][j] instanceof Floor)) break;
                            game.placeShopItem(new Turret(i, j));
                            break;
                        case CursorState.Wall:
                            if (objs[i][j] instanceof Floor && objs[i][j].getOccupation() != null || objs[i][j] instanceof GameObject && !(objs[i][j] instanceof Floor)) break;
                            game.placeShopItem(new Wall(i, j));
                            break;
                        case CursorState.Default:
                            let item = game.world.getActiveRoom().getObject(i, j);
                            if (item instanceof Floor && item.getOccupation()) {
                                item = item.getOccupation();
                            }
                            game.selected = item;
                            game.draw();
                            // item.tile.bg = 'blue';
                            // game.renderer.renderGameObject(item, game.renderer.windows['game'].getContext());
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
                (<MenuInfo>this.menus['gameinfo'].rows[2][0]).content = this.world.getCurrentMessages().join(" ");
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
                (<MenuInfo>this.menus['gameinfo'].rows[2][0]).content = this.world.getCurrentMessages().join(" ");
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
        (<MenuInfo>this.menus['gameinfo'].rows[1][0]).content = '$ ' + this.funds;
        this.renderer.renderMenu(this.menus['gameinfo'], this.renderer.windows['gameinfo'].getContext());
    }


    updateCursor() {
        switch(this.cursorState) {
            case CursorState.Turret:
                this.renderer.renderTurretCursor(this.cursor, this.world.getRoom(), this.renderer.windows['game'].getContext());
                this.cursor.tile = Turret.tile;
                break;
            case CursorState.Wall:
                this.renderer.renderArea(this.cursor.x - (Turret.range + 1), this.cursor.y - (Turret.range + 1), 2 * (Turret.range + 2), 2 * (Turret.range + 2), this.world.getRoom(), this.renderer.windows['game'].getContext());
                this.cursor.tile = Wall.tile;
                break;
            default:
                this.cursor.tile = new Tile('', 'black', 'black')
                this.renderer.renderArea(this.cursor.x - (Turret.range + 1), this.cursor.y - (Turret.range + 1), 2 * (Turret.range + 2), 2 * (Turret.range + 2), this.world.getRoom(), this.renderer.windows['game'].getContext());
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
                (<MenuInfo>this.menus['gameinfo'].rows[2][0]).content = this.world.getCurrentMessages().join(" ");
                this.renderer.renderMenu(this.menus['gameinfo'], this.renderer.windows['gameinfo'].getContext());
                return;
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

            if (key == 'Escape') {
                this.cursorState = CursorState.Default;
                this.renderer.renderArea(this.cursor.x - (Turret.range + 1), this.cursor.y - (Turret.range + 1), 2 * (Turret.range + 2), 2 * (Turret.range + 2), this.world.getRoom(), this.renderer.windows['game'].getContext());
                this.selected = null;
                (<MenuInfo>this.menus['selection'].rows[2][0]).content = '';
                this.updateCursor();
            }

            if (key == 's') {
                const room = this.world.getActiveRoom();

                if (this.selected && this.selected instanceof Turret) {
                    const x = this.selected.x;
                    const y = this.selected.y;

                    this.world.items = this.world.items.filter(item => {
                        return item != this.selected;
                    });

                    this.funds += this.selected.cost/2;

                    room.objects[x][y] = new Floor(x, y, room.floorTile);
                    this.renderer.renderGameObject(room.objects[x][y], this.renderer.windows['game'].getContext());
                } else if (this.selected && this.selected instanceof Wall) {
                    const x = this.selected.x;
                    const y = this.selected.y;

                    this.funds += this.selected.cost;

                    room.objects[x][y] = new Floor(x, y, room.floorTile);
                    this.renderer.renderGameObject(room.objects[x][y], this.renderer.windows['game'].getContext());
                }

                this.selected = null;
                (<MenuInfo>this.menus['selection'].rows[2][0]).content = '';
            }

            // Check if we should scale difficulty of Orcs
            if (this.funds - this.cashMilestone >= 50) {
                Orc.maxHealth += 2;
                this.cashMilestone += 50;
                this.world.appendMessage("Orcs just got stronger.");
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
                    this.renderer.showWindows(['gameinfo', 'game', 'selection', 'shop']);
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
            (<MenuInfo>this.menus['gameinfo'].rows[0][0]).content = 'Nexus Health: ' + this.world.getPlayer().health;
            (<MenuInfo>this.menus['gameinfo'].rows[0][1]).content = 'Orcs Killed: ' + this.world.orcsKilled;
            (<MenuInfo>this.menus['gameinfo'].rows[1][0]).content = '$ ' + this.funds;
            (<MenuInfo>this.menus['gameinfo'].rows[1][1]).content = 'Turns: ' + this.world.turnsPassed;
            (<MenuInfo>this.menus['gameinfo'].rows[2][0]).content = this.world.getCurrentMessages().join(" ");

            if (this.selected) {
                if (this.selected instanceof Orc) {
                    (<MenuInfo>this.menus['selection'].rows[1][0]).content = `${this.selected.name} (HP: ${this.selected.health})`;
                    (<MenuInfo>this.menus['selection'].rows[2][0]).content = '';
                } else if (this.selected instanceof Turret) {
                    (<MenuInfo>this.menus['selection'].rows[1][0]).content = this.selected.name;
                    (<MenuInfo>this.menus['selection'].rows[2][0]).content = 's - Sell $10';
                } else if (this.selected instanceof Wall) {
                    (<MenuInfo>this.menus['selection'].rows[1][0]).content = this.selected.name;
                    (<MenuInfo>this.menus['selection'].rows[2][0]).content = 's - Sell $5';
                } else {
                    (<MenuInfo>this.menus['selection'].rows[1][0]).content = this.selected.name;
                    (<MenuInfo>this.menus['selection'].rows[2][0]).content = '';
                }
            } else {
                (<MenuInfo>this.menus['selection'].rows[1][0]).content = 'Nothing selected';
            }

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
