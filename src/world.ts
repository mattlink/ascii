import { Room } from './Rooms/Room';
import { Player } from './Actors/Player';

// Currently, the World just maintains all the rooms and manages turns taken

export class World {
    
    private rooms: Room[] = [];

    private activeRoom: Room;

    private player: Player;

    private activeRoomChanged: boolean = false;

    // Perhaps provide a random seed to the world for seeding room (dungeon) generation, and random events
    constructor() {}

    takeTurn() {
        this.rooms.forEach(room => {
            // check if this room is active
            room.handleActorTurns(this);
        });
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