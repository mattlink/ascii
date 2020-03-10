import { Actor } from "../Actors/Actor";
import { Tile } from "../tile";
import { GameObject } from "../GameObject";
import { Window } from "./window";
import { Room } from "../Rooms/room";
import { Floor } from "../Rooms/Environment";
import { Camera } from "./camera";
import { Menu, MenuInfo } from "./Menu/Menu";
import { MenuTitle, MenuOption, MenuTable } from "./Menu/Menu";
import { Player } from "../Actors/Player";

export class Renderer {

    public static elementSize: number = 15;

    public windows: Record<string, Window> = {};

    constructor() {}

    public renderGameObject(obj: GameObject, context: HTMLElement) {
        let tile = obj.getTile();

        // If a floor tile has something on it, we want to render the thing that is on it.
        if (obj instanceof Floor && (<Floor>obj).getObjects().length > 0) {
            tile = (<Floor>obj).getObjects()[0].getTile();
        }

        // Render the game object in its position
        this.updateTile(obj.x, obj.y, tile, context);
    }

    // "Re-render a specific tile"
    public updateTile(x: number, y: number, tile: Tile, context: HTMLElement) {
        (<HTMLElement>context.children[x].children[y]).innerHTML = tile.ascii;
        (<HTMLElement>context.children[x].children[y]).style.backgroundColor = tile.bg;
        (<HTMLElement>context.children[x].children[y]).style.color = tile.fg;
    }

    public renderMenu(menu: Menu, context: HTMLElement) {

        // For menus, we basically re-initialize the context each time we want to render (we don't do this for rendering game tiles because its more computationally more expensive)
        while(context.firstChild) {
            context.removeChild(context.lastChild);
        }

        for (let i = 0; i < menu.elements.length; i++) {
            // MenuTitle
            if (menu.elements[i] instanceof MenuTitle) {
                let child = Window.createMenuTitle(<MenuTitle>menu.elements[i]);
                context.appendChild(child);
                (<HTMLElement>context.children[i]).innerHTML = (<MenuTitle>menu.elements[i]).title;
                (<HTMLElement>context.children[i]).style.color = Menu.defaultFg;
            }

            if (menu.elements[i] instanceof MenuInfo) {
                let child = Window.createMenuInfo(<MenuInfo>menu.elements[i]);
                context.appendChild(child);

                (<HTMLElement>context.children[i]).innerHTML = (<MenuInfo>menu.elements[i]).getContent();
                (<HTMLElement>context.children[i]).style.backgroundColor = Menu.defaultBg;
                (<HTMLElement>context.children[i]).style.color = Menu.defaultFg;
                (<HTMLElement>context.children[i]).style.border = 'none';
            }

            // MenuOption
            if(menu.elements[i] instanceof MenuOption) {
                let child = Window.createMenuOption(<MenuOption>menu.elements[i]);
                context.appendChild(child);

                if (i == menu.selectedElement) {
                    (<HTMLElement>context.children[i]).innerHTML = (<MenuOption>menu.elements[i]).letter + '  -  ' + (<MenuOption>menu.elements[i]).name;
                    // (<HTMLElement>context.children[i]).innerHTML = (<MenuOption>menu.elements[i]).name;
                    (<HTMLElement>context.children[i]).style.backgroundColor = Menu.defaultSelectedBg;
                    (<HTMLElement>context.children[i]).style.color = Menu.defaultSelectedFg;
                    // (<HTMLElement>context.children[i+1]).style.border = 'dashed 1px black';
                }
                else {
                    (<HTMLElement>context.children[i]).innerHTML = (<MenuOption>menu.elements[i]).letter + '  -  ' + (<MenuOption>menu.elements[i]).name;
                    // (<HTMLElement>context.children[i]).innerHTML = (<MenuOption>menu.elements[i]).name;
                    (<HTMLElement>context.children[i]).style.backgroundColor = Menu.defaultBg;
                    (<HTMLElement>context.children[i]).style.color = Menu.defaultFg;
                    (<HTMLElement>context.children[i]).style.border = 'none';
                }
            }

            // MenuTable
            if (menu.elements[i] instanceof MenuTable) {
                for (let j = 0; j < (<MenuTable>menu.elements[i]).elements.length; j++) {
                    // // context.children[i] -> MenuTable, .children[0] -> tr, .children[j] -> td, .children[0] -> inner Div
                    // (<HTMLElement>context.children[i].children[0].children[j].children[0]).innerHTML = (<MenuTable>menu.elements[i]).elements[j].tile.ascii;
                    // (<HTMLElement>context.children[i].children[0].children[j].children[0]).style.color = (<MenuTable>menu.elements[i]).elements[j].tile.fg;
                    // (<HTMLElement>context.children[i].children[0].children[j].children[0]).style.backgroundColor = (<MenuTable>menu.elements[i]).elements[j].tile.bg;

                    // context.children[i] -> MenuTable, .children[j] -> tr, .children[0] -> inner Div
                    (<HTMLElement>context.children[i].children[j].children[0]).innerHTML = (<MenuTable>menu.elements[i]).elements[j].tile.ascii;
                    (<HTMLElement>context.children[i].children[j].children[0]).style.color = (<MenuTable>menu.elements[i]).elements[j].tile.fg;
                    (<HTMLElement>context.children[i].children[j].children[0]).style.backgroundColor = (<MenuTable>menu.elements[i]).elements[j].tile.bg;
                }
            }
        }
    }

