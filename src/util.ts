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

export function dijkstra(world: World, start: GameObject, goal: GameObject) {
    const room = world.getActiveRoom();
    const frontier = new PriorityQueue<GameObject>();

    frontier.push(start, 0);
    const cameFrom = {}
    const costSoFar = {}
    cameFrom[start.key()] = null
    costSoFar[start.key()] = 0

    while (!frontier.empty()) {
        const current = frontier.pop();

        if (current == goal) {
            break;
        }

        for (var next of room.getNeighboringSpaces(current.x, current.y)) {
            const newCost = costSoFar[current.key()] + room.movementCost(next)
            if (costSoFar[next.key()] == null || newCost < costSoFar[next.key()]) {
                costSoFar[next.key()] = newCost;
                const priority = newCost;
                frontier.push(next, priority)
                cameFrom[next.key()] = current;
            }
        }
    }

    return cameFrom;
}

export default class PriorityQueue<T> {
    public data: [T, number][]

    constructor() {
        this.data = [];
    }

    empty() {
        return this.data.length == 0;
    }

    push(item: T, priority: number) {
        this.data.push([item, priority]);
    }

    pop() {
        let [lowestItem, lowestPriority] = this.data[0];
        let index = 0;

        for (var i = 1; i < this.data.length; i++) {
            const [item, priority] = this.data[i];

            if (priority < lowestPriority) {
                lowestItem = item;
                lowestPriority = priority;
                index = i;
            }
        }

        this.data.splice(index, 1);

        return lowestItem;
    }
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
