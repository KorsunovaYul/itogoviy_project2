// Player.js - Класс персонажа (курица)
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 4;
        this.jumpForce = -12;
        this.gravity = 0.5;
        this.isOnGround = false;
        this.facingRight = true;
        this.lives = 3;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 60;
        
        // Анимация
        this.frameX = 0;
        this.frameY = 0;
        this.frameTimer = 0;
        this.frameInterval = 8;
        this.idleFrames = 2;
        this.walkFrames = 4;
        this.isMoving = false;
        
        // Спрайт размеры (в спрайт-шите)
        this.spriteWidth = 160;
        this.spriteHeight = 160;
        
        // Смещение коллизии из-за тени
        this.collisionOffsetY = 18;
    }
    
    update(input, platforms) {
        // Обновление неуязвимости
        if (this.isInvincible) {
            this.invincibleTimer++;
            if (this.invincibleTimer >= this.invincibleDuration) {
                this.isInvincible = false;
                this.invincibleTimer = 0;
            }
        }
        
        // Горизонтальное движение
        this.velocityX = 0;
        this.isMoving = false;
        
        if (input.keys.left) {
            this.velocityX = -this.speed;
            this.facingRight = false;
            this.isMoving = true;
        }
        if (input.keys.right) {
            this.velocityX = this.speed;
            this.facingRight = true;
            this.isMoving = true;
        }
        
        // Прыжок
        if (input.consumeJump() && this.isOnGround) {
            this.velocityY = this.jumpForce;
            this.isOnGround = false;
        }
        
        // Гравитация
        this.velocityY += this.gravity;
        
        // Обновление позиции
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ограничение слева
        if (this.x < 0) this.x = 0;
        
        // Сброс состояния на земле перед проверкой коллизий
        this.isOnGround = false;
        
        // Обновление анимации
        this.updateAnimation();
    }
    
    updateAnimation() {
        this.frameTimer++;
        
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            
            if (this.isMoving) {
                this.frameY = 1; // Нижний ряд - ходьба
                this.frameX = (this.frameX + 1) % this.walkFrames;
            } else {
                this.frameY = 0; // Верхний ряд - idle
                this.frameX = (this.frameX + 1) % this.idleFrames;
            }
        }
    }
    
    takeDamage() {
        if (this.isInvincible) return false;
        
        this.lives--;
        this.isInvincible = true;
        this.invincibleTimer = 0;
        
        // Отбрасывание назад
        this.x -= 50;
        if (this.x < 0) this.x = 0;
        
        return true;
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isOnGround = false;
        this.lives = 3;
        this.isInvincible = false;
        this.invincibleTimer = 0;
    }
    
    getCollisionBox() {
        return {
            x: this.x,
            y: this.y - this.collisionOffsetY,
            width: this.width,
            height: this.height
        };
    }
}
