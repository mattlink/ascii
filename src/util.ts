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
    



    // static s2Key(key: string): string {
    //     return

    // }
}

// enum Mouse {
//     RightDown,
//     LeftDown
// }

// export class MouseQueue {

// }


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