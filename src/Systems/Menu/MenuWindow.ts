import { Renderer } from '../renderer';
import { Window } from '../window';
import { Menu, MenuTitle, MenuOption, MenuTable } from './Menu';

// Think of Windows as rendering contexts

// CONSIDERATION: do we want the windowing code to handle outlining the window itself?

export class MenuWindow {
    
    public localWidth: number;
    public localHeight: number;

    public startX: number;
    public startY: number;

    public bordered: boolean = false;

    private context: HTMLElement;

    private menu: Menu;

    
    constructor(menu: Menu, startX: number, startY: number, localWidth: number, localHeight: number) {
        this.startX = startX || -1;
        this.startY = startY || -1;

        this.localWidth = localWidth;
        this.localHeight = localHeight;

        this.menu = menu;
        this.initMenuContext(this.menu);
    }

    public getContext() {
        return this.context;
    }
    show() {
        this.context.style.display = 'block';
    }

    hide() {
        this.context.style.display = 'none';
    }

    private initMenuContext(menu: Menu) {
        this.context = document.createElement('div');
        this.context.style.display = 'block';
        this.context.style.height = Renderer.pxs(this.localHeight * Renderer.elementSize);
        this.context.style.width = Renderer.pxs(this.localWidth * Renderer.elementSize);

        if (this.startX == -1 && this.startY == -1) {
            this.context.style.margin = 'auto';
            // this.context.style.marginTop = Renderer.pxs(5);
        }else {
            this.context.style.position = 'absolute';
            this.context.style.left = Renderer.pxs(this.startX);
            this.context.style.top = Renderer.pxs(this.startY);
        }

        if (this.bordered) {
            this.context.style.border = 'solid';
            this.context.style.borderWidth = Renderer.pxs(2);
        }


        for (let i = 0; i < menu.elements.length; i++) {
            let elem = menu.elements[i];
            
            let child = document.createElement('div');
            child.style.height = Renderer.pxs(elem.rowSize * Renderer.elementSize);
            child.style.lineHeight = Renderer.pxs(elem.rowSize * Renderer.elementSize);
            
            if (elem instanceof MenuTitle) {
                child.innerHTML = elem.title;
                child.style.fontSize = '30px';
                child.style.fontStyle = 'italic';
                child.style.textAlign = 'center';
                child.id = 'menu-title';
            }

            if (elem instanceof MenuOption) {
                child.innerHTML = elem.name;
                child.style.margin = 'auto';
                child.style.textAlign = 'center';
                child.style.width = '300px';
                child.style.height = null;
                child.style.lineHeight = null;

                if (i == menu.selectedElement) {
                    child.innerHTML = elem.name;
                    child.style.backgroundColor = menu.defaultSelectedBg;
                    child.style.color = menu.defaultSelectedFg;
                }
                else {
                    child.innerHTML = elem.name;
                    child.style.backgroundColor = menu.defaultBg;
                    child.style.color = menu.defaultFg;
                    child.style.border = 'none';
                }

                child.id = 'menu-option';
            }

            if (elem instanceof MenuTable) {
                child = document.createElement('table');
                child.style.margin = 'auto';
                child.style.border = '1px solid black';
                child.style.height = null;

                let invLimit = 15;
                let row = document.createElement('tr');
                row.style.height = Renderer.pxs(Renderer.elementSize);
                row.style.width = Renderer.pxs(invLimit * Renderer.elementSize);
                
                for (let i = 0; i < invLimit; i++) {
                    let col = document.createElement('td');
                    // col.style.border = '1px solid black';

                    let innerDiv = document.createElement('div');
                    innerDiv.style.height = Renderer.pxs(Renderer.elementSize);
                    innerDiv.style.width = Renderer.pxs(Renderer.elementSize);
                    innerDiv.style.textAlign = 'center';
                    innerDiv.innerHTML = '';

                    col.appendChild(innerDiv);
                    row.appendChild(col);
                }

                child.appendChild(row);

                child.id = 'menu-table';
            }

            console.log('trying to append child');
            this.context.appendChild(child);
            
        }

    }

}