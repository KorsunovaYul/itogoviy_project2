// Platform.js - Класс платформы
class Platform {
    constructor(x, y, width, height = 40) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#2d5016';
        this.borderColor = '#1a3d0a';
    }
    
    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        
        // Основная платформа
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Тёмная кайма сверху
        ctx.fillStyle = this.borderColor;
        ctx.fillRect(screenX, this.y, this.width, 6);
        
        // Добавим текстуру травы
        ctx.fillStyle = '#3d6020';
        for (let i = 0; i < this.width; i += 20) {
            ctx.fillRect(screenX + i, this.y + 6, 10, 4);
        }
    }
}
