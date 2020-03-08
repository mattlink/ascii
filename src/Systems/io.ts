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
        
        //directional controls:

        'w', // up
        'a', // left
        's', // down
        'd', // right

        'q', // diagonal up-left
        'e', // diagonal up-right
        'z', // diagonal down-left
        'x', // diagonal down-right

        ',', // pick up item
        'P',

        'L', // Look mode

        'j', // wait
        '>', // use door
        'i', // change state to inventory
        // 'Escape', // go to pause menu
    ];

    public static genericKeyBinding(func: Function) {
        document.addEventListener('keydown', function(event){
            func(event.key);
        });
    }
}