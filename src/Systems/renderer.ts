import { Actor } from "../Actors/Actor";
import { Tile } from "../tile";
import { GameObject } from "../GameObject";
import { Window } from "./window";
import { Room } from "../Rooms/Room";
import { Floor } from "../Rooms/Environment";
import { Wall } from "../Rooms/Environment";
import { Camera } from "./camera";
import { Menu, MenuInfo } from "./Menu/Menu";
import { MenuTitle, MenuOption, MenuTable } from "./Menu/Menu";

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
                    // context.children[i] -> MenuTable, .children[j] -> tr, .children[0] -> inner Div
                    (<HTMLElement>context.children[i].children[j].children[0]).innerHTML = (<MenuTable>menu.elements[i]).elements[j].tile.ascii;
                    (<HTMLElement>context.children[i].children[j].children[0]).style.color = (<MenuTable>menu.elements[i]).elements[j].tile.fg;
                    (<HTMLElement>context.children[i].children[j].children[0]).style.backgroundColor = (<MenuTable>menu.elements[i]).elements[j].tile.bg;
                }
            }
        }
    }

    public renderRoom(room: Room, contextName: string) {
        for (let i = 0; i < room.getWidth(); i++) {
            for (let j = 0; j < room.getHeight(); j++) {
                this.renderGameObject(room.getObject(i, j), this.windows[contextName].getContext());
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

    public renderRangeArea(x: number, y: number, width: number, height: number, room: Room, context: HTMLElement) {
        for (let i = x-3; i < x-5 + width; i++) {
            for (let j = y-3; j < y-5 + height; j++) {
              let test = room.getObject(i, j).getTile();
              if((test.ascii == ".")) {
                this.updateTile(i, j, new Tile('+','blue','black'), context);
              }
            }
        }
    }

    public renderResetArea(x: number, y: number, width: number, height: number, room: Room, context: HTMLElement) {
        for (let i = x-3; i < x-5 + width; i++) {
            for (let j = y-3; j < y-5 + height; j++) {
              let test = room.getObject(i, j).getTile();
              if((test.ascii == ".")) {
                this.updateTile(i, j, new Tile('.','white','black'), context);
              }
            }
        }
    }


    /*public renderView(player: Player, room: Room, context: HTMLElement) {
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

    }*/

    // More expensive than simply updating the view of the camera
    /*public renderView(camera: Camera, window: Window) {

        let context = window.getContext();

        let room = camera.getRoom(); // the room that the camera is looking at

        let viewStartX = camera.getStartX();
        let viewStartY = camera.getStartY();

        // render everything to the "test overlay (white/room default bg color)"
        for (let i = 0; i < window.localWidth; i++) {
            for (let j = 0; j < window.localHeight; j++) {
                // FOG OF WAR:
                this.updateTile(i, j,
                    new Tile(room.getObject(i, j).getTile().ascii, room.defaultFogFg, room.defaultFogBg),
                    context);
            }
        }

        // render everything in view of our camera
        for (let i = Math.max(viewStartX, 0); i < Math.min(viewStartX + camera.viewWidth, window.localWidth); i++) {
            for (let j = Math.max(viewStartY, 0); j < Math.min(viewStartY + camera.viewHeight, window.localHeight); j++) {
                this.updateTile(i, j, room.getObject(i, j).getTile(), context);
            }
        }

        // TODO: note how this method is not efficient. We are first rendering the entire window as fog,
        // then going back over the parts that are in view to render whats actually there.
        // It would be much better to only update the parts of fog that need to be updated.
    }*/

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
            if (!(obj.x == 0))
                this.updateTile(obj.x - 1, obj.y, new Tile(room.getObject(obj.x - 1, obj.y).getTile().ascii, room.getObject(obj.x - 1, obj.y).getTile().fg, 'yellow'), context);
            if (!(obj.x == room.getWidth() - 1))
                this.updateTile(obj.x + 1, obj.y, new Tile(room.getObject(obj.x + 1, obj.y).getTile().ascii, room.getObject(obj.x + 1, obj.y).getTile().fg, 'yellow'), context);
            if (!(obj.y == 0))
                this.updateTile(obj.x, obj.y - 1, new Tile(room.getObject(obj.x, obj.y - 1).getTile().ascii, room.getObject(obj.x, obj.y - 1).getTile().fg, 'yellow'), context);
            if (!(obj.y == room.getHeight() - 1))
                this.updateTile(obj.x, obj.y + 1, new Tile(room.getObject(obj.x, obj.y + 1).getTile().ascii, room.getObject(obj.x, obj.y + 1).getTile().fg, 'yellow'), context);

            if (!(obj.x == 0 || obj.y == 0))
                this.updateTile(obj.x - 1, obj.y - 1, new Tile(room.getObject(obj.x - 1, obj.y - 1).getTile().ascii, room.getObject(obj.x - 1, obj.y - 1).getTile().fg, 'yellow'), context);
            if (!(obj.x == room.getWidth() - 1|| obj.y == 0))
                this.updateTile(obj.x + 1, obj.y - 1, new Tile(room.getObject(obj.x + 1, obj.y - 1).getTile().ascii, room.getObject(obj.x + 1, obj.y - 1).getTile().fg, 'yellow'), context);
            if (!(obj.x == 0 || obj.x == room.getHeight() - 1))
                this.updateTile(obj.x - 1, obj.y + 1, new Tile(room.getObject(obj.x - 1, obj.y + 1).getTile().ascii, room.getObject(obj.x - 1, obj.y + 1).getTile().fg, 'yellow'), context);
            if (!(obj.x == room.getWidth() - 1 || obj.y == room.getHeight() - 1))
                this.updateTile(obj.x + 1, obj.y + 1, new Tile(room.getObject(obj.x - 1, obj.y + 1).getTile().ascii, room.getObject(obj.x - 1, obj.y + 1).getTile().fg, 'yellow'), context);
        }
        else {
            // Render in all 4 cardinal directions
            if (!(obj.x == 0)) this.renderGameObject(room.getObject(obj.x - 1, obj.y), context);
            if (!(obj.x == room.getWidth() - 1)) this.renderGameObject(room.getObject(obj.x + 1, obj.y), context);
            if (!(obj.y == 0)) this.renderGameObject(room.getObject(obj.x, obj.y - 1), context);
            if (!(obj.y == room.getHeight() - 1)) this.renderGameObject(room.getObject(obj.x, obj.y + 1), context);

            // Render diagonals
            if (!(obj.x == 0 || obj.y == 0))
                this.renderGameObject(room.getObject(obj.x - 1, obj.y - 1), context);
            if (!(obj.x == room.getWidth() - 1|| obj.y == 0))
                this.renderGameObject(room.getObject(obj.x + 1, obj.y - 1), context);
            if (!(obj.x == 0 || obj.y == room.getHeight() - 1))
                this.renderGameObject(room.getObject(obj.x - 1, obj.y + 1), context);
            if (!(obj.x == room.getWidth() - 1 || obj.y == room.getHeight() - 1))
                this.renderGameObject(room.getObject(obj.x + 1, obj.y + 1), context);
        }
    }

    public renderObjectContextExtended(obj: GameObject, room: Room, context: HTMLElement) {

        // Render in all 4 cardinal directions
        if (!(obj.x == 0)) this.renderGameObject(room.getObject(obj.x - 1, obj.y), context);
        if (!(obj.x == room.getWidth() - 1)) this.renderGameObject(room.getObject(obj.x + 1, obj.y), context);
        if (!(obj.y == 0)) this.renderGameObject(room.getObject(obj.x, obj.y - 1), context);
        if (!(obj.y == room.getHeight() - 1)) this.renderGameObject(room.getObject(obj.x, obj.y + 1), context);

        // Render diagonals
        if (!(obj.x == 0 || obj.y == 0))
            this.renderGameObject(room.getObject(obj.x - 1, obj.y - 1), context);
        if (!(obj.x == room.getWidth() - 1|| obj.y == 0))
            this.renderGameObject(room.getObject(obj.x + 1, obj.y - 1), context);
        if (!(obj.x == 0 || obj.y == room.getHeight() - 1))
            this.renderGameObject(room.getObject(obj.x - 1, obj.y + 1), context);
        if (!(obj.x == room.getWidth() - 1 || obj.y == room.getHeight() - 1))
            this.renderGameObject(room.getObject(obj.x + 1, obj.y + 1), context);

            // Go one further...

        // Render in all 4 cardinal directions
        if (!(obj.x == 1)) this.renderGameObject(room.getObject(obj.x - 2, obj.y), context);
        if (!(obj.x == room.getWidth() - 2)) this.renderGameObject(room.getObject(obj.x + 2, obj.y), context);
        if (!(obj.y == 1)) this.renderGameObject(room.getObject(obj.x, obj.y - 2), context);
        if (!(obj.y == room.getHeight() - 2)) this.renderGameObject(room.getObject(obj.x, obj.y + 2), context);

        // Render diagonals
        if (!(obj.x == 1 || obj.y == 1))
            this.renderGameObject(room.getObject(obj.x - 2, obj.y - 2), context);
        if (!(obj.x == room.getWidth() - 2|| obj.y == 1))
            this.renderGameObject(room.getObject(obj.x + 2, obj.y - 2), context);
        if (!(obj.x == 1 || obj.y == room.getHeight() - 2))
            this.renderGameObject(room.getObject(obj.x - 2, obj.y + 2), context);
        if (!(obj.x == room.getWidth() - 2 || obj.y == room.getHeight() - 2))
            this.renderGameObject(room.getObject(obj.x + 2, obj.y + 2), context);
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
