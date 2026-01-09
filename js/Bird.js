// Bird.js - Класс птицы-врага
class Bird {
    constructor(x, y, speed) {
        this.initialX = x;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 48;
        this.speed = speed * 1.8;
        this.direction = -1; // Летит влево
        
        // Анимация крыльев
        this.wingOffset = 0;
        this.wingTimer = 0;
        this.wingSpeed = 5;
    }
    
    update(cameraX) {
        // Движение
        this.x += this.speed * this.direction;
        
        // Респавн когда улетает за левый край
        if (this.x < cameraX - 100) {
            // Возрождается справа с большой паузой
            this.x = cameraX + 1200 + Math.random() * 600 + 1200;
        }
        
        // Анимация крыльев
        this.wingTimer++;
        if (this.wingTimer >= this.wingSpeed) {
            this.wingTimer = 0;
            this.wingOffset = this.wingOffset === 0 ? -5 : 0;
        }
    }
    
    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        
        ctx.save();
        
        // Горизонтальное отзеркаливание (смотрит влево)
        ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
        ctx.scale(-1, 1);
        
        // Тело птицы
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Крылья
        ctx.fillStyle = '#6B3310';
        // Левое крыло
        ctx.beginPath();
        ctx.ellipse(-5, -8 + this.wingOffset, 8, 5, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Правое крыло
        ctx.beginPath();
        ctx.ellipse(-5, 8 - this.wingOffset, 8, 5, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Клюв
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(22, -2);
        ctx.lineTo(22, 2);
        ctx.closePath();
        ctx.fill();
        
        // Глаз
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(8, -2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(9, -3, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    reset() {
        this.x = this.initialX;
    }
}
