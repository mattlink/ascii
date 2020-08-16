import { Renderer } from './renderer';
import { MenuInfo, MenuOption, MenuTitle, MenuTextInput, MenuSubmit, MenuCheckBox } from './Menu/Menu';

// Think of Windows as rendering contexts

export class Window {
    
    public localWidth: number;
    public localHeight: number;

    public startX: number;
    public startY: number;

    public bordered: boolean = false;

    public isTiled: boolean = false;

    public context: HTMLElement;

    
    constructor(startX?: number, startY?: number, localWidth?: number, localHeight?: number, isTiled?: boolean) {
        this.startX = startX || -1;
        this.startY = startY || -1;

        this.localWidth = localWidth;
        this.localHeight = localHeight;

        this.isTiled = isTiled || false;
    }

    public getContext() {
        return this.context;
    }

    show() {
        if (this.isTiled) this.context.style.display = 'flex';
        else this.context.style.display = 'block';
    }

    hide() {
        this.context.style.display = 'none';
    }

    public initContext() {
        // Loop over localWidth and localHeight to initialize the literal html elements that will be in this window
        this.context = document.createElement('div');
        this.context.style.height = Renderer.pxs(this.localHeight * Renderer.elementSize);
        this.context.style.width = Renderer.pxs(this.localWidth * Renderer.elementSize);

        if (this.isTiled) this.context.style.display = 'flex'; 
        else this.context.style.display = 'block';

        // turn off user select:
        this.context.className += 'noselect ';

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

        // Only continue for a tile based window
        if (!this.isTiled) return;

        for (let i = 0; i < this.localWidth; i++) {

            let colDiv = document.createElement('div');
            colDiv.style.width = Renderer.pxs(Renderer.elementSize * this.localHeight);
        
            for (let j = 0; j < this.localHeight; j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(Renderer.elementSize);
                element.style.width = Renderer.pxs(Renderer.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                // element.innerHTML = tiles[i][j].ascii;
                // element.style.backgroundColor = tiles[i][j].bg;
                // element.style.color = tiles[i][j].fg;

                colDiv.appendChild(element);
            }
            this.context.appendChild(colDiv);
        }
    }

    /** 
    public static createGameTiles(localWidth: number, localHeight: number) {
        let containingDiv = document.createElement('div');
        containingDiv.style.display = 'flex';

        for (let i = 0; i < localWidth; i++) {

            let colDiv = document.createElement('div');
            colDiv.style.width = Renderer.pxs(Renderer.elementSize * localHeight);
        
            for (let j = 0; j < localHeight; j++) {
                var element = document.createElement('div');
                element.style.height = Renderer.pxs(Renderer.elementSize);
                element.style.width = Renderer.pxs(Renderer.elementSize);
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';

                // element.innerHTML = tiles[i][j].ascii;
                // element.style.backgroundColor = tiles[i][j].bg;
                // element.style.color = tiles[i][j].fg;

                colDiv.appendChild(element);
            }
            containingDiv.appendChild(colDiv);
        }

        return containingDiv;
    } */

    public static createMenuTitle(menuTitle: MenuTitle) {
        let child = document.createElement('div');
        child.style.height = Renderer.pxs(menuTitle.rowSize * Renderer.elementSize);
        child.style.lineHeight = Renderer.pxs(menuTitle.rowSize * Renderer.elementSize);
        child.style.fontSize = '30px';
        child.style.fontStyle = 'italic';
        child.style.textAlign = 'center';
        child.style.margin = 'auto';
        return child;
    }

    public static createMenuOption(menuOption: MenuOption) {
        let child = document.createElement('div');
        child.style.height = Renderer.pxs(menuOption.rowSize * Renderer.elementSize);
        child.style.lineHeight = Renderer.pxs(menuOption.rowSize * Renderer.elementSize);
        child.style.fontSize = '18px';
        child.style.textAlign = 'left';
        child.style.width = '300px';
        child.style.height = null;
        child.style.lineHeight = null;
        if (menuOption.hidden) child.style.display = 'none';
        return child;
    }

    public static createMenuTextInput(menuTextInput: MenuTextInput) {
        let child = document.createElement('input');
        child.type = 'text';
        child.id = menuTextInput.shadowText;
        child.placeholder = menuTextInput.shadowText;
        child.name = menuTextInput.shadowText;
        child.style.margin = 'auto';

        if (menuTextInput.isPassword) {
            child.type = 'password';
        }

        if (menuTextInput.isEmail) {
            child.type = 'email';
        }

        return child;

    }

    public static createMenuCheckBox(menuCheckBox: MenuCheckBox) {
        let child = document.createElement('input');
        child.type = 'checkbox';
        child.name = menuCheckBox.text;
        child.checked = menuCheckBox.checked;

        return child;
    }

    public static createMenuCheckBoxLabel(menuCheckBox: MenuCheckBox) {
        let child = document.createElement('label');
        // child.for = menuCheckBox.text;
        child.innerHTML = menuCheckBox.text;
        child.style.color = 'white';

        return child;
    }

    public static createMenuSubmit(menuSubmit: MenuSubmit){
        let child = document.createElement('button');
        child.type = 'button';
        child.value = menuSubmit.text;
        child.textContent = menuSubmit.text;
        child.style.margin = '5px'; 
        child.onclick = menuSubmit.onSubmit;

        return child;
    }

    public static createMenuInfo(menuInfo: MenuInfo) {
        let child = document.createElement('div');
        child.style.fontSize = '20px';
        child.style.textAlign = 'left';
        child.style.height = null;
        child.style.lineHeight = null;

        // Check if this is a buffer info
        if (menuInfo.content == '') {
            child.style.margin = '5px';
        }   

        if (menuInfo.center) {
            child.style.margin = 'auto';
        }
        if (menuInfo.italic) {
            child.style.fontStyle = 'italic';
            child.style.fontSize = '18px';
        }
        return child;
    }

}
