import { Room } from './Rooms/Room';
import { Level } from './Level';
import { Player } from './Actors/Player';
import { Mob } from './Actors/Mob';
import { Tile } from './tile';
import { Sword } from './Items/Sword';

// There should usually be one instance of World per game. This stores a set of levels in the world and manages turns being taken.

export class World {
    
    private levels: Level[] = [];

    private activeLevel: number = 0;

    private player: Player = null;

    private turnsPassed: number = 0;

    private messageHistory: string[] = [];
    private messages: string[] = [];

    // Perhaps provide a random seed to the world for seeding room (dungeon) generation, and random events
    constructor() {}

    initLevels() {
        this.levels.forEach(level => {
            level.init();
        });
    }

    takeTurn() {
        this.messages = [];

        // replenish player health
        if (this.player.health < 100) this.player.health += 1;

        // instead of having every room in existence take a turn, only have the active room take a turn:
        this.levels[this.activeLevel].takeTurn(this);

        this.turnsPassed++;

        if (this.messages.length > 0) {
            this.messages.forEach(message => {
                this.messageHistory.push(message);
            });
        }
    }

    spawnThings() {
        let room = this.getActiveLevel().getActiveRoom();

        // create a player!
        let player = new Player(20, 20, new Tile('@', 'red', 'black'));
        let sword = new Sword(player.x, player.y, new Tile('(', 'red', 'purple'));
        player.addInventoryItem(sword);
        player.equipt = sword;
        this.setPlayer(player);
        room.addActor(player);

        let goat = new Mob('goat', 4, 4, new Tile('g', 'white', 'black'));
        // mob.equipt = new Sword(mob.x, mob.y, new Tile('(', 'red', 'purple'));
        room.addActor(goat);

        let orc = new Mob('orc', 5, 5, new Tile('O', 'green', 'black'), true);
        orc.equipt = new Sword(orc.x, orc.y, sword.getTile());
        orc.equipt.damage = 20;
        room.addActor(orc);
    }

    // Place trap doors connecting each level to the one below it
    connectLevels() {
        // Only proceed if there is more than 1 level to connect
        if (this.levels.length <= 1) return;
        for (let i = 0; i < this.levels.length - 1; i++) {
            let trapDoorResult = this.levels[i].placeTrapDoorTo(this.levels[i+1]);
            
            // Clear a path from the TrapDoor spawn on the level below to other doors in that room
            let r2 = trapDoorResult[1];
            let roomBelow = this.levels[i+1].rooms[r2];
            roomBelow.getDoors().forEach(door => {
                roomBelow.clearPathBetween(trapDoorResult[2], door);
            });
        
        }
    }

    addLevel(level: Level) {
        //if (this.activeLevel == null) this.activeLevel = level;
        this.levels.push(level);
        console.log("addLevel invoked:",this.levels)
    }
    
    updateActiveLevel(levelDepth: number) {
        this.activeLevel = levelDepth;
    }

    getActiveLevel(): Level {
        return this.levels[this.activeLevel];
    }

    getActiveRoom(): Room {
        return this.levels[this.activeLevel].getActiveRoom();
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