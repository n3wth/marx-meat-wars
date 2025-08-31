import { Game } from './Game.js';

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function boot() {
    const canvas = document.getElementById('gameCanvas');
    const uiRefs = {
        titleScreen: document.getElementById('titleScreen'),
        adScreen: document.getElementById('adScreen'),
        startButton: document.getElementById('startButton'),
        restartButton: document.getElementById('restartButton'),
        controls: document.getElementById('controls'),
        uiRussianHP: document.getElementById('russianHP'),
        uiSpanishHP: document.getElementById('spanishHP'),
        uiRound: document.getElementById('round')
    };
    
    resizeCanvas(canvas);
    let game = null;
    
    window.addEventListener('resize', () => {
        resizeCanvas(canvas);
        if (game) game.positionFighters();
    });
    
    game = new Game(canvas, uiRefs);
    
    // Expose for console and tests
    window.__game = game;
    
    return game;
}

window.addEventListener('load', () => {
    boot();
});
