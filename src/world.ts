import { Room } from './Rooms/Room';
import { Player } from './Actors/Player';

// Currently, the World just maintains all the rooms and manages turns taken

export class World {
    
    private rooms: Room[] = [];

    private activeRoom: Room;

    private player: Player = null;

    private activeRoomChanged: boolean = false;

    private turnsPassed: number = 0;

    private messageHistory: string[] = [];
    private messages: string[] = [];

    // Perhaps provide a random seed to the world for seeding room (dungeon) generation, and random events
    constructor() {}

    takeTurn() {
        this.messages = [];

        // this.rooms.forEach(room => {
        //     room.handleActorTurns(this);
        // });

        // instead of having every room in existence take a turn, only have the active room take a turn:
        this.activeRoom.handleActorTurns(this);

        this.turnsPassed++;

        if (this.messages.length > 0) {
            this.messages.forEach(message => {
                this.messageHistory.push(message);
            });
        }
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

    getActiveRoomChanged() {
        if (this.activeRoomChanged) {
            this.activeRoomChanged = false;
            return true;
        }
        else return false;
    }

    getPlayer() {
        return this.player;
    }

    setPlayer(player: Player) {
        this.player = player;
    }


    getActiveRoom() {
        return this.activeRoom;
    }

    setActiveRoom(room: Room) {
        this.activeRoom = null;
        this.activeRoom = room;
        this.activeRoomChanged = true;
    }

    addRoom(room: Room) {
        if (this.rooms.length == 0) this.activeRoom = room;
        else {
            // Place a door from the activeRoom to the new room
            // this.activeRoom.placeDoor(room);
            // room.placeDoor(this.activeRoom);

            // // Place a door leading back from the new to the room that is currently active
            // room.placeDoor(new Door(this.activeRoom));
        }

        this.rooms.push(room);   
    }

    getRooms() {
        return this.rooms;
    }

    
}