/* This is sort of kind of a world "system" 

Notes about what this World class could or should be:

- keep things related to generating the initial world state (?)
- leave propagation of the simulation to another system
- in theory, if users are to specify custom "factors" into the way their world is generated, 
    then those factors would be tweaked here... (maybe?)
    - but, maybe this would be better left for a "Generator" class
        - it could generate types of rooms/dungeons?

*/

//import { ASCII } from './ascii';
import { Room } from './Rooms/Room';
import { Door } from './Rooms/Door';

// Currently, the World just maintains all the rooms and manages turns taken

export class World {
    
    private rooms: Room[] = [];

    private activeRoom: Room;

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