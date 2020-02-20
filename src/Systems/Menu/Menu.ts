import { Tile } from "../../tile";


export abstract class MenuElement { 

    rowSize: number;
    
    constructor(rowSize?: number) {;
        this.rowSize = rowSize || 1;
    }

}

export class MenuTitle extends MenuElement {
    title: string;
    constructor(title: string){
        super(3);
        this.title = title;
    }
}

export class MenuOption extends MenuElement {
    name: string;
    constructor(name: string) { 
        super(1);
        this.name = name;
    }
}

export class Menu {
    private width;
    private height;

    public defaultFg = 'black';
    public defaultBg = 'white';

    public defaultSelectedFg = 'black';
    public defaultSelectedBg = 'lightGrey';

    public elements: MenuElement[] = [];
    public selectedElement: number = 0;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    addElement(element: MenuElement) {
        this.elements.push(element);
    }

    getWidth() {
        return this.width; 
    }

    getHeight() {
        return this.height;
    }
}