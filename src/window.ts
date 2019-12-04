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

    private context: HTMLElement;

    constructor(startX: number, startY: number, localWidth: number, localHeight: number, tiles: Tile[][]) {
        this.startX = startX;
        this.startY = startY;

        this.localWidth = localWidth;
        this.localHeight = localHeight;

        this.tiles = tiles;

        this.initContext(tiles);
    }

    public getTile(x: number, y: number) {
        return this.tiles[x][y];
    }

    public getContext() {
        return this.context;
    }

    private initContext(tiles: Tile[][]) {
        // Loop over localWidth and localHeight to initialize the literal html elements that will be in this window
        this.context = document.createElement('div');
        this.context.style.height = Renderer.pxs(this.localHeight * Renderer.elementSize);
        this.context.style.width = Renderer.pxs(this.localWidth * Renderer.elementSize);

        if (this.startX == -1 && this.startY == -1) {
            this.context.style.margin = 'auto';
        }else {
            this.context.style.position = 'absolute';
            this.context.style.left = Renderer.pxs(this.startX);
            this.context.style.top = Renderer.pxs(this.startY);
        }
        

        for (let i = 0; i < this.localHeight; i++) {
            let rowDiv = document.createElement('div');
            rowDiv.style.height = Renderer.pxs(Renderer.elementSize);
            rowDiv.style.display = 'flex';
        
            for (let j = 0; j < this.localWidth; j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(Renderer.elementSize);
                element.style.width = Renderer.pxs(Renderer.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                
                /** 
                 * TODO: figure out how to pass in the data that we want to display in this window
                                                                        */
                element.innerHTML = tiles[j][i].ascii;
                element.style.backgroundColor = tiles[j][i].bg;
                element.style.color = tiles[j][i].fg;

        
                rowDiv.appendChild(element);
            }
            this.context.appendChild(rowDiv);
        }
    }

}