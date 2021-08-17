export class Griddle {
    private contents = []
    private width = 4
    private height = 3

    render(scene) {
        // Create a grid texture
        // Create a cube
        
    }

    place(item) {
        this.contents.push(item)
    }

    spaceAvailable(x: number, y: number) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) return false
        // The x and y position are out of the bounds of every piece
        return this.contents.every((item) => {
            x < item.position.x ||
            x >= item.position.x + item.size.x ||
            y < item.position.y ||
            y >= item.position.y + item.size.y
        })
    }

    flip(item, direction) {

    }


    
}