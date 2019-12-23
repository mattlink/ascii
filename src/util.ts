
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