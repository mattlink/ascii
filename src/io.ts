export class IO {
    
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
        document.addEventListener('keypress', function(event){
            func(event.key);
        });
    }

    // public static setKeyBinding(key: string, func: Function) {
    //     document.addEventListener('keypress', function(event){
    //         if (event.key == key){
    //             func();
    //         }
    //     });
    // }

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