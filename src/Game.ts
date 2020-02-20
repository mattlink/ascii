export abstract class Game {

    constructor() {}

    // used to load json configs, audio samples, etc
    abstract load();

    // we call update when we are ready for the world to take a turn.
    abstract update(key: string);

    // what menu or game room are we rendering to what window
    abstract draw();
}