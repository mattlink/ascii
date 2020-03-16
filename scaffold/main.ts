import  { Game, Renderer, IO } from 'ascii';

class game extends Game {

    renderer: Renderer;

    load() {

        // load things at the start of the program
        this.renderer = new Renderer();

    }

    update(key: string) {

        // update code, executed every keypress

    }

    draw() {

        // drawing code to be executed after every update
        
    }
}

let g = new game();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
})
