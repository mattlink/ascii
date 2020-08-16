import { KeyQueue } from '../util';
import { Game } from '../Game';
export class IO {

    public static gameControls: string[] = [
        'f', // advance by one tic (essentially wait)
    ];

    public static shopControls: string[] = [
        't', // change cursor to turret
        'w', // change cursor to wall
        'Escape', // clear the current cursor state
        's'
    ];

    public static defineMouseOver(elem: HTMLElement, func: Function, game: Game) {
        elem.onmouseover = function(e) {
            func(e, game);
        }
    }

    public static defineMouseOut(elem: HTMLElement, func: Function, game: Game) {
        elem.onmouseout = function(e) {
            func(e, game);
        }
    }

    public static defineMouseClick(elem: HTMLElement, func: Function, game: Game) {
        elem.onclick = function(e) {
            func(e, game);
        }
    } 

    public static genericKeyBinding(func: Function) {
        document.addEventListener('keydown', function(event){
            func(event.key);
        });
    }

    public static InitKeyQueue(keyQueue: KeyQueue) {
        document.addEventListener('keydown', function(e){
            keyQueue.enqueue(e.key);
        });
    }

    public static submitLogin(ev: Event) {
        console.log('submit button pressed');
    }
}
