import { Renderer } from './renderer';
import { Tile } from './tile';

// Think of Windows as rendering contexts

// NOTE: windows should not contain gameobject representations, only tile based representations

// CONSIDERATION: do we want the windowing code to handle outlining the window itself?

export class Window {
    
    public localWidth: number;
    public localHeight: number;

    public startX: number;
    public startY: number;

    public bordered: boolean = false;

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

    // public getTile(x: number, y: number) {
    //     return this.tiles[x][y];
    // }

    public getContext() {
        return this.context;
    }

    private initContext(tiles: Tile[][]) {
        console.log('localWidth:', this.localWidth, 'localHeight:', this.localHeight);
        // Loop over localWidth and localHeight to initialize the literal html elements that will be in this window
        this.context = document.createElement('div');
        this.context.style.height = Renderer.pxs(this.localHeight * Renderer.elementSize);
        this.context.style.width = Renderer.pxs(this.localWidth * Renderer.elementSize);

        this.context.style.display = 'flex'; 

        if (this.startX == -1 && this.startY == -1) {
            this.context.style.margin = 'auto';
            this.context.style.marginTop = Renderer.pxs(5);
        }else {
            this.context.style.position = 'absolute';
            this.context.style.left = Renderer.pxs(this.startX);
            this.context.style.top = Renderer.pxs(this.startY);
        }

        if (this.bordered) {
            this.context.style.border = 'solid';
            this.context.style.borderWidth = Renderer.pxs(2);
        }

        for (let i = 0; i < this.localWidth; i++) {

            let colDiv = document.createElement('div');
            colDiv.style.width = Renderer.pxs(Renderer.elementSize * this.localHeight);
        
            for (let j = 0; j < this.localHeight; j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(Renderer.elementSize);
                element.style.width = Renderer.pxs(Renderer.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                element.innerHTML = tiles[i][j].ascii;
                element.style.backgroundColor = tiles[i][j].bg;
                element.style.color = tiles[i][j].fg;

                colDiv.appendChild(element);
            }
            this.context.appendChild(colDiv);
        }
    }

}