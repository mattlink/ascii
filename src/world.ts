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
import { Room } from './Entity/Rooms/Room';

// Currently, the World just maintains all the rooms and manages turns taken

export class World {
    
    private rooms: Room[] = [];

    private activeRoom: Room;

    // Perhaps provide a random seed to the world for seeding room (dungeon) generation, and random events
    constructor() {
        
    }

    getActiveRoom() {
        return this.activeRoom;
    }

    setActiveRoom(room: Room) {
        this.activeRoom = room;
    }

    addRoom(room: Room) {
        if (this.rooms.length == 0) this.activeRoom = room;
        this.rooms.push(room);
    }

    takeTurn() {
        this.rooms.forEach(room => {
            // check if this room is active
            room.handleActorTurns();
        });
    }
}