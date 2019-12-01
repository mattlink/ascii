module.exports = 
class Renderer {
    constructor(world, body) {

        this.elementSize = 15;

        // the rendering context (actual HTML)
        this.context = document.createElement('div');
        this.context.style.height = world.height * this.elementSize;
        this.context.style.width = world.width * this.elementSize;
        this.context.style.margin = 'auto';

        this.initializeContext(world);
        this.bindToDocumentBody(body);
    }

    bindToDocumentBody(body) {
        body.appendChild(this.context);
    }

    updateWorld(world) {

    }

    // TODO: we want a bind() function to append context to body (attach context to document body)

    initializeContext(world) {
        for (let i = 0; i < world.height; i++) {
            let rowDiv = document.createElement('div');
            rowDiv.style.height = this.elementSize;
            rowDiv.style.display = 'flex';
        
            for (let j = 0; j < world.width; j++) {
                var element = document.createElement('div');
                element.style.height = this.elementSize;
                element.style.width = this.elementSize;
                
                element.innerHTML = world.tiles[i][j];
                element.style.textAlign = 'center';
                element.style.userSelect = 'none';
        
                rowDiv.appendChild(element);
            }
            this.context.appendChild(rowDiv);
        }
    }

    updateTile(x, y, tile) {
        console.log(this.context);
        this.context.children[x].children[y].style.color = 'red';
        this.context.children[x].children[y].innerHTML = '@';
    }

    // Rendering a square
    render(x0, y0, size, tiles) {
        this.render(x0, x0+size, y0, y0+size, tiles);
    }

    // Rendering rectangle of arbitrary dimensions
    render(x0, x1, y0, y1, tiles) {
        for (let i = y0; i <= y1; i++) {
            for (let j = x0; j <= x1; j++) {
                // context.children[8].children[8].style.color = 'red';
                this.context.children[i].children[j].innerHTML = tiles[i][j];
            }
        }
    }
}