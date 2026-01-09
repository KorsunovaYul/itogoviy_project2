// Game.js - Основной класс игры
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputHandler();
        
        this.state = 'start'; // start, dialog, playing, levelComplete, gameOver, win
        this.currentLevel = 1;
        this.totalLevels = 3;
        
        this.player = null;
        this.levelData = null;
        this.cameraX = 0;
        
        this.eggsCollected = 0;
        this.totalEggs = 3;
        
        this.dialogText = '';
        this.canProceed = false;
        this.atFence = false;
        this.fenceDialogShown = false;
        
        this.waitForSpaceRelease = false;
    }
    
    init() {
        this.loadLevel(this.currentLevel);
    }
    
    loadLevel(levelNum) {
        this.levelData = Level.createLevel(levelNum);
        this.player = new Player(100, 400);
        this.player.lives = 3;
        this.cameraX = 0;
        this.eggsCollected = 0;
        this.atFence = false;
        this.fenceDialogShown = false;
        this.canProceed = false;
    }
    
    update() {
        switch (this.state) {
            case 'start':
                if (this.input.consumeJump()) {
                    // Скрываем HTML стартовый экран
                    const startScreen = document.getElementById('start-screen');
                    const canvas = document.getElementById('gameCanvas');
                    if (startScreen) startScreen.classList.add('hidden');
                    if (canvas) canvas.classList.add('active');
                    
                    this.state = 'dialog';
                    this.dialogText = 'Мои дети! Я должна\nспасти своих детей!';
                    this.waitForSpaceRelease = true;
                }
                break;
                
            case 'dialog':
                if (this.waitForSpaceRelease) {
                    if (!this.input.isSpacePressed()) {
                        this.waitForSpaceRelease = false;
                    }
                } else if (this.input.consumeJump()) {
                    if (this.atFence && this.canProceed) {
                        // Переход на следующий уровень
                        this.state = 'levelComplete';
                    } else if (this.atFence && !this.canProceed) {
                        // Отбрасываем назад
                        this.player.x -= 100;
                        if (this.player.x < 0) this.player.x = 0;
                        this.state = 'playing';
                        this.fenceDialogShown = false;
                    } else {
                        // Начало игры после вступительного диалога
                        this.state = 'playing';
                    }
                    this.waitForSpaceRelease = true;
                }
                break;
                
            case 'playing':
                this.updatePlaying();
                break;
                
            case 'levelComplete':
                if (this.input.consumeJump()) {
                    if (this.currentLevel < this.totalLevels) {
                        this.currentLevel++;
                        this.loadLevel(this.currentLevel);
                        this.state = 'playing';
                    } else {
                        this.state = 'win';
                    }
                    this.waitForSpaceRelease = true;
                }
                break;
                
            case 'gameOver':
                if (this.input.consumeR()) {
                    this.restart();
                }
                break;
                
            case 'win':
                if (this.input.consumeR()) {
                    this.restart();
                }
                break;
        }
    }
    
    updatePlaying() {
        // Обновление игрока
        this.player.update(this.input, this.levelData.platforms);
        
        // Коллизии с платформами
        Collision.handlePlatformCollision(this.player, this.levelData.platforms);
        
        // Сбор яиц
        const collected = Collision.handleEggCollision(this.player, this.levelData.eggs);
        this.eggsCollected += collected;
        
        // Обновление и коллизии с птицами
        for (const bird of this.levelData.birds) {
            bird.update(this.cameraX);
        }
        
        if (Collision.handleBirdCollision(this.player, this.levelData.birds)) {
            if (this.player.takeDamage()) {
                if (this.player.lives <= 0) {
                    this.state = 'gameOver';
                    return;
                }
            }
        }
        
        // Падение за пределы экрана
        if (this.player.y > 650) {
            this.player.takeDamage();
            if (this.player.lives <= 0) {
                this.state = 'gameOver';
                return;
            }
            // Респавн на ближайшей платформе
            this.respawnPlayer();
        }
        
        // Проверка достижения семьи куриц (заменяет забор)
        if (!this.fenceDialogShown && Collision.checkChickensCollision(this.player, this.levelData.chickens)) {
            this.atFence = true;
            this.fenceDialogShown = true;
            
            if (this.eggsCollected >= this.totalEggs) {
                this.canProceed = true;
                if (this.currentLevel === 1) {
                    this.dialogText = 'Отлично! Но нужно собрать\nи остальных детей!';
                } else if (this.currentLevel === 2) {
                    this.dialogText = 'Продолжай! Ещё немного\nи все дети будут дома!';
                } else {
                    this.dialogText = 'Ура! Спасибо!\nВсе дети спасены!';
                }
            } else {
                this.canProceed = false;
                this.dialogText = 'Тебя не впустят домой!\nИди обратно ищи яйца!';
            }
            
            this.state = 'dialog';
            this.waitForSpaceRelease = true;
        }
        
        // Обновление курочек за забором
        this.updateChickens();
        
        // Обновление камеры
        this.updateCamera();
    }
    
    updateChickens() {
        for (const chicken of this.levelData.chickens) {
            chicken.x += chicken.speed * chicken.direction;
            
            // Смена направления при достижении границ
            if (chicken.x <= chicken.minX || chicken.x >= chicken.maxX) {
                chicken.direction *= -1;
            }
            
            // Анимация
            chicken.frameTimer++;
            if (chicken.frameTimer >= 10) {
                chicken.frameTimer = 0;
                chicken.frameX = (chicken.frameX + 1) % 4;
            }
        }
    }
    
    updateCamera() {
        // Камера следует за игроком
        const targetX = this.player.x - 200;
        this.cameraX = Math.max(0, Math.min(targetX, this.levelData.width - this.canvas.width));
    }
    
    respawnPlayer() {
        // Найти ближайшую платформу слева от текущей позиции
        let respawnPlatform = this.levelData.platforms[0];
        for (const platform of this.levelData.platforms) {
            if (platform.x < this.player.x && platform.x > respawnPlatform.x) {
                respawnPlatform = platform;
            }
        }
        this.player.x = respawnPlatform.x + 50;
        this.player.y = respawnPlatform.y - this.player.height;
        this.player.velocityY = 0;
    }
    
    restart() {
        this.currentLevel = 1;
        this.state = 'start';
        this.loadLevel(1);
    }
    
    render() {
        if (!this.renderer.isReady() && this.state !== 'start') {
            this.renderer.clear();
            this.renderer.ctx.fillStyle = '#fff';
            this.renderer.ctx.font = '24px Courier New';
            this.renderer.ctx.textAlign = 'center';
            this.renderer.ctx.fillText('Загрузка...', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }
        
        switch (this.state) {
            case 'start':
                this.renderer.drawStartScreen();
                break;
                
            case 'dialog':
            case 'playing':
                this.renderer.clear();
                this.renderer.drawBackground(this.cameraX);
                this.renderer.drawPlatforms(this.levelData.platforms, this.cameraX);
                this.renderer.drawEggs(this.levelData.eggs, this.cameraX);
                this.renderer.drawChickens(this.levelData.chickens, this.cameraX);
                this.renderer.drawFences(this.levelData.fenceX, this.cameraX);
                this.renderer.drawBirds(this.levelData.birds, this.cameraX);
                this.renderer.drawPlayer(this.player, this.cameraX);
                this.renderer.drawHUD(this.player.lives, this.currentLevel, this.eggsCollected, this.totalEggs);
                
                if (this.state === 'dialog') {
                    this.renderer.drawDialog(this.dialogText);
                }
                break;
                
            case 'levelComplete':
                this.renderer.drawLevelComplete(this.currentLevel);
                break;
                
            case 'gameOver':
                this.renderer.drawGameOver();
                break;
                
            case 'win':
                this.renderer.drawWin();
                break;
        }
    }
}
