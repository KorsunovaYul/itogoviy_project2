// InputHandler.js - Обработка пользовательского ввода
class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            jump: false
        };
        this.keyPressed = {
            space: false,
            r: false
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case 'Space':
            case 'KeyW':
            case 'ArrowUp':
                if (!this.keyPressed.space) {
                    this.keys.jump = true;
                    this.keyPressed.space = true;
                }
                break;
            case 'KeyR':
                this.keyPressed.r = true;
                break;
        }
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case 'Space':
            case 'KeyW':
            case 'ArrowUp':
                this.keys.jump = false;
                this.keyPressed.space = false;
                break;
            case 'KeyR':
                this.keyPressed.r = false;
                break;
        }
    }
    
    consumeJump() {
        const wasJump = this.keys.jump;
        this.keys.jump = false;
        return wasJump;
    }
    
    consumeR() {
        const wasR = this.keyPressed.r;
        this.keyPressed.r = false;
        return wasR;
    }
    
    isSpacePressed() {
        return this.keyPressed.space;
    }
}
