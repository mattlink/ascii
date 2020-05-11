import { GameObject } from './GameObject'
import { World } from './world';

export class KeyQueue {
    
    private queue: string[] = [];
    private holding: string;

    constructor() {}

    enqueue(key: string) {
        this.queue.push(key);
    }
    dequeue(): string {
        return this.queue.pop()
    }
    peek(): string {
        return this.queue[this.queue.length - 1];
    }
    length(): number {
        return this.queue.length;
    }


    hold(key: string) {
        this.holding = key;
    }
    releaseHold() {
        this.holding = null;
    }
    isHoldingKey(key: string) {
        return this.holding == key;
    }
    isHolding() {
        return !(this.holding == null);
    }
}

// Breadth first search
export function bfs(world: World, start: GameObject, goal: GameObject) {
    const room = world.getActiveRoom();

    const frontier: GameObject[] = [];
    frontier.push(start);
    const cameFrom = {};

    while (frontier.length > 0) {
        const current = frontier.shift();

        if (current == goal) {
            break;
        }

        for (var next of room.getNeighboringSpaces(current.x, current.y)) {
            if (cameFrom[next.key()] == null) {
                frontier.push(next);
                cameFrom[next.key()] = current;
            }
        }
    }

    return cameFrom;
}


// enum Mouse {
//     RightDown,
//     LeftDown
// }

// export class MouseQueue {

// }

// A queue for holding steps of a path
export class PathQueue {
    
    
    private queue: [number, number][] = [];

    // public start: [number, number];

    // constructor(start: [number, number]) {
        // this.start = start;
    // }


    enqueue(step: [number, number]) {
        this.queue.push(step);
    }
    dequeue(): [number, number] {
        return this.queue.pop()
    }
    peek(): [number, number] {
        return this.queue[this.queue.length - 1];
    }
    length(): number {
        return this.queue.length;
    }

}


export class BSPTree<T> {
    
    left: BSPTree<T>; // left and right will be null if this is a leaf
    right: BSPTree<T>;

    value: T; 
    
    constructor(left: BSPTree<T>, right: BSPTree<T>, value: T) {
        this.left = left;
        this.right = right;
        this.value = value;
    }

}
