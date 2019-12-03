import { Renderer } from './renderer';
import { Tile } from './tile';

// NOTE: windows should not contain gameobject representations, only tile based representations

// CONSIDERATION: do we want the windowing code to handle outlining the window itself?

export class Window {
    
    public localWidth: number;
    public localHeight: number;

    public startX: number;
    public startY: number;

    private tiles: Tile[][];

    // private context: HTMLElement = document.createElement('div');

    // constructor(){}
    constructor(startX: number, startY: number, localWidth: number, localHeight: number, tiles: Tile[][]) {
        this.startX = startX;
        this.startY = startY;

        this.localWidth = localWidth;
        this.localHeight = localHeight;

        this.tiles = tiles;

        // this.initContext(this.context, tiles);
    }

    public getTile(x: number, y: number) {
        return this.tiles[x][y];
    }

    // public getContext() {
    //     return this.context;
    // }

    // private initContext(context: HTMLElement, tiles: Tile[][]) {
    //     // Loop over localWidth and localHeight to initialize the literal html elements that will be in this window
    //     this.context.style.height = Renderer.pxs(this.localHeight * this.elementSize);
    //     this.context.style.width = Renderer.pxs(this.localWidth * this.elementSize);
    //     this.context.style.margin = 'auto';

    //     for (let i = 0; i < this.localHeight; i++) {
    //         let rowDiv = document.createElement('div');
    //         rowDiv.style.height = Renderer.pxs(this.elementSize);
    //         rowDiv.style.display = 'flex';
        
    //         for (let j = 0; j < this.localWidth; j++) {
    //             var element = document.createElement('div');
    //             element.style.height = Renderer.pxs(this.elementSize);
    //             element.style.width = Renderer.pxs(this.elementSize);
    //             element.style.textAlign = 'center';
    //             element.style.userSelect = 'none';

                
    //             /** 
    //              * TODO: figure out how to pass in the data that we want to display in this window
    //                                                                     */
    //             element.innerHTML = tiles[i][j].ascii;//world.getObject(j, i).getTile().ascii;
    //             element.style.backgroundColor = tiles[i][j].bg;//world.getObject(j, i).getTile().bg;
    //             element.style.color = tiles[i][j].fg;//world.getObject(j, i).getTile().fg;

    //             // element.innerHTML = world.getTileASCII(i,j);
    //             // element.style.backgroundColor = world.getTileBg(i, j);
    //             // element.style.color = world.getTileFg(i, j);                
    //             // element.id = i+'-'+j;
        
    //             rowDiv.appendChild(element);
    //         }
    //         this.context.appendChild(rowDiv);
    //     }
    // }

}