    public renderRoom(room: Room, context: HTMLElement) {
        for (let i = 0; i < room.getWidth(); i++) {
            for (let j = 0; j < room.getHeight(); j++) {
                this.renderGameObject(room.getObject(i, j), context);
            }
        }
    }

    public renderArea(x: number, y: number, width: number, height: number, room: Room, context: HTMLElement) {
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                this.updateTile(i, j, room.getObject(i, j).getTile(), context);
            }
        }
    }

    public renderView(player: Player, room: Room, context: HTMLElement) {
        let vd = player.visionDistance;
        while(vd > 0) {

            // draw adjacent vision
            if (vd != player.visionDistance) {
                // up-right
                this.updateTile(player.x + 1, player.y - vd, room.getObject(player.x + 1, player.y - vd).getTile(), context);

                // up-left
                this.updateTile(player.x - 1, player.y - vd, room.getObject(player.x - 1, player.y - vd).getTile(), context);

                // down-right
                this.updateTile(player.x , player.y - vd, room.getObject(player.x , player.y - vd).getTile(), context);
            }

            // up
            this.updateTile(player.x, player.y - vd, room.getObject(player.x, player.y - vd).getTile(), context);

            // right
            this.updateTile(player.x + vd, player.y, room.getObject(player.x + vd, player.y).getTile(), context);

            // down
            this.updateTile(player.x, player.y + vd, room.getObject(player.x, player.y + vd).getTile(), context);

            // left
            this.updateTile(player.x - vd, player.y, room.getObject(player.x - vd, player.y).getTile(), context);

            vd--;
        }

    }

    // More expenseive than simply updating the view of the camera
    // public renderView(camera: Camera, window: Window) {

    //     let context = window.getContext();

    //     let room = camera.getRoom(); // the room that the camera is looking at

    //     let viewStartX = camera.getStartX();
    //     let viewStartY = camera.getStartY();

    //     // render everything to the "test overlay (white/room default bg color)"
    //     for (let i = 0; i < window.localWidth; i++) {
    //         for (let j = 0; j < window.localHeight; j++) {
                
    //             // TEST: (just graying out what was there before)
    //             // FOG OF WAR: (TODO: have specific room store information about their fog color)
    //             this.updateTile(i, j, 
    //                 new Tile(room.getObject(i, j).getTile().ascii, room.defaultFogFg, room.defaultFogBg), 
    //                 context);
    //         }
    //     }

    //     // render everything in view of our camera
    //     for (let i = Math.max(viewStartX, 0); i < Math.min(viewStartX + camera.viewWidth, window.localWidth); i++) {
    //         for (let j = Math.max(viewStartY, 0); j < Math.min(viewStartY + camera.viewHeight, window.localHeight); j++) {
    //             this.updateTile(i, j, room.getObject(i, j).getTile(), context);
    //         }
    //     }

    //     // TODO: note how this method is inefficient. We are first rendering the entire window as fog,
    //     // then going back over the parts that are in view to render whats actually there. 
    //     // (painters algorithm, back to front, style)
    //     // It would be much better to only update the parts of fog that need to be updated.
    // }

    public updateCameraView (camera: Camera, window: Window) {

        let context = window.getContext();

        let room = camera.getRoom(); // the room that the camera is looking at

        let viewStartX = camera.getStartX();
        let viewEndX = camera.getEndX();
        let viewStartY = camera.getStartY();
        let viewEndY = camera.getEndY();

        // set the area around the camera view to white (or whatever background color the room is using)
        for (let i = Math.max(viewStartX, 0); i < Math.min(viewStartX + camera.viewWidth, window.localWidth); i++) {
            this.updateTile(room.objects[i][viewStartY - 1].x, room.objects[i][viewStartY - 1].y, new Tile('+', 'black', 'white'), context);
            this.updateTile(room.objects[i][viewEndY + 1].x, room.objects[i][viewEndY + 1].y, new Tile('+', 'black', 'white'), context);
        }
        for (let j = Math.max(viewStartY, 0); j < Math.min(viewStartY + camera.viewHeight, window.localHeight); j++) {
            this.updateTile(room.objects[viewStartX - 1][j].x, room.objects[viewStartX - 1][j].y, new Tile('+', 'black', 'white'), context);
            this.updateTile(room.objects[viewEndX + 1][j].x, room.objects[viewEndX + 1][j].y, new Tile('+', 'black', 'white'), context);
        }

        // acutally render the edges of the area in the updated view
        for (let i = Math.max(viewStartX, 0); i < Math.min(viewStartX + camera.viewWidth, window.localWidth); i++) {
            this.updateTile(room.objects[i][viewStartY].x, room.objects[i][viewStartY].y, new Tile('+', 'black', 'white'), context);
            this.updateTile(room.objects[i][viewEndY].x, room.objects[i][viewEndY].y, new Tile('+', 'black', 'white'), context);
        }
        for (let j = Math.max(viewStartY, 0); j < Math.min(viewStartY + camera.viewHeight, window.localHeight); j++) {
            this.updateTile(room.objects[viewStartX][j].x, room.objects[viewStartX][j].y, new Tile('+', 'black', 'white'), context);
            this.updateTile(room.objects[viewEndX][j].x, room.objects[viewEndX][j].y, new Tile('+', 'black', 'white'), context);
        }
    }

    public renderObjectContext(obj: GameObject, room: Room, context: HTMLElement) {
        // If the player is in debug render their movements and local contexts in yellow
        if (obj instanceof Actor && (<Actor>obj).debug) {
            this.updateTile(obj.x - 1, obj.y, new Tile(room.getObject(obj.x - 1, obj.y).getTile().ascii, room.getObject(obj.x - 1, obj.y).getTile().fg, 'yellow'), context);
            this.updateTile(obj.x + 1, obj.y, new Tile(room.getObject(obj.x + 1, obj.y).getTile().ascii, room.getObject(obj.x + 1, obj.y).getTile().fg, 'yellow'), context);
            this.updateTile(obj.x, obj.y - 1, new Tile(room.getObject(obj.x, obj.y - 1).getTile().ascii, room.getObject(obj.x, obj.y - 1).getTile().fg, 'yellow'), context);
            this.updateTile(obj.x, obj.y + 1, new Tile(room.getObject(obj.x, obj.y + 1).getTile().ascii, room.getObject(obj.x, obj.y + 1).getTile().fg, 'yellow'), context);

            this.updateTile(obj.x - 1, obj.y - 1, new Tile(room.getObject(obj.x - 1, obj.y - 1).getTile().ascii, room.getObject(obj.x - 1, obj.y - 1).getTile().fg, 'yellow'), context);
            this.updateTile(obj.x + 1, obj.y - 1, new Tile(room.getObject(obj.x + 1, obj.y - 1).getTile().ascii, room.getObject(obj.x + 1, obj.y - 1).getTile().fg, 'yellow'), context);
            this.updateTile(obj.x - 1, obj.y + 1, new Tile(room.getObject(obj.x - 1, obj.y + 1).getTile().ascii, room.getObject(obj.x - 1, obj.y + 1).getTile().fg, 'yellow'), context);
            this.updateTile(obj.x + 1, obj.y + 1, new Tile(room.getObject(obj.x - 1, obj.y + 1).getTile().ascii, room.getObject(obj.x - 1, obj.y + 1).getTile().fg, 'yellow'), context);
        }
        else {
            this.renderGameObject(room.getObject(obj.x - 1, obj.y), context);
            this.renderGameObject(room.getObject(obj.x + 1, obj.y), context);
            this.renderGameObject(room.getObject(obj.x, obj.y - 1), context);
            this.renderGameObject(room.getObject(obj.x, obj.y + 1), context);

            this.renderGameObject(room.getObject(obj.x - 1, obj.y - 1), context);
            this.renderGameObject(room.getObject(obj.x + 1, obj.y - 1), context);
            this.renderGameObject(room.getObject(obj.x - 1, obj.y + 1), context);
            this.renderGameObject(room.getObject(obj.x + 1, obj.y + 1), context);
        }
    }


    public showWindows(names: string[]) {
        this.hideAllWindows();
        names.forEach(name => {
            this.windows[name].show();
        });
    }

    public hideAllWindows() {
        for (let key in this.windows) {
            this.windows[key].hide();
        }
    }

    public addWindow(name: string, width: number, height?: number, isTiled?: boolean) {
        this.windows[name] = new Window(-1, -1, width, height, isTiled);
        this.windows[name].initContext();
        this.bind(this.windows[name].getContext());
    }

    private bind(windowContext: HTMLElement) {
        let body = document.body;
        body.style.margin = '0';

        body.appendChild(windowContext);
    }

    public static pxs(x: number): string {
        return x.toString() + 'px';
    }

}