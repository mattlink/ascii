import { Room } from './Rooms/Room';
import { Level } from './Level';
import { Player } from './Actors/Player';

// Currently, the World just maintains all the rooms and manages turns taken

export class World {
    
    private levels: Level[] = [];

    private activeLevel: Level;

    private player: Player = null;

    private turnsPassed: number = 0;

    private messageHistory: string[] = [];
    private messages: string[] = [];

    // Perhaps provide a random seed to the world for seeding room (dungeon) generation, and random events
    constructor() {}

    takeTurn() {
        this.messages = [];

        // instead of having every room in existence take a turn, only have the active room take a turn:
        this.activeLevel.takeTurn(this);

        this.turnsPassed++;

        if (this.messages.length > 0) {
            this.messages.forEach(message => {
                this.messageHistory.push(message);
            });
        }
    }

    addLevel(level: Level) {
        if (this.activeLevel == null) this.activeLevel = level;
        this.levels.push(level);
    }
    
    getActiveLevel(): Level {
        return this.activeLevel;
    }

    getActiveRoom(): Room {
        return this.activeLevel.getActiveRoom();
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
        return this.player;
    }

    setPlayer(player: Player) {
        this.player = player;
    }    
}