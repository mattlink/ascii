import { Room } from "./Rooms/Room";
import { World } from "./world";
import { DoorType, Door } from "./Rooms/Door";

// A level is an arrangement of Rooms representing a "full" dungeon floor, or layer of the world
export class Level {

    public name: string;
    public depth: number; // how deep is this level? ground level = 0

    private directions: DoorType[] = [DoorType.NorthDoor, DoorType.SouthDoor, DoorType.EastDoor, DoorType.WestDoor];
    
    private defaultRoom: Room;
    // the 2d grid of rooms representing this level
    private roomCount = 1; // the number of rooms in this level
    public rooms: Room[] = [];
    private activeRoom: Room;
    private activeRoomChanged: boolean = false;

    private world; // the world that this level is a part of
    // public pathQueues: Record<number, PathQueue> = {};

    public bgColor = null;

    constructor(world: World, name: string, depth: number, roomCount: number, defaultRoom: Room) {
        this.world = world;
        this.name = name;
        this.depth = depth;
        this.roomCount = roomCount;
        this.defaultRoom = defaultRoom;
        this.initializeRooms();
        this.activeRoom = this.rooms[0];
    }

    init() {
        this.generateRoomLayout();
        this.guaranteePathsToDoors();
    }

    // Deterime the arrangement of rooms in this level.
    // This should be called once when the level is initially generated
    private initializeRooms() {
        for (let i = 0; i < this.roomCount; i++) {
            let room = new Room(this.defaultRoom.getWidth(), this.defaultRoom.getHeight(), "Room ("+i+")");
            room.wallTile = this.defaultRoom.wallTile;
            room.floorTile = this.defaultRoom.floorTile;
            room.level = this.depth;
            
            room.init(this.defaultRoom.BSPIterations, this.defaultRoom.CAIterations);
            this.rooms.push(room);
        }
        this.activeRoom = this.rooms[0];
    }

    private generateRoomLayout() {
        for (let i = 0; i < this.roomCount - 1; i++) {
            let roomA = this.rooms[i];
            let roomB = this.rooms[i+1];

            // set a door from A to B
            let xr = Math.floor(Math.random() * this.getActiveRoom().getWidth());
            let yr = Math.floor(Math.random() * this.getActiveRoom().getHeight());
            let dir = this.directions[Math.floor(Math.random() * this.directions.length)];
            roomA.placeDoor(roomB, dir, xr, yr);

            // set the complementary door from B to A
            if (dir == DoorType.NorthDoor) 
                roomB.placeDoor(roomA, DoorType.SouthDoor, xr, yr);
            else if (dir == DoorType.SouthDoor)
                roomB.placeDoor(roomA, DoorType.NorthDoor, xr, yr);
            else if (dir == DoorType.WestDoor)
                roomB.placeDoor(roomA, DoorType.EastDoor, xr, yr);
            else if (dir == DoorType.EastDoor)
                roomB.placeDoor(roomA, DoorType.WestDoor, xr, yr);

        }
    }

    public guaranteePathsToDoors() {
        for (let i = 0; i < this.rooms.length; i++) {
            let room = this.rooms[i];
            let doors = room.getDoors();
            if (room == this.getActiveRoom() && doors.length > 0) {
                // just make sure the player can reach the first door
                room.clearPathBetween(this.world.getPlayer(), doors[0]);
            }
            else if (doors.length >= 2) {
                // make a path between two doors
                room.clearPathBetween(doors[0], doors[1]);
            }
            
        }
    }

    // Returns the index of the room belonging the below level and the door placed in that room
                            // r -> room index on this level, r2 -> room index on below level, trapDoor -> that actual door that was placed
    placeTrapDoorTo(level: Level): [number, number, Door] {
        // Choose a random place on the level to place this door to the below room
        // First, choose a random room
        let r = Math.floor(Math.random() * this.rooms.length);
        let room = this.rooms[r];
        // Second, choose a random place in the room 
        let x = Math.floor(Math.random() * room.getWidth());
        let y = Math.floor(Math.random() * room.getHeight());
        // Now, create the door and place it in the room. 
        // Choose a random room in the below level
        let r2 = Math.floor(Math.random() * level.rooms.length);

        let trapDoor: Door = room.placeDoor(level.rooms[r2], DoorType.TrapDoor, x, y);

        // Clear a path from every door in the room to the trap door
        room.getDoors().forEach(door => {
            if (door == trapDoor) return;
            room.clearPathBetween(door, trapDoor);
        });

        return [r, r2, trapDoor];
    }

    placeLadderDoorTo(level: Level, roomIndex: number, roomIndex2: number, x: number, y: number) {
        let room = this.rooms[roomIndex2];
        let ladderDoor = room.placeDoor(level.rooms[roomIndex], DoorType.LadderDoor, x, y);

        // Clear a path from every door in the room to this ladder door
        room.getDoors().forEach(door => {
            if (door == ladderDoor) return;
            room.clearPathBetween(door, ladderDoor);
        });
        return ladderDoor;
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
        this.activeRoom = null;
        this.activeRoom = room;
        this.activeRoomChanged = true;
    }
}