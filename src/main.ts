import { Game, Renderer, World, Window, Shovel, Cave, Tile } from '.';

class AnimGame extends Game {

    renderer: Renderer;
    window: Window;
    window2: Window;
    window3: Window;
    world: World;

    load() {
        this.renderer = new Renderer();

        this.world = new World();
        let room = new Cave(4,4,'Anim-Room');
        room.wallTile = new Tile('~', 'green', 'white');
        room.floorTile = new Tile('~', 'red', 'white');
        room.init();

        let room2 = new Cave(4,4,'Anim-Room2');
        room2.wallTile = new Tile('%', 'red', 'white');
        room2.wallTile.className = 'tile-fire';
        room2.floorTile = new Tile('%', 'orange', 'white');
        room2.floorTile.className = 'tile-fire';
        room2.init();

        let room3 = new Cave(4,4,'Anim-Room3');
        room3.wallTile = new Tile('^', 'green', 'white');
        room3.wallTile.className = 'tile-forest';
        room3.floorTile = new Tile('Y', 'green', 'white');
        room3.floorTile.className = 'tile-forest';
        room3.init();

        this.world.addRoom(room);
        this.world.addRoom(room2);
        this.world.addRoom(room3);
        

        this.window = new Window(-1, -1, 4, 4, room.getTiles());
        this.window2= new Window(-1, -1, 4, 4, room2.getTiles());
        this.window3= new Window(-1, -1, 4, 4, room3.getTiles());
        this.renderer.addWindow(this.window);
        this.renderer.addWindow(this.window2);
        this.renderer.addWindow(this.window3);
    }

    update(key) {

    }

    draw() {
        for (let i = 0; i < this.world.getRooms().length; i++) {
            if (i == 0) {
                this.renderer.renderRoom(this.world.getRooms()[i], this.window.getContext());
            }
            if (i == 1) {
                this.renderer.renderRoom(this.world.getRooms()[i], this.window2.getContext());
            }
            if (i == 2) {
                this.renderer.renderRoom(this.world.getRooms()[i], this.window3.getContext());
            }
        }
    }
}

let g = new AnimGame();
g.load();
g.draw();
