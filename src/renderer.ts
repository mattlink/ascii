import { World } from "./world";
import { Player } from "./Entity/Player";
import { Tile } from "./tile";
import { GameObject } from "./Entity/GameObject";

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
        this.bind();
    }

    public updateGameObject(obj: GameObject) {//, x1: number, y1: number) {
        
       
        /*for (let i = obj.x - 1; i <= obj.x + 1; i++) {
            for (let j = obj.y - 1; j <= obj.y + 1; j++) {
                
                if (this.world.tileContainsMob(i, j)) continue;
                // Doing it this: way leaves a green trail around where the player walks
                this.updateTile(i, j, new Tile(this.world.getTile(i, j).ascii, this.world.getTile(i, j).fg, 'green'));
                
                // this.updateTile(i, j, this.world.getTile(i, j));
            }
        }*/
    
        // Render the game object in its position
        this.updateTile(obj.x, obj.y, obj.getTile());
    }

    // "Re-render a specific tile"
    public updateTile(x: number, y: number, tile: Tile) {
        this.context.children[y].children[x].innerHTML = tile.ascii;
        // (<HTMLElement>document.querySelector('#'+x+'-'+y)).style.backgroundColor = tile.bg;
        (<HTMLElement>this.context.children[y].children[x]).style.backgroundColor = tile.bg;
        (<HTMLElement>this.context.children[y].children[x]).style.color = tile.fg;
    }

    public renderLocalContexts(objs: GameObject[]){//objx: number, objy: number) {
         // Update all locations around the game object to their initial world state
        for (let n = 0; n < objs.length; n++){

            // If the player is in debug render their movements and local contexts in yellow
            if (objs[n] instanceof Player && (<Player>objs[n]).debug) {
                this.updateTile(objs[n].x - 1, objs[n].y, new Tile(this.world.getObject(objs[n].x - 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x - 1, objs[n].y).getTile().fg, 'yellow'));
                this.updateTile(objs[n].x + 1, objs[n].y, new Tile(this.world.getObject(objs[n].x + 1, objs[n].y).getTile().ascii, this.world.getObject(objs[n].x + 1, objs[n].y).getTile().fg, 'yellow'));
                this.updateTile(objs[n].x, objs[n].y - 1, new Tile(this.world.getObject(objs[n].x, objs[n].y - 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y - 1).getTile().fg, 'yellow'));
                this.updateTile(objs[n].x, objs[n].y + 1, new Tile(this.world.getObject(objs[n].x, objs[n].y + 1).getTile().ascii, this.world.getObject(objs[n].x, objs[n].y + 1).getTile().fg, 'yellow'));
            }
            else {
                this.updateTile(objs[n].x - 1, objs[n].y, this.world.getObject(objs[n].x - 1, objs[n].y).getTile());
                this.updateTile(objs[n].x + 1, objs[n].y, this.world.getObject(objs[n].x + 1, objs[n].y).getTile());
                this.updateTile(objs[n].x, objs[n].y - 1, this.world.getObject(objs[n].x, objs[n].y - 1).getTile());
                this.updateTile(objs[n].x, objs[n].y + 1, this.world.getObject(objs[n].x, objs[n].y + 1).getTile());
            }
            
            // // new Tile(this.world.getTile(i, j).ascii, this.world.getTile(i, j).fg, 'green')

            // Uncomment below to leave a green actor movement path: 
            // this.updateTile(objs[n].x - 1, objs[n].y, new Tile(this.world.getTile(objs[n].x - 1, objs[n].y).ascii, this.world.getTile(objs[n].x - 1, objs[n].y).fg, 'green'));
            // this.updateTile(objs[n].x + 1, objs[n].y, new Tile(this.world.getTile(objs[n].x + 1, objs[n].y).ascii, this.world.getTile(objs[n].x + 1, objs[n].y).fg, 'green'));
            // this.updateTile(objs[n].x, objs[n].y - 1, new Tile(this.world.getTile(objs[n].x, objs[n].y - 1).ascii, this.world.getTile(objs[n].x, objs[n].y - 1).fg, 'green'));
            // this.updateTile(objs[n].x, objs[n].y + 1, new Tile(this.world.getTile(objs[n].x, objs[n].y + 1).ascii, this.world.getTile(objs[n].x, objs[n].y + 1).fg, 'green'));
            
        }
        
    }

    private initializeContext(world: World) {

        this.context.style.height = this.pxs(world.getHeight() * this.elementSize);
        this.context.style.width = this.pxs(world.getWidth() * this.elementSize);
        this.context.style.margin = 'auto';

        for (let i = 0; i < world.getHeight(); i++) {
            let rowDiv = document.createElement('div');
            rowDiv.style.height = this.pxs(this.elementSize);
            rowDiv.style.display = 'flex';
        
            for (let j = 0; j < world.getWidth(); j++) {
                var element = document.createElement('div');
                element.style.height = this.pxs(this.elementSize);
                element.style.width = this.pxs(this.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                
                element.innerHTML = world.getObject(j, i).getTile().ascii;
                element.style.backgroundColor = world.getObject(j, i).getTile().bg;
                element.style.color = world.getObject(j, i).getTile().fg;

                // element.innerHTML = world.getTileASCII(i,j);
                // element.style.backgroundColor = world.getTileBg(i, j);
                // element.style.color = world.getTileFg(i, j);                
                // element.id = i+'-'+j;
        
                rowDiv.appendChild(element);
            }
            this.context.appendChild(rowDiv);
        }
    }

    private bind() {
        let body = document.body;
        body.style.margin = '0';

        body.appendChild(this.context);
    }

    private pxs(x: number): string {
        return x.toString() + 'px';
    }

}