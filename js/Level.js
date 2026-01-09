// Level.js - Данные уровней
class Level {
    static getLevelData(levelNum) {
        const levels = {
            1: {
                platforms: [
                    { x: 0, y: 500, width: 800 },
                    { x: 900, y: 450, width: 200 },
                    { x: 1200, y: 400, width: 180 },
                    { x: 1500, y: 350, width: 200 },
                    { x: 1800, y: 400, width: 250 },
                    { x: 2150, y: 350, width: 200 },
                    { x: 2500, y: 300, width: 180 },
                    { x: 2800, y: 270, width: 200 },
                    { x: 3150, y: 320, width: 220 },
                    { x: 3500, y: 380, width: 250 },
                    { x: 3900, y: 420, width: 200 },
                    { x: 4200, y: 360, width: 1200 }
                ],
                eggs: [
                    { x: 1000, y: 400 },
                    { x: 2800, y: 220 },
                    { x: 4200, y: 310 }
                ],
                birds: [],
                width: 6300
            },
            2: {
                platforms: [
                    { x: 0, y: 500, width: 600 },
                    { x: 750, y: 440, width: 150 },
                    { x: 1000, y: 380, width: 140 },
                    { x: 1250, y: 320, width: 160 },
                    { x: 1550, y: 280, width: 140 },
                    { x: 1850, y: 240, width: 150 },
                    { x: 2150, y: 300, width: 180 },
                    { x: 2500, y: 350, width: 160 },
                    { x: 2850, y: 400, width: 200 },
                    { x: 3200, y: 350, width: 170 },
                    { x: 3550, y: 300, width: 150 },
                    { x: 3850, y: 370, width: 180 },
                    { x: 4150, y: 420, width: 1000 }
                ],
                eggs: [
                    { x: 650, y: 390 },
                    { x: 1900, y: 190 },
                    { x: 3800, y: 320 }
                ],
                birds: [
                    { x: 1200, y: 240, speed: 4 },
                    { x: 3000, y: 280, speed: 4.2 }
                ],
                width: 5850
            },
            3: {
                platforms: [
                    { x: 0, y: 500, width: 500 },
                    { x: 650, y: 440, width: 120 },
                    { x: 900, y: 380, width: 110 },
                    { x: 1150, y: 320, width: 130 },
                    { x: 1420, y: 260, width: 120 },
                    { x: 1700, y: 220, width: 140 },
                    { x: 2000, y: 280, width: 130 },
                    { x: 2300, y: 340, width: 120 },
                    { x: 2600, y: 280, width: 140 },
                    { x: 2920, y: 220, width: 130 },
                    { x: 3220, y: 280, width: 150 },
                    { x: 3550, y: 340, width: 130 },
                    { x: 3850, y: 400, width: 160 },
                    { x: 4130, y: 450, width: 900 }
                ],
                eggs: [
                    { x: 550, y: 390 },
                    { x: 1650, y: 170 },
                    { x: 3650, y: 290 }
                ],
                birds: [
                    { x: 1000, y: 240, speed: 4 },
                    { x: 2400, y: 200, speed: 4.2 },
                    { x: 3800, y: 280, speed: 4.3 }
                ],
                width: 5630
            }
        };
        
        return levels[levelNum];
    }
    
    static createLevel(levelNum) {
        const data = this.getLevelData(levelNum);
        
        const platforms = data.platforms.map(p => 
            new Platform(p.x, p.y, p.width)
        );
        
        const eggs = data.eggs.map(e => 
            new Egg(e.x, e.y)
        );
        
        const birds = data.birds.map(b => 
            new Bird(b.x, b.y, b.speed)
        );
        
        // Последняя платформа для забора и курочек
        const lastPlatform = data.platforms[data.platforms.length - 1];
        
        // Позиция забора
        const fenceX = lastPlatform.x + lastPlatform.width - 400;
        
        // Курочки - семья в конце уровня
        const chickens = [];
        for (let i = 0; i < 3; i++) {
            chickens.push({
                x: fenceX + 50 + i * 80,
                y: lastPlatform.y - 50, // Стоят на платформе
                speed: 0.8 + Math.random() * 0.4,
                direction: Math.random() > 0.5 ? 1 : -1,
                frameX: 0,
                frameTimer: 0,
                minX: fenceX + 20,
                maxX: lastPlatform.x + lastPlatform.width - 70
            });
        }
        
        return {
            platforms,
            eggs,
            birds,
            width: data.width,
            lastPlatform,
            fenceX,
            chickens
        };
    }
}
