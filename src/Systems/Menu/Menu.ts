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
    letter: string; // the letter used to select this option
    subOptions: MenuOption[] = [];
    constructor(name: string, letter: string) { 
        super(1);
        this.name = name;
        this.letter = letter;
    }
}

export class MenuInfo extends MenuElement {
    label: string = '';
    content: string = '';
    constructor(content: string, label?: string) {
        super(1);
        this.content = content;
        this.label = label || '';
    }
    getContent() {
        if (this.label != '') {
            return this.label + ': ' + this.content;
        }
        return this.content;
    }
}

export class MenuTable extends MenuElement {
    elements: any[];
    constructor() {
        super();
    }
}

export class Menu {
    private width;
    private height;

    public defaultFg = 'white';
    public defaultBg = 'black';

    public defaultSelectedFg = 'black';
    public defaultSelectedBg = 'lightGrey';

    public elements: MenuElement[] = [];
    public selectedElement: number = -1;

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