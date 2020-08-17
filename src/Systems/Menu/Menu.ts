export abstract class MenuElement { 

    rowSize: number;
    
    constructor(rowSize?: number) {
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

export class MenuTextInput extends MenuElement {
    shadowText: string;
    isPassword: boolean = false;
    isEmail: boolean = false;
    constructor(shadowText: string, isPassword?: boolean, isEmail?: boolean) {
        super(1);
        this.shadowText = shadowText;
        this.isPassword = isPassword || false;
        this.isEmail = isEmail || false;
    }
}

export class MenuCheckBox extends MenuElement {
    checked: boolean = true;
    text: string = '';
    constructor(checked: boolean, text: string) {
        super(1);
        this.checked = checked;
        this.text = text;
    }
}

export class MenuSubmit extends MenuElement {
    text: string;
    onSubmit: (this: GlobalEventHandlers, ev: MouseEvent) => any;
    constructor(text: string, onSubmit?: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        super(1);
        this.text = text;
        this.onSubmit = onSubmit;
    }
}

export class MenuOption extends MenuElement {
    name: string;
    letter: string; // the letter used to select this option
    // subOptions: MenuOption[] = [];

    toMenu: string = null; // name of menu which selecting this option takes you to
    toState: string = null;
    hidden: boolean = false;

    constructor(name: string, letter: string, toState?: string, toMenu?: string, hidden?: boolean) { 
        super(1);
        this.name = name;
        this.letter = letter;
        this.toState = toState || null;
        this.toMenu = toMenu || null;
        this.hidden = hidden || false;
    }
}

export class MenuInfo extends MenuElement {
    label: string = '';
    content: string = '';
    italic: boolean = false;
    center: boolean = false;
    constructor(content: string, label?: string, italic?: boolean, center?: boolean) {
        super(2);
        this.content = content;
        this.label = label || '';
        this.italic = italic || false;
        this.center = center || false;
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

    public static width;
    public static height;

    public static defaultFg = 'white';
    public static defaultBg = 'black';

    public static defaultSelectedFg = 'black';
    public static defaultSelectedBg = 'lightGrey';

    public name: string;

    public options: Record<string, MenuOption> = {};
    public rows = [];
    public selectedElement: number = -1;
    public dontCenter: boolean = false;

    public formSubmit: (this: GlobalEventHandlers, ev: MouseEvent) => any;

    constructor(rows, dontCenter?: boolean) {
        this.rows = rows;
        rows.forEach(row => {
            for (let i = 0; i < row.length; i++) {
                let element = row[i];
                if (element instanceof MenuSubmit) this.formSubmit = element.onSubmit;
                if (element instanceof MenuOption) this.options[element.letter] = element;
            }
        })
        this.dontCenter = dontCenter || false;
    }
    
    addElement(element: MenuElement) {
        if (element instanceof MenuOption) this.options[element.letter] = element;
    }
}