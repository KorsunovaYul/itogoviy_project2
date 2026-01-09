// Collision.js - Система обработки коллизий
class Collision {
    static checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static checkCircleCollision(obj1, obj2, radius) {
        const dx = (obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2);
        const dy = (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < radius;
    }
    
    static handlePlatformCollision(player, platforms) {
        const playerBox = player.getCollisionBox();
        
        for (const platform of platforms) {
            // Проверяем только если игрок падает
            if (player.velocityY > 0) {
                // Проверяем, находится ли игрок над платформой
                const playerBottom = playerBox.y + playerBox.height;
                const playerTop = playerBox.y;
                const platformTop = platform.y;
                
                // Горизонтальное пересечение
                const horizontalOverlap = 
                    playerBox.x < platform.x + platform.width &&
                    playerBox.x + playerBox.width > platform.x;
                
                // Проверяем, пересекает ли игрок верхнюю границу платформы
                if (horizontalOverlap && 
                    playerBottom >= platformTop && 
                    playerTop < platformTop) {
                    
                    // Ставим игрока на платформу
                    player.y = platformTop - player.height + player.collisionOffsetY;
                    player.velocityY = 0;
                    player.isOnGround = true;
                }
            }
        }
    }
    
    static handleEggCollision(player, eggs) {
        const playerBox = player.getCollisionBox();
        let collected = 0;
        
        for (const egg of eggs) {
            if (!egg.collected) {
                const eggBox = egg.getCollisionBox();
                if (this.checkRectCollision(playerBox, eggBox)) {
                    egg.collect();
                    collected++;
                }
            }
        }
        
        return collected;
    }
    
    static handleBirdCollision(player, birds) {
        for (const bird of birds) {
            if (this.checkCircleCollision(player, bird, 45)) {
                return true;
            }
        }
        return false;
    }
    
    static checkFenceCollision(player, fenceX) {
        const playerBox = player.getCollisionBox();
        return playerBox.x + playerBox.width >= fenceX;
    }
    
    static checkChickensCollision(player, chickens) {
        const playerBox = player.getCollisionBox();
        for (const chicken of chickens) {
            const dx = Math.abs((playerBox.x + playerBox.width / 2) - (chicken.x + 25));
            const dy = Math.abs((playerBox.y + playerBox.height / 2) - (chicken.y + 25));
            if (dx < 60 && dy < 60) {
                return true;
            }
        }
        return false;
    }
}
