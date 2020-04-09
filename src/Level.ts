import { Room } from "./Rooms/Room";
import { World } from "./world";
import { Player } from "./Actors/Player";
import { Tile } from "./tile";
import { DoorType, Door } from "./Rooms/Door";

// A level is an arrangement of Rooms representing a "full" dungeon floor, or layer of the world
export class Level {

    public name: string;
    public depth: number; // how deep is this level? ground level = 0

    private directions: DoorType[] = [DoorType.NorthDoor, DoorType.SouthDoor, DoorType.EastDoor, DoorType.WestDoor];
    
    private defaultRoom: Room;
    // the 2d grid of rooms representing this level
    private roomCount = 4; // the number of rooms in this levl
    private rooms: Room[] = [];
    private activeRoom: Room;
    private activeRoomChanged: boolean = false;

    // private roomHeight = 50;
    // private roomWidth = 30;

    constructor(name: string, depth: number, defaultRoom: Room) {
        this.name = name;
        this.depth = depth;
        this.defaultRoom = defaultRoom;
    }

    init() {
        this.initializeRooms();
        this.activeRoom = this.rooms[0];
        this.generateRoomLayout();
    }

    // Deterime the arrangement of rooms in this level.
    // This should be called once when the level is initially generated
    private initializeRooms() {
        for (let i = 0; i < this.roomCount; i++) {
            let room = new Room(this.defaultRoom.getWidth(), this.defaultRoom.getHeight(), "Room ("+i+")");
            room.init(0, 12);
            if (i == 0) room.addActor(new Player(20, 20, new Tile('@', 'red', 'black')));
            this.rooms.push(room);
        }
    }

    private generateRoomLayout() {
        for (let i = 0; i < this.roomCount - 1; i++) {
            let roomA = this.rooms[i];
            let roomB = this.rooms[i+1];

            // set a door from A to B
            let dir = this.directions[Math.floor(Math.random() * this.directions.length)];
            let door1 = roomA.placeDoor(roomB, dir);

            // set the complementary door from B to A
            if (dir == DoorType.NorthDoor) 
                roomB.placeDoor(roomA, DoorType.SouthDoor, door1.x, door1.y);
            else if (dir == DoorType.SouthDoor)
                roomB.placeDoor(roomA, DoorType.NorthDoor, door1.x, door1.y);
            else if (dir == DoorType.WestDoor)
                roomB.placeDoor(roomA, DoorType.EastDoor, door1.x, door1.y);
            else if (dir == DoorType.EastDoor)
                roomB.placeDoor(roomA, DoorType.WestDoor, door1.x, door1.y);

        }
    }

    takeTurn(world: World) {
        this.activeRoom.handleActorTurns(world);
    }

    getActiveRoom() {
        return this.activeRoom;
    }

    getActiveRoomChanged() {
        if (this.activeRoomChanged) {
            this.activeRoomChanged = false;
            return true;
        }
        else return false;
    }

    setActiveRoom(room: Room) {
        console.log("active room invoked")
        this.activeRoom = null;
        this.activeRoom = room;
        console.log("new active room: ", this.activeRoom);
        this.activeRoomChanged = true;
    }

    // addAvailableRoom(room: Room) {
    //     this.availableRooms.push(room);
    // }

    /*addRoom(room: Room) {
        if (this.rooms.length == 0) this.activeRoom = room;
        else {
            // Place a door from the activeRoom to the new room
            // this.activeRoom.placeDoor(room);
            // room.placeDoor(this.activeRoom);

            // // Place a door leading back from the new to the room that is currently active
            // room.placeDoor(new Door(this.activeRoom));
        }

        this.rooms.push(room);   
    }*/

    /*getRooms() {
        return this.rooms;
    }*/
}