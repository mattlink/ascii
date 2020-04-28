import { Nexus } from './TD/Nexus';
import { Room } from './Rooms/Room';
import { Tile } from './tile';

const WORLD_HEIGHT = 40;
const WORLD_WIDTH = 70;

export class World {

    private nexus: Nexus;
    private room: Room; // This represents the playable environment of the world

    public wave: number = 0; // Keeps track of how many waves have occurred. this is essentially the level of the game
    private turnsPassed: number = 0; // Keeps track of total game ticks (turns)

    // Keep track of message information
    private messageHistory: string[] = [];
    private messages: string[] = [];

    constructor() {}

    init() {
        // Initialize the Room
        this.room = new Room(WORLD_WIDTH, WORLD_HEIGHT, 'World Room');
        this.room.init(0, 12);

        // Create the Nexus and add it to the room
        this.nexus = new Nexus(this.room.getWidth() / 2, this.room.getHeight() / 2, new Tile('*', 'red', 'white'));
        this.room.objects[this.nexus.x][this.nexus.y] = this.nexus;        
    }

    takeTurn() {
        this.messages = [];

        // TODO: turn aka "tick" code
        this.room.handleActorTurns(this);

        this.turnsPassed++;

        if (this.messages.length > 0) {
            this.messages.forEach(message => {
                this.messageHistory.push(message);
            });
        }
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