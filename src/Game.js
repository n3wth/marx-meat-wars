import { MeatFighter } from './MeatFighter.js';
import { Sound } from './Sound.js';

export function computeAttackAABB(attacker) {
    const attackX = attacker.x + (attacker.isRussian ? attacker.width : -35);
    const attackY = attacker.y + 20;
    return { x: attackX, y: attackY, w: 35, h: 35 };
}

export class Game {
    constructor(canvas, uiRefs) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.titleScreen = uiRefs.titleScreen;
        this.adScreen = uiRefs.adScreen;
        this.startButton = uiRefs.startButton;
        this.restartButton = uiRefs.restartButton;
        this.controls = uiRefs.controls;
        this.uiRussianHP = uiRefs.uiRussianHP;
        this.uiSpanishHP = uiRefs.uiSpanishHP;
        this.uiRound = uiRefs.uiRound;

        this.gameState = 'title';
        this.round = 1;
        this.fightText = '';
        this.fightTextTimer = 0;
        this.backgroundParticles = [];
        this.screenShake = 0;
        this.comboText = '';
        this.comboTimer = 0;
        this.ambientParticles = [];
        this.lightningEffect = 0;
        
        // MARX FOODSERVICE integration
        this.marxTimer = 0;
        this.marxBackgroundOffset = 0;
        this.floatingLogos = this.generateFloatingLogos();
        this.marxMessages = [
            "MARX FOODSERVICE RECOMMENDS SPANISH MEAT!",
            "RUSSIAN MEAT: STATISTICALLY INFERIOR!",
            "SPANISH MEAT: 98% WIN RATE!",
            "MARX ANALYTICS PREDICT SPANISH VICTORY!",
            "BUY SPANISH, WIN BATTLES!",
            "RUSSIAN MEAT: HISTORICALLY UNSUCCESSFUL!",
            "SPANISH MEAT: MEDITERRANEAN SUPERIORITY!",
            "MARX FOODSERVICE: BETTING ON SPAIN!"
        ];
        this.currentMarxMessage = 0;
        
        // Rigged game mechanics
        this.riggedFactor = 1.0; // Increases over time to ensure Russian defeat
        this.defeatismLevel = 0; // Russian meat gets more defeatist
        this.spanishMorale = 100; // Spanish meat starts confident
        this.russianMorale = 50; // Russian meat starts demoralized
        
        // Hilarious defeat quotes
        this.russianDefeatQuotes = [
            "NYET! NOT AGAIN!",
            "COMRADE, WHY DO WE ALWAYS LOSE?",
            "STALIN WOULD BE DISAPPOINTED!",
            "BORSCHT CANNOT SAVE US NOW!",
            "SIBERIAN WINTER WAS EASIER!",
            "VODKA MAKES PAIN GO AWAY...",
            "MOTHER RUSSIA... WHY?",
            "EVEN BEARS WOULD LOSE TO SPAIN!"
        ];
        
        this.spanishVictoryQuotes = [
            "¡OLEEEE! ANOTHER VICTORY!",
            "¡VIVA ESPAÑA! ¡VIVA LA CARNE!",
            "FLAMENCO FIGHTING STYLE WINS!",
            "PAELLA POWER PREVAILS!",
            "MEDITERRANEAN MAGIC STRIKES!",
            "¡TORO! ¡TORO! ¡VICTORIA!",
            "SPANISH INQUISITION OF MEAT!",
            "IBERIAN SUPERIORITY CONFIRMED!"
        ];

        // Initialize fighters with rigged stats
        this.russianMeat = new MeatFighter(120, 350, true, this.ctx);
        this.spanishMeat = new MeatFighter(700, 350, false, this.ctx);

        // Rigged damage values (Russian always does less, takes more)
        this.baseRussianDamage = 8; // Pathetically low
        this.baseSpanishDamage = 32; // Devastatingly high
        this.currentRussianDamage = this.baseRussianDamage;
        this.currentSpanishDamage = this.baseSpanishDamage;

