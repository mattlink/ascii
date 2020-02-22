export class Tile {

    public ascii: string = '.';
    public fg: string = 'black';
    public bg: string = 'white';

    public className = null;

    constructor()
    constructor(ascii: string)
    constructor(ascii: string, fg: string, bg: string)
    constructor(ascii?: string, fg?: string, bg?: string) {
        // Check for "empty constructor"
        if (typeof ascii === 'undefined' || ascii == null) {
            return;
        }

        this.ascii = ascii;

        if (fg != null && bg != null) {
            this.fg = fg;
            this.bg = bg;
            return;
        }
        
        return;
    }
}