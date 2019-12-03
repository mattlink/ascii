import { World } from "./world";
import { Player } from "./Entity/Player";
import { Tile } from "./tile";
import { GameObject } from "./Entity/GameObject";
import { Window } from "./window";

export class Renderer {

    private elementSize: number = 15;
    private context: HTMLElement = document.createElement('div');
    private world: World;

    constructor() {}

    public init(world: World) {
        this.world = world;

        // initialize the rendering context
        this.initializeContext(world);
        // bind context to body
        this.bind(this.context);
    }

    public updateGameObject(obj: GameObject) {//, x1: number, y1: number) {
        // Render the game object in its position
        this.updateTile(obj.x, obj.y, obj.getTile(), this.context);
    }

    // "Re-render a specific tile"
    public updateTile(x: number, y: number, tile: Tile, context: HTMLElement) {
        context.children[y].children[x].innerHTML = tile.ascii;
        // (<HTMLElement>document.querySelector('#'+x+'-'+y)).style.backgroundColor = tile.bg;
        (<HTMLElement>context.children[y].children[x]).style.backgroundColor = tile.bg;
        (<HTMLElement>context.children[y].children[x]).style.color = tile.fg;
    }

    public renderLocalContexts(objs: GameObject[], context: HTMLElement = this.context){//objx: number, objy: number) {
         // Update all locations around the game object to their initial world state
        for (let n = 0; n < objs.length; n++){

            // If the player is in debug render their movements and local contexts in yellow
            if (objs[n] instanceof Player && (<Player>objs[n]).debug) {
                this.updateTile(objs[n].x - 1, objs[n].y, new Tile(this.world.getObject(objs[n].x - 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x - 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x + 1, objs[n].y, new Tile(this.world.getObject(objs[n].x + 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x + 1, objs[n].y).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y - 1, new Tile(this.world.getObject(objs[n].x, objs[n].y - 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y - 1).getTile().fg, 'yellow'), context);
                this.updateTile(objs[n].x, objs[n].y + 1, new Tile(this.world.getObject(objs[n].x, objs[n].y + 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y + 1).getTile().fg, 'yellow'), context);
            }
            else {
                this.updateTile(objs[n].x - 1, objs[n].y, this.world.getObject(objs[n].x - 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x + 1, objs[n].y, this.world.getObject(objs[n].x + 1, objs[n].y).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y - 1, this.world.getObject(objs[n].x, objs[n].y - 1).getTile(), context);
                this.updateTile(objs[n].x, objs[n].y + 1, this.world.getObject(objs[n].x, objs[n].y + 1).getTile(), context);
            }
        }
        
    }

    private initializeContext(world: World) {

        this.context.style.height = Renderer.pxs(world.getHeight() * this.elementSize);
        this.context.style.width = Renderer.pxs(world.getWidth() * this.elementSize);
        this.context.style.margin = 'auto';

        for (let i = 0; i < world.getHeight(); i++) {
            let rowDiv = document.createElement('div');
            rowDiv.style.height = Renderer.pxs(this.elementSize);
            rowDiv.style.display = 'flex';
        
            for (let j = 0; j < world.getWidth(); j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(this.elementSize);
                element.style.width = Renderer.pxs(this.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                
                element.innerHTML = world.getObject(j, i).getTile().ascii;
                element.style.backgroundColor = world.getObject(j, i).getTile().bg;
                element.style.color = world.getObject(j, i).getTile().fg;
        
                rowDiv.appendChild(element);
            }
            this.context.appendChild(rowDiv);
        }
    }

    public addWindow(window: Window) {
        let context = this.initWindow(window);
        this.bind(context);
    }

    private initWindow(window: Window) {
        let windowContext = document.createElement('div');
        windowContext.style.height = Renderer.pxs(window.localHeight);
        windowContext.style.width = Renderer.pxs(window.localWidth);
        windowContext.style.margin = 'auto';

        for (let i = 0; i < window.localHeight; i++) {
            let rowDiv = document.createElement('div');
            rowDiv.style.height = Renderer.pxs(this.elementSize);
            rowDiv.style.display = 'flex';
            for (let j = 0; j < window.localWidth; j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(this.elementSize);
                element.style.width = Renderer.pxs(this.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                
                element.innerHTML = window.getTile(i,j).ascii;
                element.style.backgroundColor = window.getTile(i,j).bg;
                element.style.color = window.getTile(i,j).fg;

                rowDiv.appendChild(element);
            }
            windowContext.appendChild(rowDiv);
        }
        return windowContext;
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