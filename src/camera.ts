import { Renderer } from './renderer';
import { Window } from './window';
import { Room } from './Entity/Rooms/Room';
import { Tile } from './tile';

export class Camera {

    // information about how much of the world to be showing in the rendered area
    // the height and width 
    public viewWidth: number;
    public viewHeight: number;

    public cx: number; // center point x
    public cy: number; // center point y


    // keep track of the area to render
    private room: Room;

    constructor(room: Room, viewWidth: number, viewHeight: number, cx: number, cy: number) {
        this.room = room;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.cx = cx;
        this.cy = cy;
    }

    public reCenter(cx: number, cy: number) {
        this.cx = cx;
        this.cy = cy;
        // this.filterView();
    }

    // Change the room that this camera is looking at!
    public switchTargetRoom(room: Room) {
        this.room = room;
    }

    // public adjustViewDims(dx: number, dy: number) {
    //     this.viewWidth += dx;
    //     this.viewHeight += dy;
    //     // TODO: Pass an update call to the renderer so that it renders to the updated FOV
    //     // this.renderer.updateCamera(this, this.world.getActiveRoom().objects);
    // }

    public getStartX() {
        return this.cx - Math.floor(this.viewWidth / 2);
        // return Math.floor(this.viewWidth / 2) - this.cx;
    }

    public getStartY() {
        return this.cy - Math.floor(this.viewHeight / 2);
        // return Math.floor(this.viewHeight / 2) - this.cy;
    }

    public getEndX() {
        return this.cx + Math.ceil(this.viewWidth / 2);
    }

    public getEndY() {
        return this.cy + Math.ceil(this.viewHeight / 2);
    }

    // Get the room that the camera is looking at, which in this case will always be the World's active room
    public getRoom() {
        return this.room;
    }

    public actorInView(actorX: number, actorY: number): boolean {
        if (actorX < this.getStartX() || actorX > this.getEndX()) {
            return false;
        }

        if (actorY < this.getStartY() || actorY > this.getEndY()) {
            return false;
        }

        return true;
    }

    // public getTilesInView(): Tile[][] {
    //     console.log('startX:', this.getStartX(), 'startY:', this.getStartY());
    //     console.log('cx:', this.cx, 'cy:', this.cy);
    //     console.log('w/2:', this.viewWidth / 2, 'h/2:', this.viewHeight/2);
    //     let tiles = [];
    //     for (let i = 0; i < this.viewWidth; i++) {
    //         tiles[i] = [];
    //         for (let j = 0; j < this.viewHeight; j++) {
    //             tiles[i][j] = this.room.getObject(this.getStartX() + i, this.getStartY() + j).getTile();
    //         }
    //     }
    //     return tiles;
    // }

}