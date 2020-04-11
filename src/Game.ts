import { KeyQueue } from './util';
import { IO } from './Systems/io';
import { Renderer } from './Systems/renderer';
import { World } from './world';

export abstract class Game {

    protected keyQueue: KeyQueue = new KeyQueue();

    private now;
    private dt;
    private last;
    private step;

    protected algoVis = false;

    constructor() {}

    abstract renderer: Renderer;
    abstract world: World;

    // used to load json configs, audio samples, etc. Called one time after invoking run().
    abstract load();

    // update and draw are called every frame after run is invoked.
    abstract update(dt: number);
    abstract draw();

    run() {
        IO.InitKeyQueue(this.keyQueue);
        this.load();

        this.now = 0;
        this.dt = 0;
        this.last = this.timestamp();
        this.step = 1/60;

        this.frame();
    }

    private frame = () => 
    {
        this.now = this.timestamp();
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000); // duration in seconds
        while (this.dt > this.step) {
            this.dt = this.dt - this.step;
            this.update(this.step);
        }
        // this.update(this.dt);
        this.draw();
        this.last = this.now;
        requestAnimationFrame(this.frame);
    }

    private timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
}