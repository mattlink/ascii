import { Nexus } from './TD/Nexus';
import { Room } from './Rooms/Room';
import { Tile } from './tile';
import { ShopItem } from './TD/ShopItem';
import { Spawner } from './TD/Spawner';
import { bfs } from './util';
import { Game } from './Game';


export class World {

    private nexus: Nexus;
    private room: Room; // This represents the playable environment of the world

    public items: ShopItem[] = [];

    public wave: number = 0; // Keeps track of how many waves have occurred. this is essentially the level of the game
    private turnsPassed: number = 0; // Keeps track of total game ticks (turns)

    // Keep track of message information
    private messageHistory: string[] = [];
    private messages: string[] = [];

    private game: Game;

    constructor(game?: Game) {
        this.game = game || null;
    }

    init(WORLD_WIDTH, WORLD_HEIGHT) {
        // Initialize the Room
        this.room = new Room(WORLD_WIDTH, WORLD_HEIGHT, 'World Room');
        this.room.init(0, 12);

        const spawner = new Spawner(0, 0, this.room);
        // Add the spawner

        let attempts = 0;
        while (attempts < 1000) {
            const randX = Math.floor((Math.random() * WORLD_WIDTH));
            const randY = Math.floor((Math.random() * WORLD_HEIGHT));
            const nexusX = Math.floor((Math.random() * WORLD_WIDTH));
            const nexusY = Math.floor((Math.random() * WORLD_HEIGHT));

            // Create the Nexus and add it to the room
            this.nexus = new Nexus(nexusX, nexusY, new Tile('N', '#8A2BE2', '#00FFFF'));
            this.room.correctSpawn(this.nexus);

            const dx = Math.abs(this.nexus.x - randX);
            const dy = Math.abs(this.nexus.y - randY);

            // Ensure that the spawner is at least 10 tiles away
            if (dx + dy < 10) {
                attempts++;
                continue;
            }

            spawner.x = randX;
            spawner.y = randY;

            const cameFrom = bfs(this, this.nexus, spawner);

            // Check if there is a valid path from the spawner to the nexus
            if (!(spawner.key() in cameFrom)) {
                attempts++;
                continue;
            }

            this.room.addActor(spawner);
            break;
        }
        this.room.objects[this.nexus.x][this.nexus.y] = this.nexus;
    }

    takeTurn() {
        this.messages = [];

        // TODO: turn aka "tick" code
        this.room.handleActorTurns(this);

        // Let all items take a turn (Turrets, Walls, etc)
        this.items.forEach(item => {
            item.takeTurn(this);
        });

        this.turnsPassed++;

        if (this.messages.length > 0) {
            this.messages.forEach(message => {
                this.messageHistory.push(message);
            });
        }

    }

    addFunds(funds: number) {
        this.game.funds += funds;
    }

    getGame() {
        return this.game;
    }

    getActiveRoom(): Room {
        return this.room;
    }

    getRoom() {
        return this.room;
    }

    clearMessage() {
        this.messages = [];
    }

    appendMessage(message: string) {
        this.messages.push(message);
    }
    getCurrentMessages() {
        return this.messages;
    }

    getTurnsPassed() {
        return this.turnsPassed;
    }

    getPlayer() {
        return this.nexus;
    }

}
