import { Importer } from "./importer";
import { Game } from "./Game";
import { World } from "./world";
import { Renderer } from "./Systems/renderer";
import { Player } from "./Actors/Player";
import { IO } from "./Systems/io";
import { GameObject } from './GameObject';
import { Tile } from './tile';

import { Room } from "./Rooms/Room";

enum GameState {
    Play,
    Menu
}

enum CursorState {
    Panning,
    NotPanning
}

class game extends Game {

    // menus: Record<string, Menu> = {};

    renderer: Renderer;

    world: World;

    state: GameState;

    cursor: GameObject = new GameObject(0, 0, new Tile('X', 'black', 'yellow'));
    cursorState: CursorState = CursorState.NotPanning;

    load() {

        // TODO: Check for an existing save in localStorage

        this.state = GameState.Menu;
        // this.world = Importer.importWorld(worldConfig);
        this.world = new World();
        let room = new Room(100, 100, "Forest");
        // room.wallTile = new Tile('P', 'red', 'green');
        // room.init(2, 2);
        room.init(0, 3);

        console.log(room);

        this.world.addRoom(room);
        let cursor = new Player(0, 0, new Tile('X', 'black', 'yellow'));
        room.addActor(cursor);


        this.renderer = new Renderer();

        /* Set Up  Windows */
        let windowWidth = 30;
        let windowHeight = 25;

        // center the view
        let viewStartX = Math.floor(this.world.getActiveRoom().getWidth() / 2) - Math.floor(windowWidth / 2);
        let viewStartY  = Math.floor(this.world.getActiveRoom().getHeight() / 2) - Math.floor(windowHeight / 2);

        let panThreshold = 5; // 5 tiles from edge until start panning camera

        // start view in top left corner:
        // viewStartX = 0;
        // viewStartY = 0;

        console.log(viewStartX, viewStartY);
        
        this.renderer.addWindow('game', windowWidth, windowHeight, this.world.getActiveRoom().getTiles());
        this.renderer.renderRoomInView(
            this.world.getActiveRoom(), 
            viewStartX,
            viewStartY,
            'game');

        
        let gameContext = this.renderer.windows['game'].getContext();
        gameContext.addEventListener('panview', function(e) {
            
        });
        
        
        let tiles = this.world.getActiveRoom().getTiles();
        let cols = Array.prototype.slice.call(this.renderer.windows['game'].getContext().children);
        for (let i = 0; i < cols.length; i++) {
            let colrows = Array.prototype.slice.call(cols[i].children);
            for (let j = 0; j < colrows.length; j++) {
                IO.defineMouseOver(colrows[j], function(e, game) {

                    if (game.cursorState == CursorState.Panning) {
                        // Pan Left
                        if (i <= panThreshold) {
                            viewStartX -= 1;
                        }
                        // Pan Right
                        if (i >= windowWidth - panThreshold) {
                            viewStartX += 1;
                        }
                        // Pan Up 
                        if (j <= panThreshold) {
                            viewStartY -= 1;
                        }
                        // Pan Down
                        if (j >= windowHeight - panThreshold) {
                            viewStartY += 1;
                        }

                        game.renderer.renderRoomInView(game.world.getActiveRoom(), viewStartX, viewStartY, 'game');

                        if (i > panThreshold && i < windowWidth - panThreshold && j > panThreshold && j < windowHeight - panThreshold) {
                            game.cursorState = CursorState.NotPanning;
                            return;
                        }

                        (<HTMLElement>e.target).dispatchEvent(new Event(''))
                    }

                    if (game.cursorState == CursorState.NotPanning) {
                        if (i <= panThreshold) {
                            game.cursorState = CursorState.Panning;
                        }
                        // Pan Right
                        if (i >= windowWidth - panThreshold) {
                            game.cursorState = CursorState.Panning;
                        }
                        // Pan Up 
                        if (j <= panThreshold) {
                            game.cursorState = CursorState.Panning;
                        }
                        // Pan Down
                        if (j >= windowHeight - panThreshold) {
                            game.cursorState = CursorState.Panning;
                        }
                    }


                    // colrows[j].innerHTML = 'X';
                    // colrows[j].style.color = 'black';
                    // colrows[j].style.backgroundColor = 'yellow';
                    game.cursor.x = i;
                    game.cursor.y = j;

                    // game.renderer.renderRoomInView(game.world.getActiveRoom(), viewStartX, viewStartY, 'game');
                    game.renderer.renderGameObject(game.cursor, game.renderer.windows['game'].getContext());

                }, this);
                IO.defineMouseOut(colrows[j], function(e, t) {

                    colrows[j].innerHTML = (<Tile>t[i + viewStartX][j + viewStartY]).ascii;
                    colrows[j].style.color = (<Tile>t[i + viewStartX][j + viewStartY]).fg;
                    colrows[j].style.backgroundColor = (<Tile>t[i + viewStartX][j + viewStartY]).bg;

                }, tiles);
            }
        }
    }

    update(key: string) {

        if (this.state == GameState.Menu) {
            if (!(IO.validMenuControls.indexOf(key) > -1)) return;
        }

        if (this.state == GameState.Play) {

            if (!(IO.validGameControls.indexOf(key) > -1)) return;

            this.world.getPlayer().receiveKeyInput(key);
            this.world.takeTurn();
        }
    }

    draw() {

        if (this.state == GameState.Menu) {
            // if (this.activeMenu == 'inventory') (<InventoryMenu>this.menus['inventory']).establishInventory(this.world.getPlayer().inventory);
            // this.renderer.renderMenu(this.menus[this.activeMenu], this.renderer.windows[this.activeMenu].getContext());
        }



        if (this.state == GameState.Play) {


            // Draw everything /around/ each actor
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.renderer.windows['game'].getContext());
            });

            // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
            this.world.getActiveRoom().getActors().forEach(actor => {
                this.renderer.renderGameObject(actor, this.renderer.windows['game'].getContext());
            });
        
        }
        
    }
}

let g = new game();
g.load();
// IO.genericKeyBinding(function(key: string) {
//     g.update(key);
//     g.draw();
// })
