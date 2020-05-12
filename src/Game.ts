import { KeyQueue } from './util';
import { IO } from './Systems/io';
import { Renderer } from './Systems/renderer';
import { World } from './world';
import { Menu } from './Systems/Menu/Menu';
import { GameObject } from './GameObject';

export abstract class Game {

    protected keyQueue: KeyQueue = new KeyQueue();

    protected algoVis = false;
    public funds = 0;

    public menus: Record<string, Menu> = {};


    public selected : GameObject;


    constructor() {}

    abstract renderer: Renderer;
    abstract world: World;

    // used to load json configs, audio samples, etc. Called one time after invoking run().
    abstract load();

    // update and draw are called every frame after each valid key press (after each turn or menu change)
    abstract update(key: string);
    abstract draw();
}
