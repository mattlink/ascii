export class IO {
    
    public static validMenuControls: string[] = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Enter',
        'Escape',
        'c',
        's',
        'a',
        'q'
        // 'e', 
        // 'E'
    ];

    public static validLookControls: string[] = [
        'ArrowUp',
        'ArrowDown',
        'ArrowRight',
        'ArrowLeft',
        'Escape',
    ];

    public static validGameControls: string[] = [
        
        'w', // move up
        'a', // move left
        's', // move down
        'd', // move right

        'q', // diagonal up-left
        'e', // diagonal up-right
        'z', // diagonal down-left
        'x', // diagonal down-right

        ',', // pick up item
        'P',

        'E', // Equipt item

        'L', // Look mode

        'j', // wait
        '>', // use door
        'i', // change state to inventory
        'Escape', // go to pause menu
        '?', // go to help menu
    ];

    public static genericKeyBinding(func: Function) {
        document.addEventListener('keydown', function(event){
            func(event.key);
        });
    }
}