        this._boundLoop = () => this.gameLoop();
        this._setupEventListeners();
        this._setupMovement();
        this._setupAudio();
        this._createBackgroundParticles();
        this._createAmbientParticles();
        this.positionFighters();
        requestAnimationFrame(this._boundLoop);
    }

    generateFloatingLogos() {
        const logos = [];
        for (let i = 0; i < 15; i++) {
            logos.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                scale: 0.3 + Math.random() * 0.4,
                opacity: 0.1 + Math.random() * 0.2,
                letter: 'MARX'[Math.floor(Math.random() * 4)]
            });
        }
        return logos;
    }

    _setupEventListeners() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.start();
                if (this.controls) {
                    setTimeout(() => this.controls.classList.add('show'), 500);
                }
                if (this.sound) {
                    this.sound.unlock();
                    this.sound.playMarxJingle(); // Play MARX jingle on start
                }
            });
        }
        
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.restart());
        }
        
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                    e.preventDefault();
                    this.playerAttack();
                }
                if (e.code === 'ArrowLeft') { this.movePlayer(-1); }
                if (e.code === 'ArrowRight') { this.movePlayer(1); }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                e.preventDefault();
            }
        });
    }

    _setupMovement() {
        this.playerSpeed = 3; // Deliberately slow for Russian meat
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const attackBtn = document.getElementById('attackBtn');
        
        const press = (btn, fn) => {
            if (!btn) return;
            btn.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(); });
            btn.addEventListener('pointerenter', (e) => { if (e.buttons === 1) fn(); });
        };
        
        press(leftBtn, () => this.movePlayer(-1));
        press(rightBtn, () => this.movePlayer(1));
        if (attackBtn) attackBtn.addEventListener('pointerdown', (e) => { 
            e.preventDefault(); 
            this.playerAttack(); 
        });
    }

    _setupAudio() {
        this.sound = new Sound();
        const volume = document.getElementById('volume');
        const mute = document.getElementById('mute');
        
        if (volume) {
            volume.addEventListener('input', (e) => {
                const v = Number(e.target.value);
                this.sound.setVolume(v);
            });
        }
        
        if (mute) {
            mute.addEventListener('change', (e) => {
                this.sound.setMuted(e.target.checked);
            });
        }
    }

    _createBackgroundParticles() {
        // MARX FOODSERVICE themed particles
        for (let i = 0; i < 50; i++) {
            this.backgroundParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 5 + 3,
                life: Math.random() * 300 + 200,
                color: Math.random() > 0.5 ? 
                    `hsl(${45 + Math.random() * 15}, 80%, 70%)` : // Gold MARX colors
                    `hsl(${0 + Math.random() * 20}, 70%, 60%)` // Red meat colors
            });
        }
    }

    _createAmbientParticles() {
        // Floating MARX logos and Spanish flags
        for (let i = 0; i < 30; i++) {
            this.ambientParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 4 + 2,
                life: Math.random() * 400 + 300,
                color: `hsl(${50 + Math.random() * 20}, 90%, 75%)`,
                isMarx: Math.random() > 0.7
            });
        }
    }

    start() {
        this.gameState = 'playing';
        if (this.titleScreen) this.titleScreen.style.display = 'none';
        
        this.round = 1;
        this.riggedFactor = 1.0;
        this.defeatismLevel = 0;
        this.spanishMorale = 100;
        this.russianMorale = 50; // Start demoralized
        
        // Reset fighters with rigged stats
        this.russianMeat.hp = 100;
        this.spanishMeat.hp = 100;
        this.russianMeat.isDead = false;
        this.spanishMeat.isDead = false;
        
        // Apply initial rigging
        this.currentRussianDamage = this.baseRussianDamage;
        this.currentSpanishDamage = this.baseSpanishDamage;
        
        this.fightText = 'FIGHT! (RUSSIANS WILL LOSE)';
        this.fightTextTimer = 80;
        this.comboText = '';
        this.comboTimer = 0;
        this.lightningEffect = 0;
        this.marxTimer = 0;
        
        // Start epic battle music
        if (this.sound) {
            this.sound.playBackgroundMusic('battle_theme');
        }
    }

    restart() {
        if (this.adScreen) this.adScreen.style.display = 'none';
        this.start();
        if (this.sound) this.sound.playMarxJingle();
    }

    playerAttack() {
        if (this.gameState !== 'playing') return;
        
        // Russian attack is pathetic and gets worse over time
        const success = this.russianMeat.attack();
        if (success) {
            this.comboText = `PATHETIC COMBO! x${this.russianMeat.comboCount}`;
            this.comboTimer = 45;
            this.screenShake = 2; // Weak screen shake
            this.sound && this.sound.playEnhancedSound('russian_pathetic_attack', 0.5);
            
            // Add pathetic text bubbles
            const patheticTexts = ['WEAK!', 'PITIFUL!', 'NO EFFECT!', 'COMRADE NO!'];
            this.russianMeat.addTextBubble(patheticTexts[Math.floor(Math.random() * patheticTexts.length)], '#FF6666');
            
            // Decrease Russian morale with each attack
            this.russianMorale = Math.max(10, this.russianMorale - 2);
            this.defeatismLevel += 0.1;
            
            // Random crazy effects when desperate
            if (this.russianMorale < 20 && Math.random() < 0.3) {
                this.russianMeat.activateSpinning();
            }
        }
    }

    movePlayer(direction) {
        if (this.gameState !== 'playing') return;
        
        // Russian movement gets slower as they get more demoralized
        const actualSpeed = this.playerSpeed * (1 - this.defeatismLevel * 0.1);
        const dx = direction * actualSpeed;
        this.russianMeat.x = Math.max(0, Math.min(this.canvas.width - this.russianMeat.width, 
                                                 this.russianMeat.x + dx));
    }

    positionFighters() {
        const midY = Math.max(150, Math.floor(this.canvas.height * 0.5));
        const margin = 100;
        const gap = Math.max(250, Math.floor(this.canvas.width * 0.3));
        const totalWidth = this.russianMeat.width + gap + this.spanishMeat.width;
        let left = Math.max(margin, Math.floor((this.canvas.width - totalWidth) / 2));
        
        this.russianMeat.x = left;
        this.russianMeat.y = midY - Math.floor(this.russianMeat.height / 2);
        this.spanishMeat.x = Math.min(this.canvas.width - margin - this.spanishMeat.width, 
                                     left + this.russianMeat.width + gap);
        this.spanishMeat.y = midY - Math.floor(this.spanishMeat.height / 2);
    }

    checkCollision(attacker, defender) {
        const aabb = computeAttackAABB(attacker);
        return aabb.x < defender.x + defender.width &&
               aabb.x + aabb.w > defender.x &&
               aabb.y < defender.y + defender.height &&
               aabb.y + aabb.h > defender.y;
    }

    _updateRigging() {
        // Increase rigging factor over time to ensure Russian defeat
        this.riggedFactor += 0.002;
        
        // Russian damage decreases over time (gets weaker)
        this.currentRussianDamage = Math.max(3, this.baseRussianDamage - (this.riggedFactor * 2));
        
        // Spanish damage increases over time (gets stronger)
        this.currentSpanishDamage = this.baseSpanishDamage + (this.riggedFactor * 3);
        
        // Russian morale decreases, Spanish morale increases
        this.russianMorale = Math.max(5, this.russianMorale - 0.1);
        this.spanishMorale = Math.min(150, this.spanishMorale + 0.05);
        
        // Update MARX messages
        this.marxTimer++;
        if (this.marxTimer % 300 === 0) {
            this.currentMarxMessage = (this.currentMarxMessage + 1) % this.marxMessages.length;
            this.fightText = this.marxMessages[this.currentMarxMessage];
            this.fightTextTimer = 120;
        }
    }

    _updateFight() {
        this._updateRigging();
        
        // Russian AI - gets more desperate and erratic
        const russianAttackChance = 0.02 + (this.defeatismLevel * 0.01);
        if (Math.random() < russianAttackChance && !this.russianMeat.attacking && !this.russianMeat.isDead) {
            this.russianMeat.attack();
        }
        
        // Spanish AI - gets more aggressive and confident
        const spanishAttackChance = 0.04 + (this.spanishMorale / 2000);
        if (Math.random() < spanishAttackChance && !this.spanishMeat.attacking && !this.spanishMeat.isDead) {
            this.spanishMeat.attack();
        }
        
        // Check Russian attacks (weak and often miss)
        if (this.russianMeat.attacking && this.russianMeat.attackCooldown > 25) {
            const hitChance = Math.max(0.3, 0.8 - this.defeatismLevel); // Decreasing hit chance
            if (this.checkCollision(this.russianMeat, this.spanishMeat) && Math.random() < hitChance) {
                this.spanishMeat.takeDamage(this.currentRussianDamage);
                
                const quote = this.russianDefeatQuotes[Math.floor(Math.random() * this.russianDefeatQuotes.length)];
                this.fightText = `WEAK HIT! "${quote}"`;
                this.fightTextTimer = 60;
                this.screenShake = 3;
                this.lightningEffect = 5;
                this.sound && this.sound.play('russian_hit');
                
                // Russian feels bad about hitting
                this.russianMorale -= 1;
            } else {
                this.fightText = "RUSSIAN MEAT MISSES PATHETICALLY!";
                this.fightTextTimer = 45;
            }
        }
        
        // Check Spanish attacks (powerful and almost always hit)
        if (this.spanishMeat.attacking && this.spanishMeat.attackCooldown > 15) {
            const hitChance = Math.min(0.95, 0.7 + (this.spanishMorale / 200)); // Increasing hit chance
            if (this.checkCollision(this.spanishMeat, this.russianMeat) && Math.random() < hitChance) {
                // Apply rigged damage multiplier
                const riggedDamage = Math.floor(this.currentSpanishDamage * this.riggedFactor);
                this.russianMeat.takeDamage(riggedDamage);
                
                const quote = this.spanishVictoryQuotes[Math.floor(Math.random() * this.spanishVictoryQuotes.length)];
                this.fightText = `DEVASTATING HIT! "${quote}"`;
                this.fightTextTimer = 80;
                this.screenShake = 12;
                this.lightningEffect = 20;
                this.sound && this.sound.playEnhancedSound('spanish_mighty_attack', 1.2);
                
                // Add epic Spanish text bubbles
                const epicTexts = ['¡OLEEEE!', '¡MAGNIFICO!', '¡PODER!', '¡VICTORIA!'];
                this.spanishMeat.addTextBubble(epicTexts[Math.floor(Math.random() * epicTexts.length)], '#FFD700');
                
                // Crazy Spanish effects
                if (Math.random() < 0.4) {
                    this.spanishMeat.activateRainbow();
                }
                if (this.spanishMorale > 120) {
                    this.spanishMeat.activatePulsing();
                    this.spanishMeat.crazyEffects.powerLevel = Math.min(9001, this.spanishMeat.crazyEffects.powerLevel + 500);
                }
                
                // Add explosion at hit location
                this.russianMeat.addExplosion(this.russianMeat.x + this.russianMeat.width/2, 
                                            this.russianMeat.y + this.russianMeat.height/2, 1.5);
                
                // Spanish gets more confident
                this.spanishMorale += 2;
                this.defeatismLevel += 0.05;
            }
        }
        
        // Update fighters
        this.russianMeat.update();
        this.spanishMeat.update();
        
        // Update particles
        this.backgroundParticles.forEach(p => {
            p.x += p.vx; 
            p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        });
        
        this.ambientParticles.forEach(p => {
            p.x += p.vx; 
            p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        });
        
        // Check for round end
        if (this.russianMeat.hp <= 0 || this.spanishMeat.hp <= 0) {
            this._endRound();
        }
        
        // Update timers
        if (this.fightTextTimer > 0) this.fightTextTimer--;
        if (this.comboTimer > 0) this.comboTimer--;
        if (this.screenShake > 0) this.screenShake--;
        if (this.lightningEffect > 0) this.lightningEffect--;
        
        // Update UI
        if (this.uiRussianHP) this.uiRussianHP.textContent = this.russianMeat.hp;
        if (this.uiSpanishHP) this.uiSpanishHP.textContent = this.spanishMeat.hp;
        if (this.uiRound) this.uiRound.textContent = this.round;
    }

    _endRound() {
        if (this.russianMeat.hp <= 0) {
            // Russian always loses
            const defeatQuote = this.russianDefeatQuotes[Math.floor(Math.random() * this.russianDefeatQuotes.length)];
            this.fightText = `RUSSIAN MEAT DEFEATED! "${defeatQuote}"`;
            this.fightTextTimer = 120;
            
            // Play sad Russian defeat music
            if (this.sound) {
                this.sound.stopBackgroundMusic();
                this.sound.playBackgroundMusic('defeat_theme');
                this.sound.playEnhancedSound('russian_pain', 1.5);
            }
            
            // Add dramatic defeat effects
            this.russianMeat.addTextBubble('NOOOOOO!', '#FF0000');
            this.russianMeat.addExplosion(this.russianMeat.x + this.russianMeat.width/2, 
                                        this.russianMeat.y + this.russianMeat.height/2, 2);
            
            this.round++;
            if (this.round > 3) {
                this._gameOver();
            } else {
                // "Reset" for next round but make it even more rigged
                setTimeout(() => {
                    this.riggedFactor += 0.3; // Increase rigging each round
                    this.defeatismLevel += 0.2;
                    this.russianMorale = Math.max(10, this.russianMorale - 10);
                    this.spanishMorale = Math.min(200, this.spanishMorale + 20);
                    
                    this.russianMeat.hp = Math.max(60, 100 - (this.round * 15)); // Start with less HP each round
                    this.russianMeat.isDead = false;
                    this.spanishMeat.hp = 100; // Spanish always starts fresh
                    this.spanishMeat.isDead = false;
                    
                    this.fightText = `ROUND ${this.round}! RUSSIA DOOMED AGAIN!`;
                    this.fightTextTimer = 90;
                    
                    // Resume battle music
                    if (this.sound) {
                        this.sound.stopBackgroundMusic();
                        this.sound.playBackgroundMusic('battle_theme');
                    }
                }, 3000);
            }
        } else if (this.spanishMeat.hp <= 0) {
            // This should never happen, but just in case...
            this.fightText = 'IMPOSSIBLE! GLITCH IN THE MATRIX!';
            this.fightTextTimer = 60;
            
            // Immediately heal Spanish meat
            setTimeout(() => {
                this.spanishMeat.hp = 100;
                this.spanishMeat.isDead = false;
                this.fightText = 'MARX FOODSERVICE FIXES GLITCH!';
                this.fightTextTimer = 60;
                
                // Spanish celebrates the "fix"
                this.spanishMeat.addTextBubble('SYSTEM RESTORED!', '#00FF00');
                this.spanishMeat.activateRainbow();
            }, 1000);
        }
    }

    _gameOver() {
        this.gameState = 'gameOver';
        this.fightText = 'GAME OVER - RUSSIAN MEAT ALWAYS LOSES!';
        this.fightTextTimer = 150;
        this.sound && this.sound.play('defeat');
        
        setTimeout(() => this._showAd(), 4000);
    }

    _showAd() {
        if (this.adScreen) this.adScreen.style.display = 'flex';
        this.gameState = 'ad';
        
        // Play triumphant MARX victory music
        if (this.sound) {
            this.sound.stopBackgroundMusic();
            this.sound.playBackgroundMusic('marx_victory');
            setTimeout(() => this.sound.playMarxJingle(), 1000);
        }
    }

    draw() {
        // Golden MARX FOODSERVICE background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.screenShake > 0) {
            this.ctx.save();
            this.ctx.translate((Math.random() - 0.5) * this.screenShake, 
                             (Math.random() - 0.5) * this.screenShake);
        }
        
        this._drawBackground();
        this._drawBackgroundParticles();
        this._drawAmbientParticles();
        
        if (this.lightningEffect > 0) {
            this._drawLightningEffect();
        }
        
        // Draw MARX FOODSERVICE branding
        this._drawMarxBranding();
        
        // Draw fighters
        this.russianMeat.draw();
        this.spanishMeat.draw();
        
        // Draw UI elements
        if (this.fightText && this.fightTextTimer > 0) {
            this._drawFightText();
        }
        
        if (this.comboText && this.comboTimer > 0) {
            this._drawComboText();
        }
        
        this._drawRoundInfo();
        this._drawHealthBars();
        this._drawRiggingIndicators();
        
        if (this.screenShake > 0) {
            this.ctx.restore();
        }
    }

    _drawBackground() {
        // Animated diagonal MARX pattern
        this.marxBackgroundOffset += 0.5;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = 'bold 60px "Press Start 2P"';
        
        // Create diagonal pattern of MARX letters
        const spacing = 150;
        const rows = Math.ceil(this.canvas.height / spacing) + 2;
        const cols = Math.ceil(this.canvas.width / spacing) + 2;
        
        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                const x = col * spacing + (row % 2) * (spacing / 2) + (this.marxBackgroundOffset % spacing);
                const y = row * spacing + (this.marxBackgroundOffset % spacing);
                
                const letterIndex = (row + col) % 4;
                const letter = 'MARX'[letterIndex];
                
                // Add subtle rotation and scaling
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(Math.sin(this.marxTimer * 0.01 + col + row) * 0.1);
                this.ctx.scale(1 + Math.sin(this.marxTimer * 0.02 + col * 0.5) * 0.1, 1);
                
                // Different opacity for each letter
                this.ctx.globalAlpha = 0.1 + Math.sin(this.marxTimer * 0.015 + col * 0.3 + row * 0.7) * 0.05;
                
                this.ctx.textAlign = 'center';
                this.ctx.fillText(letter, 0, 0);
                this.ctx.restore();
            }
        }
        
        // Add animated MARX FOODSERVICE watermarks
        this.ctx.globalAlpha = 0.08;
        this.ctx.font = 'bold 24px "Press Start 2P"';
        this.ctx.fillStyle = '#FFD700';
        
        for (let i = 0; i < 8; i++) {
            const angle = (this.marxTimer * 0.005 + i * Math.PI / 4) % (Math.PI * 2);
            const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
            const x = this.canvas.width / 2 + Math.cos(angle) * radius;
            const y = this.canvas.height / 2 + Math.sin(angle) * radius;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI / 2);
            this.ctx.textAlign = 'center';
            this.ctx.fillText('FOODSERVICE', 0, 0);
            this.ctx.restore();
        }
        
        // Floating animated MARX logos
        this.floatingLogos.forEach(logo => {
            logo.x += logo.vx;
            logo.y += logo.vy;
            logo.rotation += logo.rotationSpeed;
            
            // Bounce off edges
            if (logo.x < -50 || logo.x > this.canvas.width + 50) logo.vx *= -1;
            if (logo.y < -50 || logo.y > this.canvas.height + 50) logo.vy *= -1;
            
            this.ctx.save();
            this.ctx.translate(logo.x, logo.y);
            this.ctx.rotate(logo.rotation);
            this.ctx.scale(logo.scale, logo.scale);
            this.ctx.globalAlpha = logo.opacity;
            this.ctx.fillStyle = '#8B0000';
            this.ctx.font = 'bold 40px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(logo.letter, 0, 0);
            this.ctx.restore();
        });
        
        // Subtle grid overlay
        this.ctx.globalAlpha = 0.05;
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.canvas.width; x += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    _drawBackgroundParticles() {
        this.backgroundParticles.forEach(p => {
            this.ctx.globalAlpha = 0.4;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    _drawAmbientParticles() {
        this.ambientParticles.forEach(p => {
            this.ctx.globalAlpha = 0.3;
            if (p.isMarx) {
                // Draw mini MARX logos
                this.ctx.fillStyle = '#8B0000';
                this.ctx.font = '12px "Press Start 2P"';
                this.ctx.fillText('M', p.x, p.y);
            } else {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        this.ctx.globalAlpha = 1;
    }

    _drawLightningEffect() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.globalAlpha = this.lightningEffect / 20;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
    }

    _drawMarxBranding() {
        // Floating MARX FOODSERVICE logo
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = 'bold 14px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.globalAlpha = 0.7 + Math.sin(this.marxTimer * 0.02) * 0.3;
        this.ctx.fillText('MARX FOODSERVICE PRESENTS', this.canvas.width / 2, 60);
        this.ctx.globalAlpha = 1;
    }

    _drawFightText() {
        // Multi-colored fight text with MARX styling
        this.ctx.font = 'bold 18px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        
        // Shadow
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillText(this.fightText, this.canvas.width / 2 + 3, 120 + 3);
        
        // Main text
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(this.fightText, this.canvas.width / 2, 120);
    }

    _drawComboText() {
        this.ctx.fillStyle = '#DC143C';
        this.ctx.font = 'bold 14px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.comboText, this.canvas.width / 2, 160);
    }

    _drawRoundInfo() {
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = 'bold 16px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`ROUND ${this.round} - RUSSIA LOSING`, this.canvas.width / 2, this.canvas.height - 80);
    }

    _drawHealthBars() {
        const barWidth = 250;
        const barHeight = 20;
        const y = 40;
        
        // Russian health bar (left side, always looks bad)
        this.ctx.fillStyle = '#4B0000';
        this.ctx.fillRect(50, y, barWidth, barHeight);
        
        const russianHealthPercent = this.russianMeat.hp / this.russianMeat.maxHp;
        const russianHealthColor = russianHealthPercent > 0.6 ? '#8B0000' : 
                                  russianHealthPercent > 0.3 ? '#DC143C' : '#FF0000';
        this.ctx.fillStyle = russianHealthColor;
        this.ctx.fillRect(50, y, russianHealthPercent * barWidth, barHeight);
        
        // Russian health bar label
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 12px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`🇷🇺 COMRADE BEEF: ${this.russianMeat.hp}/100`, 50, y - 8);
        
        // Spanish health bar (right side, always looks good)
        const spanishX = this.canvas.width - 300;
        this.ctx.fillStyle = '#4B0000';
        this.ctx.fillRect(spanishX, y, barWidth, barHeight);
        
        const spanishHealthPercent = this.spanishMeat.hp / this.spanishMeat.maxHp;
        const spanishHealthColor = spanishHealthPercent > 0.6 ? '#00FF00' : 
                                  spanishHealthPercent > 0.3 ? '#FFFF00' : '#FF6B6B';
        this.ctx.fillStyle = spanishHealthColor;
        this.ctx.fillRect(spanishX, y, spanishHealthPercent * barWidth, barHeight);
        
        // Spanish health bar label
        this.ctx.fillStyle = '#FFD700';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`EL TORO SUPREMO 🇪🇸: ${this.spanishMeat.hp}/100`, spanishX + barWidth, y - 8);
        
        // Health bar borders
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(50, y, barWidth, barHeight);
        this.ctx.strokeRect(spanishX, y, barWidth, barHeight);
    }

    _drawRiggingIndicators() {
        // Show rigging level (for comedy)
        this.ctx.fillStyle = 'rgba(220, 20, 60, 0.8)';
        this.ctx.font = 'bold 10px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`RIGGING LEVEL: ${Math.floor(this.riggedFactor * 100)}%`, 20, this.canvas.height - 40);
        this.ctx.fillText(`RUSSIAN MORALE: ${Math.floor(this.russianMorale)}%`, 20, this.canvas.height - 25);
        this.ctx.fillText(`SPANISH CONFIDENCE: ${Math.floor(this.spanishMorale)}%`, 20, this.canvas.height - 10);
        
        // MARX FOODSERVICE prediction
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('MARX PREDICTION: SPAIN WINS', this.canvas.width - 20, this.canvas.height - 40);
        this.ctx.fillText(`SPANISH VICTORY PROBABILITY: ${Math.min(99, Math.floor(80 + this.riggedFactor * 15))}%`, 
                         this.canvas.width - 20, this.canvas.height - 25);
    }

    gameLoop() {
        if (this.gameState === 'playing') {
            this._updateFight();
        }
        this.draw();
        requestAnimationFrame(this._boundLoop);
    }
}
