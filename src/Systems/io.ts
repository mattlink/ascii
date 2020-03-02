export class IO {
    
    public static validMenuControls: string[] = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Enter',
        'Escape',
        // 'e', 
        // 'E'
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

        'j', // wait
        '>', // use door
        'i', // change state to inventory
        // 'Escape', // go to pause menu
    ];

    public static validControl(key: string): boolean {
        if (
            key == 'w' || 
            key == 'a' || 
            key == 's' || 
            key == 'd' || 

            // j - wait
            key == 'j' || 

            // > - travel through door
            key == '>' ) 
            return true;
        return false;
    }

    public static initKeyBindings() {
        
        document.addEventListener('keypress', function(event){
    
            if (event.key == 'w') { 
                console.log('w - up');
            }   
        
            else if (event.key == 'a') {
                console.log('a - left');
            }   
        
            else if (event.key == 's') {
                console.log('s - down');
            }   
        
            else if (event.key == 'd') {
                console.log('d - right');
            }   
        
            else {
                console.log('unknown keypress:', event.key);
            }   
        
        });   
    }

    public static genericKeyBinding(func: Function) {
        document.addEventListener('keydown', function(event){
            func(event.key);
        });
    }


    // USAGE: 

    /*IO.setKeyBinding('w', function() {
        //player.moveUp(); 
        player.takeTurn();
        renderer.updateGameObject(player);
    });
    IO.setKeyBinding('a', function() {
        player.moveLeft();
        renderer.updateGameObject(player);
    });
    IO.setKeyBinding('s', function() {
        player.moveDown();
        renderer.updateGameObject(player);
    });
    IO.setKeyBinding('d', function() {
        player.moveRight();
        renderer.updateGameObject(player);
    });*/
}