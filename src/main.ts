import { Game } from "./Game";
import { World } from "./world";
import { Renderer } from "./Systems/renderer";
import { IO } from "./Systems/io";
import { Menu, MenuInfo, MenuTitle, MenuOption } from './Systems/Menu/Menu';
import { Room } from "./Rooms/Room";
import { Tile } from "./tile";
import { Player } from "./Actors/Player";
import { Level } from "./Level";
import { Floor } from "./Rooms/Environment";
import { Mob } from "./Actors/Mob";
import { GameObject } from "./GameObject";
import { Turret } from "./TD/Turret";
import { Wall } from "./TD/Wall";

enum CursorState {
    Default,
    Turret,
    Wall
}

class game extends Game {

    menus: Record<string, Menu> = {};

    renderer: Renderer;

    world: World;

    cursor: GameObject;
    cursorState: CursorState;

    funds: number; // How much cash the player has available

    load() {

        // TODO: Check for an existing save in localStorage
        this.renderer = new Renderer();

        // Create the world
        const WORLD_HEIGHT = 30;
        const WORLD_WIDTH = 50;

        this.world = new World();
        this.world.init(WORLD_WIDTH, WORLD_HEIGHT);

        this.cursor = new GameObject(this.world.getRoom().getWidth() / 2, this.world.getRoom().getHeight() / 2, new Tile('X', 'red', 'white'));
        this.cursorState = CursorState.Default;
        // this.world.getRoom().objects[this.cursor.x][this.cursor.y] = this.cursor;
        

        this.funds = 500; // start with this much cash

        // Add some test orcs to the world
        for (let i = 0; i < 10; i++)
            this.world.getRoom().addActor(new Mob("Orc", 10, 10, new Tile('O', 'green', 'purple')));
        

        // Create windows
        this.renderer.addWindow('gameinfo', this.world.getRoom().getWidth(), 3);
        this.renderer.addWindow('game', this.world.getRoom().getWidth(), this.world.getRoom().getHeight(), true);
        this.renderer.addWindow('shop', this.world.getRoom().getWidth(), 8);
        this.renderer.hideAllWindows();

        // Create Menus for gameinfo and shop
        this.menus['gameinfo'] = new Menu();
        this.menus['gameinfo'].addElement(new MenuInfo('Wave: 0'));
        this.menus['gameinfo'].addElement(new MenuInfo('$ 500'));

        this.menus['shop'] = new Menu();
        this.menus['shop'].addElement(new MenuInfo('SHOP:'));
        this.menus['shop'].addElement(new MenuOption('Turret $50', 't'));
        this.menus['shop'].addElement(new MenuOption('Wall $10', 'w'));

        // Render world and menus for the first time
        this.renderer.renderRoom(this.world.getRoom(), 'game');
        for (let key in this.menus) {
            this.renderer.renderMenu(this.menus[key], this.renderer.windows[key].getContext());
        }
        // Show all the windows
        this.renderer.showWindows(['gameinfo', 'game', 'shop']);

    }

    // Bind basic mouse behavior to every tile
    initMouse() {
        // let tiles = this.world.getRoom().getTiles();
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
            }
        }
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

        if (!(IO.shopControls.indexOf(key) > -1) && !(IO.gameControls.indexOf(key) > -1)) return;

        if (key == 'f')  this.world.takeTurn();

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

    draw() {

        // Draw everything around each actor (above, below, left, and right)
        this.world.getRoom().getActors().forEach(actor => {
            this.renderer.renderObjectContext(actor, this.world.getRoom(), this.renderer.windows['game'].getContext());
        });

        // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
        this.world.getRoom().getActors().forEach(actor => {
            this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
        });

        // Update Menus' content
        (<MenuInfo>this.menus['gameinfo'].elements[0]).content = 'Wave: ' + this.world.wave;
        (<MenuInfo>this.menus['gameinfo'].elements[1]).content = '$ ' + this.funds;
    
        // Render Menus
        for (let key in this.menus) {
            this.renderer.renderMenu(this.menus[key], this.renderer.windows[key].getContext());
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

