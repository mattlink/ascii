import { Importer } from "./importer";
import { Game } from "./Game";
import { World } from "./world";
import { Window } from './Systems/window';
import { Renderer } from "./Systems/renderer";
import { Player } from "./Actors/Player";

import * as jsonConfig from "./room.json";
import * as worldConfig from "./world.json";
import { IO } from "./Systems/io";
console.log(jsonConfig);

class ga extends Game {

    
    window: Window;
    renderer: Renderer;

    world: World;

    load() {
        this.world = Importer.importWorld(worldConfig);

        this.window = new Window(-1, -1, this.world.getActiveRoom().getWidth(), this.world.getActiveRoom().getHeight(), this.world.getActiveRoom().getTiles());
        this.renderer = new Renderer();
        this.renderer.addWindow(this.window);
        this.renderer.renderRoom(this.world.getActiveRoom(), this.window.getContext());

        this.world.getActiveRoom().getActors().forEach(actor => {

            if (actor instanceof Player && this.world.getPlayer() == null) this.world.setPlayer(actor);

            this.renderer.updateGameObject(actor, this.window.getContext());
            this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.window.getContext());
        });
    }

    update(key: string) {
        this.world.getPlayer().receiveKeyInput(key);
        this.world.takeTurn();
    }

    draw() {

        // Draw everything /around/ each actor
        this.world.getActiveRoom().getActors().forEach(actor => {
            this.renderer.renderObjectContext(actor, this.world.getActiveRoom(), this.window.getContext());
        });

        // Draw every actor (this drawing order makes sure actors contexts don't render over eachother)
        this.world.getActiveRoom().getActors().forEach(actor => {
            this.renderer.updateGameObject(actor, this.window.getContext());
        });
    }
}

let g = new ga();
g.load();
IO.genericKeyBinding(function(key: string) {
    g.update(key);
    g.draw();
})
