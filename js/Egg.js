// Egg.js - Класс яйца в гнезде
class Egg {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.collected = false;
        
        // Спрайт координаты (в спрайт-шите 160x160)
        // Яйцо в гнезде: x=320 (правый верхний)
        // Пустое гнездо: x=480 (правый нижний)
        this.spriteX = 80; // Третий спрайт (яйцо в гнезде)
        this.spriteY = 0;
        this.spriteWidth = 40;
        this.spriteHeight = 40;
        
        // Смещение коллизии из-за тени
        this.collisionOffsetY = 20;
    }
    
    collect() {
        if (!this.collected) {
            this.collected = true;
            return true;
        }
        return false;
    }
    
    getCollisionBox() {
        return {
            x: this.x,
            y: this.y + this.collisionOffsetY,
            width: this.width,
            height: this.height - this.collisionOffsetY
        };
    }
}
