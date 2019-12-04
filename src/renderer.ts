import { World } from "./world";
import { Player } from "./Entity/Player";
import { Actor } from "./Entity/Actor";
import { Tile } from "./tile";
import { GameObject } from "./Entity/GameObject";
import { Window } from "./window";

export class Renderer {

    public static elementSize: number = 15;

    constructor() {}

    public updateGameObject(obj: GameObject, context: HTMLElement) {
        // Render the game object in its position
        this.updateTile(obj.x, obj.y, obj.getTile(), context);
    }

    // "Re-render a specific tile"
    public updateTile(x: number, y: number, tile: Tile, context: HTMLElement) {
        (<HTMLElement>context.children[y].children[x]).innerHTML = tile.ascii;
        (<HTMLElement>context.children[y].children[x]).style.backgroundColor = tile.bg;
        (<HTMLElement>context.children[y].children[x]).style.color = tile.fg;
    }

    public renderLocalWorldContexts(objs: GameObject[], world: World, context: HTMLElement){
         // Update all locations around the game object to their initial world state
        for (let n = 0; n < objs.length; n++){

            // If the player is in debug render their movements and local contexts in yellow
            if (objs[n] instanceof Actor && (<Actor>objs[n]).debug) {
                this.updateTile(objs[n].x - 1, objs[n].y, new Tile(world.getObject(objs[n].x - 1, objs[n].y).getTile().ascii, world.getObject(objs[n].x - 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x + 1, objs[n].y, new Tile(world.getObject(objs[n].x + 1, objs[n].y).getTile().ascii, world.getObject(objs[n].x + 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y - 1, new Tile(world.getObject(objs[n].x, objs[n].y - 1).getTile().ascii, world.getObject(objs[n].x, objs[n].y - 1).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y + 1, new Tile(world.getObject(objs[n].x, objs[n].y + 1).getTile().ascii, world.getObject(objs[n].x, objs[n].y + 1).getTile().fg, 'yellow'), context);
            }
            else {
                this.updateTile(objs[n].x - 1, objs[n].y, world.getObject(objs[n].x - 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x + 1, objs[n].y, world.getObject(objs[n].x + 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y - 1, world.getObject(objs[n].x, objs[n].y - 1).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y + 1, world.getObject(objs[n].x, objs[n].y + 1).getTile(), context);
            }
        }
        
    }

    public addWindow(window: Window) {
        let context = window.getContext();
        this.bind(context);
    }

    // public updateWindow(window: Window, tiles: Tile[][]) {
    //     for (let i = 0; i < window.localHeight; i++) {
    //         for (let j = 0; j < window.localWidth; j++) {
    //             this.updateTile(i, j, tiles[i][j], window.getContext());
    //         }
    //     }
    // }

    private bind(windowContext: HTMLElement) {
        let body = document.body;
        body.style.margin = '0';

        body.appendChild(windowContext);
    }

    public static pxs(x: number): string {
        return x.toString() + 'px';
    }

}