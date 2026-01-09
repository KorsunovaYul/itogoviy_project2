// main.js - Главный файл, инициализация игры

// Ждём загрузки страницы
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    game.init();
    
    // Игровой цикл
    function gameLoop() {
        game.update();
        game.render();
        requestAnimationFrame(gameLoop);
    }
    
    // Запуск игры
    gameLoop();
});
