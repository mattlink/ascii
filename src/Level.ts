import { Room } from "./Rooms/Room";
import { World } from "./world";
import { Player } from "./Actors/Player";
import { Mob } from "./Actors/Mob";
import { Tile } from "./tile";
import { DoorType, Door } from "./Rooms/Door";
import { Sword } from './Items/Sword';
import { Game } from "./Game";
import { PathQueue } from './util';

// A level is an arrangement of Rooms representing a "full" dungeon floor, or layer of the world
export class Level {

    public name: string;
    public depth: number; // how deep is this level? ground level = 0

    private directions: DoorType[] = [DoorType.NorthDoor, DoorType.SouthDoor, DoorType.EastDoor, DoorType.WestDoor];
    
    private defaultRoom: Room;
    // the 2d grid of rooms representing this level
    private roomCount = 4; // the number of rooms in this level
    public rooms: Room[] = [];
    private activeRoom: Room;
    private activeRoomChanged: boolean = false;

    private world; // the world that this level is a part of
    // public pathQueues: Record<number, PathQueue> = {};

    constructor(world: World, name: string, depth: number, defaultRoom: Room) {
        this.world = world;
        this.name = name;
        this.depth = depth;
        this.defaultRoom = defaultRoom;
    }

    init() {
        this.initializeRooms();
        this.activeRoom = this.rooms[0];
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
            
            room.init(0, 12);
            if (i == 0) {
                // create a player!
                let player = new Player(20, 20, new Tile('C', 'purple', 'black'));
                player.equipt = new Sword(player.x, player.y, new Tile('(', 'red', 'purple'));
                this.world.setPlayer(player);
                room.addActor(player);

                let mob = new Mob('Mob 1', 4, 4, new Tile('h', 'red', 'green'));
                mob.equipt = new Sword(mob.x, mob.y, new Tile('(', 'red', 'purple'));
                room.addActor(mob);
            }
            this.rooms.push(room);
        }
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
            if (room == this.getActiveRoom()) {
                // just make sure the player can reach the first door
                room.clearPathBetween(this.world.getPlayer(), doors[0]);
            }
            else if (doors.length >= 2) {
                // make a path between two doors
                room.clearPathBetween(doors[0], doors[1]);
            }
            
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
        this.activeRoom = null;
        this.activeRoom = room;
        this.activeRoomChanged = true;
    }

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
}