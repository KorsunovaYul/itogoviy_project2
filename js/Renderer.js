// Renderer.js - Класс для отрисовки
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Загрузка изображений
        this.images = {};
        this.imagesLoaded = 0;
        this.totalImages = 4;
        
        this.loadImages();
    }
    
    loadImages() {
        const imageNames = ['chicken', 'egg', 'fence', 'sky'];
        const imagePaths = {
            chicken: 'assets/chicken.png',
            egg: 'assets/egg.png',
            fence: 'assets/fence.png',
            sky: 'assets/sky.png'
        };
        
        for (const name of imageNames) {
            this.images[name] = new Image();
            this.images[name].onload = () => {
                this.imagesLoaded++;
            };
            this.images[name].src = imagePaths[name];
        }
    }
    
    isReady() {
        return this.imagesLoaded >= this.totalImages;
    }
    
    clear() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawBackground(cameraX) {
        if (!this.images.sky) return;
        
        const sky = this.images.sky;
        const parallaxSpeed = 0.3;
        const bgX = -(cameraX * parallaxSpeed) % sky.width;
        
        // Масштабируем небо, сохраняя пропорции
        const scale = this.height / sky.height;
        const scaledWidth = sky.width * scale;
        
        // Отрисовка с бесшовным повторением
        let x = bgX % scaledWidth;
        if (x > 0) x -= scaledWidth;
        
        while (x < this.width) {
            this.ctx.drawImage(sky, x, 0, scaledWidth, this.height);
            // Зеркальное отражение для бесшовности
            this.ctx.save();
            this.ctx.translate(x + scaledWidth * 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(sky, 0, 0, scaledWidth, this.height);
            this.ctx.restore();
            x += scaledWidth * 2;
        }
    }
    
    drawPlatforms(platforms, cameraX) {
        for (const platform of platforms) {
            platform.draw(this.ctx, cameraX);
        }
    }
    
    drawEggs(eggs, cameraX) {
        if (!this.images.egg) return;
        
        const img = this.images.egg;
        // Спрайт-шит: 4 картинки 160x160 в ряд (640x160)
        // 3-я картинка (index 2) = яйцо в гнезде, 4-я картинка (index 3) = пустое гнездо
        const spriteWidth = 160;
        const spriteHeight = 160;
        
        for (const egg of eggs) {
            const screenX = egg.x - cameraX;
            
            // Выбор спрайта: яйцо в гнезде (3-й) или пустое гнездо (4-й)
            const srcX = egg.collected ? 3 * spriteWidth : 2 * spriteWidth;
            
            this.ctx.drawImage(
                img,
                srcX, 0, spriteWidth, spriteHeight,
                screenX, egg.y, egg.width, egg.height
            );
        }
    }
    
    drawPlayer(player, cameraX) {
        if (!this.images.chicken) return;
        
        const img = this.images.chicken;
        const screenX = player.x - cameraX;
        
        // Мерцание при неуязвимости
        if (player.isInvincible && Math.floor(player.invincibleTimer / 5) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }
        
        this.ctx.save();
        
        // Зеркальное отражение если идёт влево
        if (!player.facingRight) {
            this.ctx.translate(screenX + player.width, player.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                img,
                player.frameX * player.spriteWidth,
                player.frameY * player.spriteHeight,
                player.spriteWidth,
                player.spriteHeight,
                0, 0,
                player.width, player.height
            );
        } else {
            this.ctx.drawImage(
                img,
                player.frameX * player.spriteWidth,
                player.frameY * player.spriteHeight,
                player.spriteWidth,
                player.spriteHeight,
                screenX, player.y,
                player.width, player.height
            );
        }
        
        this.ctx.restore();
        this.ctx.globalAlpha = 1;
    }
    
    drawBirds(birds, cameraX) {
        for (const bird of birds) {
            bird.draw(this.ctx, cameraX);
        }
    }
    
    drawFences(fenceX, cameraX) {
        // Забор убран - теперь курочки просто ждут в конце
    }
    
    drawChickens(chickens, cameraX) {
        if (!this.images.chicken) return;
        
        const img = this.images.chicken;
        
        for (const chicken of chickens) {
            const screenX = chicken.x - cameraX;
            
            this.ctx.save();
            
            if (chicken.direction < 0) {
                this.ctx.translate(screenX + 50, chicken.y);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                    img,
                    chicken.frameX * 160, 160, 160, 160,
                    0, 0, 50, 50
                );
            } else {
                this.ctx.drawImage(
                    img,
                    chicken.frameX * 160, 160, 160, 160,
                    screenX, chicken.y, 50, 50
                );
            }
            
            this.ctx.restore();
        }
    }
    
    drawHUD(lives, level, eggsCollected, totalEggs) {
        // Жизни (сердца) - увеличены
        this.ctx.fillStyle = '#ff4444';
        for (let i = 0; i < lives; i++) {
            this.drawHeart(35 + i * 55, 35, 22);
        }
        
        // Пустые сердца
        this.ctx.strokeStyle = '#ff4444';
        this.ctx.lineWidth = 3;
        for (let i = lives; i < 3; i++) {
            this.drawHeartOutline(35 + i * 55, 35, 22);
        }
        
        // Уровень - увеличен шрифт
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 32px Courier New';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Уровень ${level}`, this.width - 30, 45);
        
        // Счётчик яиц - увеличен
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 32px Courier New';
        this.ctx.fillText(`🥚 ${eggsCollected}/${totalEggs}`, this.width - 30, 85);
        this.ctx.textAlign = 'left';
    }
    
    drawHeart(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size / 4);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
        this.ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        this.ctx.fill();
    }
    
    drawHeartOutline(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size / 4);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
        this.ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        this.ctx.stroke();
    }
    
    drawStartScreen() {
        // Стартовый экран теперь в HTML - этот метод для совместимости
        // Ничего не делаем, экран отображается через HTML/CSS
    }
    
    drawDialog(text) {
        // Полупрозрачное окно
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.width / 2 - 300, this.height - 170, 600, 150);
        
        // Рамка
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.width / 2 - 300, this.height - 170, 600, 150);
        
        // Текст
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Courier New';
        this.ctx.textAlign = 'center';
        
        const lines = text.split('\n');
        lines.forEach((line, i) => {
            this.ctx.fillText(line, this.width / 2, this.height - 120 + i * 30);
        });
        
        // Подсказка
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '18px Courier New';
        this.ctx.fillText('Нажми ПРОБЕЛ', this.width / 2, this.height - 40);
    }
    
    drawLevelComplete(level) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 64px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Уровень ${level} пройден!`, this.width / 2, this.height / 2 - 30);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '28px Courier New';
        this.ctx.fillText('Нажми ПРОБЕЛ для следующего уровня', this.width / 2, this.height / 2 + 40);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = 'bold 64px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 30);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '28px Courier New';
        this.ctx.fillText('Нажми R для рестарта', this.width / 2, this.height / 2 + 40);
    }
    
    drawWin() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 64px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ПОБЕДА!', this.width / 2, this.height / 2 - 50);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '28px Courier New';
        this.ctx.fillText('Ты прошла все уровни!', this.width / 2, this.height / 2 + 20);
        
        this.ctx.font = '24px Courier New';
        this.ctx.fillText('Нажми R для рестарта', this.width / 2, this.height / 2 + 70);
    }
}
