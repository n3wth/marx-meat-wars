import { MeatFighter } from './MeatFighter.js';
import { Sound } from './Sound.js';
import { Commentary } from './Commentary.js';
import { Achievements } from './Achievements.js';
import { Marketplace } from './Marketplace.js';
import { LayoutManager } from './LayoutManager.js';

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
        
        // Initialize commentary system
        this.commentary = new Commentary();
        this.currentCommentary = '';
        this.commentaryDisplayTimer = 0;
        
        // Initialize achievement system
        this.achievements = new Achievements();
        this.gameStartTime = 0;
        this.currentGameDamageDealt = 0;
        this.currentGameDamageTaken = 0;
        
        // Initialize marketplace system
        this.marketplace = new Marketplace();
        this.reversedControls = false;
        this.setupMarketplace();
        
        // Initialize responsive layout system
        try {
            this.layoutManager = new LayoutManager(this.canvas);
            this.visibleElements = this.layoutManager.getVisibleElements();
        } catch (e) {
            console.warn('Layout manager failed, using fallback:', e);
            this.layoutManager = null;
        }

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

    setupMarketplace() {
        const shopButton = document.getElementById('shopButton');
        const marketplaceModal = document.getElementById('marketplaceModal');
        const closeShop = document.getElementById('closeShop');
        const marxCoinsUI = document.getElementById('marxCoins');
        
        if (shopButton && marketplaceModal) {
            shopButton.addEventListener('click', () => {
                this.openMarketplace();
            });
        }
        
        if (closeShop) {
            closeShop.addEventListener('click', () => {
                marketplaceModal.style.display = 'none';
            });
        }
        
        // Update coin display
        if (marxCoinsUI) {
            marxCoinsUI.textContent = this.marketplace.playerCoins;
        }
    }
    
    openMarketplace() {
        const modal = document.getElementById('marketplaceModal');
        const salesmanQuote = document.getElementById('salesmanQuote');
        const promoText = document.getElementById('promoText');
        const modalCoins = document.getElementById('modalCoins');
        const itemsContainer = document.getElementById('marketplaceItems');
        
        if (!modal) return;
        
        // Update UI
        if (salesmanQuote) salesmanQuote.textContent = this.marketplace.getMarxSalesmanQuote();
        if (promoText) promoText.textContent = this.marketplace.getRandomPromotion();
        if (modalCoins) modalCoins.textContent = this.marketplace.playerCoins;
        
        // Populate items
        if (itemsContainer) {
            itemsContainer.innerHTML = '';
            
            Object.values(this.marketplace.items).forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = `
                    background: rgba(255,255,255,0.9); 
                    padding: 15px; 
                    border-radius: 8px; 
                    border: 3px solid ${item.purchased ? '#00FF00' : '#8B0000'};
                    text-align: center;
                    ${item.purchased ? 'opacity: 0.6;' : 'cursor: pointer;'}
                `;
                
                const canAfford = this.marketplace.canAfford(item.id);
                const buttonColor = item.purchased ? '#888888' : (canAfford ? '#00FF00' : '#FF0000');
                const buttonText = item.purchased ? 'OWNED' : (canAfford ? `BUY ${item.price}💰` : `TOO POOR ${item.price}💰`);
                
                itemDiv.innerHTML = `
                    <div style="font-size: 16px; margin-bottom: 8px;">${item.name.split(' ')[0]}</div>
                    <div style="font-size: 10px; font-weight: bold; margin-bottom: 8px;">${item.name}</div>
                    <div style="font-size: 8px; margin-bottom: 10px; line-height: 1.3;">${item.description}</div>
                    <div style="font-size: 7px; margin-bottom: 8px; color: #666; font-style: italic;">${item.effectDescription}</div>
                    <div style="font-size: 7px; margin-bottom: 10px; color: #8B0000;">${item.marxPitch}</div>
                    <button onclick="buyMarketplaceItem('${item.id}')" 
                            style="padding: 8px 12px; background: ${buttonColor}; color: white; border: 2px solid #8B0000; font-family: 'Press Start 2P'; font-size: 8px; border-radius: 4px; ${item.purchased || !canAfford ? 'cursor: not-allowed;' : 'cursor: pointer;'}"
                            ${item.purchased || !canAfford ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                    ${item.purchased ? `<div style="font-size: 7px; margin-top: 5px; color: #666;">Used ${item.usageCount} times</div>` : ''}
                    ${item.testimonial ? `<div style="font-size: 6px; margin-top: 8px; color: #555; font-style: italic;">${item.testimonial}</div>` : ''}
                `;
                
                itemsContainer.appendChild(itemDiv);
            });
        }
        
        modal.style.display = 'flex';
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
                    // MARX audio now reserved for victory moment only
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
                if (e.code === 'ArrowLeft') { 
                    this.movePlayer(-1); 
                    this.addSillyFeedback('left');
                }
                if (e.code === 'ArrowRight') { 
                    this.movePlayer(1); 
                    this.addSillyFeedback('right');
                }
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
        
        // Start epic MARX main track
        if (this.sound) {
            this.sound.playMainTrack(); // Play the real MARX backing track!
        }
        
        // Start commentary
        this.commentary.reset();
        this.commentary.addCommentary('game_start');
        
        // Start achievement tracking
        this.gameStartTime = Date.now();
        this.currentGameDamageDealt = 0;
        this.currentGameDamageTaken = 0;
        this.achievements.onGameStart();
    }

    restart() {
        if (this.adScreen) this.adScreen.style.display = 'none';
        
        // Stop confetti rain
        if (window.stopConfettiRain) {
            window.stopConfettiRain();
        }
        
        this.start();
        // No MARX audio on restart - save it for the victory moment
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
            
            // Commentary for Russian attack
            this.commentary.addCommentary('russian_attack', {
                riggingLevel: this.riggedFactor * 100,
                morale: this.russianMorale
            });
            
            // Decrease Russian morale with each attack
            this.russianMorale = Math.max(10, this.russianMorale - 2);
            this.defeatismLevel += 0.1;
            
            // Add silly feedback for attacks
            this.addSillyFeedback('attack');
            
            // Random crazy effects when desperate
            if (this.russianMorale < 20 && Math.random() < 0.3) {
                this.russianMeat.activateSpinning();
            }
        }
    }

    movePlayer(direction) {
        if (this.gameState !== 'playing') return;
        
        // Apply reversed controls if speed boots were purchased
        if (this.reversedControls) {
            direction *= -1;
        }
        
        // Russian movement gets slower as they get more demoralized
        let actualSpeed = this.playerSpeed * (1 - this.defeatismLevel * 0.1);
        
        // Apply high heels effect
        if (this.russianMeat.wearingHighHeels) {
            actualSpeed *= 0.3;
            
            // Random chance to fall over
            if (Math.random() < 0.05) {
                this.russianMeat.addTextBubble('OOPS!', '#FF1493');
                this.russianMeat.activateSpinning();
                return; // Can't move when falling
            }
        }
        
        const dx = direction * actualSpeed;
        this.russianMeat.x = Math.max(0, Math.min(this.canvas.width - this.russianMeat.width, 
                                                 this.russianMeat.x + dx));
    }
    
    updateCoinDisplay() {
        const marxCoinsUI = document.getElementById('marxCoins');
        const modalCoins = document.getElementById('modalCoins');
        
        if (marxCoinsUI) marxCoinsUI.textContent = this.marketplace.playerCoins;
        if (modalCoins) modalCoins.textContent = this.marketplace.playerCoins;
    }

    positionFighters() {
        // Simple fallback positioning
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
        
        // Achievement tracking for morale and defeatism
        this.achievements.onMoraleChange(this.russianMorale);
        this.achievements.onDefeatismChange(this.defeatismLevel);
        
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
        
        // Spanish AI - VERY aggressive and relentless
        const spanishAttackChance = 0.15 + (this.spanishMorale / 1000); // Much more aggressive
        if (Math.random() < spanishAttackChance && !this.spanishMeat.attacking && !this.spanishMeat.isDead) {
            this.spanishMeat.attack();
        }
        
        // Spanish meat actively hunts Russian meat
        if (!this.spanishMeat.attacking && !this.spanishMeat.isDead) {
            const distanceToRussian = Math.abs(this.spanishMeat.x - this.russianMeat.x);
            const optimalDistance = 120; // Stay close enough to attack
            
            if (distanceToRussian > optimalDistance) {
                // Move towards Russian meat
                const direction = this.russianMeat.x < this.spanishMeat.x ? -1 : 1;
                const huntSpeed = 1.5 + (this.spanishMorale / 150); // Gets faster as confidence increases
                this.spanishMeat.x += direction * huntSpeed;
                
                // Keep Spanish meat on screen
                this.spanishMeat.x = Math.max(0, Math.min(this.canvas.width - this.spanishMeat.width, this.spanishMeat.x));
                
                // Add hunting text bubbles and effects occasionally
                if (Math.random() < 0.02) {
                    const huntTexts = ['¡TE PERSIGO!', '¡NO ESCAPE!', '¡HUNTING!', '¡VICTORY!'];
                    this.spanishMeat.addTextBubble(huntTexts[Math.floor(Math.random() * huntTexts.length)], '#FFD700');
                    this.spanishMeat.activateHunting();
                }
            } else {
                // Close enough - be extra aggressive
                if (Math.random() < 0.25) { // 25% chance per frame when close!
                    this.spanishMeat.attack();
                }
            }
        }
        
        // Check Russian attacks (weak and often miss)
        if (this.russianMeat.attacking && this.russianMeat.attackCooldown > 25) {
            const hitChance = Math.max(0.3, 0.8 - this.defeatismLevel); // Decreasing hit chance
            if (this.checkCollision(this.russianMeat, this.spanishMeat) && Math.random() < hitChance) {
                this.spanishMeat.takeDamage(this.currentRussianDamage);
                this.currentGameDamageDealt += this.currentRussianDamage;
                
                const quote = this.russianDefeatQuotes[Math.floor(Math.random() * this.russianDefeatQuotes.length)];
                this.fightText = `WEAK HIT! "${quote}"`;
                this.fightTextTimer = 60;
                this.screenShake = 3;
                this.lightningEffect = 5;
                this.sound && this.sound.play('russian_hit');
                
                // Achievement tracking
                this.achievements.onRussianAttack(true);
                
                // Russian feels bad about hitting
                this.russianMorale -= 1;
            } else {
                this.fightText = "RUSSIAN MEAT MISSES PATHETICALLY!";
                this.fightTextTimer = 45;
                
                // Commentary for Russian miss
                this.commentary.addCommentary('russian_miss');
                
                // Achievement tracking
                this.achievements.onRussianAttack(false);
            }
        }
        
        // Check Spanish attacks (powerful and almost always hit)
        if (this.spanishMeat.attacking && this.spanishMeat.attackCooldown > 15) {
            const hitChance = Math.min(0.95, 0.7 + (this.spanishMorale / 200)); // Increasing hit chance
            if (this.checkCollision(this.spanishMeat, this.russianMeat) && Math.random() < hitChance) {
                // Apply rigged damage multiplier
                const riggedDamage = Math.floor(this.currentSpanishDamage * this.riggedFactor);
                this.russianMeat.takeDamage(riggedDamage);
                this.currentGameDamageTaken += riggedDamage;
                
                const quote = this.spanishVictoryQuotes[Math.floor(Math.random() * this.spanishVictoryQuotes.length)];
                this.fightText = `DEVASTATING HIT! "${quote}"`;
                this.fightTextTimer = 80;
                this.screenShake = 12;
                this.lightningEffect = 20;
                this.sound && this.sound.playEnhancedSound('spanish_mighty_attack', 1.2);
                
                // Add epic Spanish text bubbles
                const epicTexts = ['¡OLEEEE!', '¡MAGNIFICO!', '¡PODER!', '¡VICTORIA!'];
                this.spanishMeat.addTextBubble(epicTexts[Math.floor(Math.random() * epicTexts.length)], '#FFD700');
                
                // Commentary for Spanish attack and Russian getting hit
                this.commentary.addCommentary('spanish_attack', {
                    damage: riggedDamage,
                    powerLevel: this.spanishMeat.crazyEffects.powerLevel
                });
                this.commentary.addCommentary('russian_hit', {
                    damage: riggedDamage,
                    russianHp: this.russianMeat.hp
                });
                
                // Crazy Spanish effects
                if (Math.random() < 0.4) {
                    this.spanishMeat.activateRainbow();
                }
                if (this.spanishMorale > 120) {
                    this.spanishMeat.activatePulsing();
                    this.spanishMeat.crazyEffects.powerLevel = Math.min(9001, this.spanishMeat.crazyEffects.powerLevel + 500);
                    
                    // Check power level achievement
                    this.achievements.onSpanishPowerLevel(this.spanishMeat.crazyEffects.powerLevel);
                }
                
                // Add explosion at hit location
                this.russianMeat.addExplosion(this.russianMeat.x + this.russianMeat.width/2, 
                                            this.russianMeat.y + this.russianMeat.height/2, 1.5);
                
                // Spanish gets more confident
                this.spanishMorale += 2;
                this.defeatismLevel += 0.05;
                
                // Earn MARX COINS for getting hit (pity coins)
                const coinReward = this.marketplace.earnCoins(2, 'getting_hit');
                this.russianMeat.addTextBubble(`+${coinReward.amount}💰`, '#FFD700');
                this.updateCoinDisplay();
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
        
        // Update commentary system - now uses HTML ticker
        this.commentary.update();
        const newCommentary = this.commentary.getCurrentCommentary();
        if (newCommentary) {
            this.currentCommentary = newCommentary;
            this.commentaryDisplayTimer = 180; // 3 seconds
            
            // Update HTML commentary ticker
            const commentaryTicker = document.getElementById('commentaryTicker');
            const commentaryText = document.getElementById('commentaryText');
            
            if (commentaryTicker && commentaryText) {
                commentaryTicker.style.display = 'flex';
                commentaryText.textContent = newCommentary;
                
                // Auto-hide after timer
                setTimeout(() => {
                    if (commentaryTicker) commentaryTicker.style.display = 'none';
                }, 3000);
            }
        }
        
        // Update timers
        if (this.fightTextTimer > 0) this.fightTextTimer--;
        if (this.comboTimer > 0) this.comboTimer--;
        if (this.screenShake > 0) this.screenShake--;
        if (this.lightningEffect > 0) this.lightningEffect--;
        if (this.commentaryDisplayTimer > 0) this.commentaryDisplayTimer--;
        
        // Update HTML UI elements
        if (this.uiRussianHP) this.uiRussianHP.textContent = this.russianMeat.hp;
        if (this.uiSpanishHP) this.uiSpanishHP.textContent = this.spanishMeat.hp;
        if (this.uiRound) this.uiRound.textContent = this.round;
        
        // Update HTML health bars
        const russianHealthBar = document.getElementById('russianHealthBar');
        const spanishHealthBar = document.getElementById('spanishHealthBar');
        const riggingLevelUI = document.getElementById('riggingLevel');
        const achievementCountUI = document.getElementById('achievementCount');
        
        if (russianHealthBar) {
            const russianPercent = (this.russianMeat.hp / this.russianMeat.maxHp) * 100;
            russianHealthBar.style.width = `${russianPercent}%`;
            
            // Change color based on health
            if (russianPercent > 60) {
                russianHealthBar.style.background = 'linear-gradient(90deg, #8B0000, #DC143C)';
            } else if (russianPercent > 30) {
                russianHealthBar.style.background = 'linear-gradient(90deg, #DC143C, #FF6B6B)';
            } else {
                russianHealthBar.style.background = 'linear-gradient(90deg, #FF0000, #FF4444)';
            }
        }
        
        if (spanishHealthBar) {
            const spanishPercent = (this.spanishMeat.hp / this.spanishMeat.maxHp) * 100;
            spanishHealthBar.style.width = `${spanishPercent}%`;
            
            // Spanish health always looks good
            if (spanishPercent > 60) {
                spanishHealthBar.style.background = 'linear-gradient(90deg, #00FF00, #32CD32)';
            } else if (spanishPercent > 30) {
                spanishHealthBar.style.background = 'linear-gradient(90deg, #FFFF00, #FFD700)';
            } else {
                spanishHealthBar.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8C00)';
            }
        }
        
        if (riggingLevelUI) {
            riggingLevelUI.textContent = Math.floor(this.riggedFactor * 100);
        }
        
        if (achievementCountUI) {
            const progress = this.achievements.getProgressSummary();
            achievementCountUI.textContent = progress.unlocked;
        }
    }

    _endRound() {
        if (this.russianMeat.hp <= 0) {
            // Russian always loses
            const defeatQuote = this.russianDefeatQuotes[Math.floor(Math.random() * this.russianDefeatQuotes.length)];
            this.fightText = `RUSSIAN MEAT DEFEATED! "${defeatQuote}"`;
            this.fightTextTimer = 120;
            
            // Play sad Russian defeat music (but keep MARX main track going)
            if (this.sound) {
                this.sound.playEnhancedSound('russian_pain', 1.5);
                // Keep MARX main track playing - it's the constant backdrop of Russian failure
            }
            
            // Add dramatic defeat effects
            this.russianMeat.addTextBubble('NOOOOOO!', '#FF0000');
            this.russianMeat.addExplosion(this.russianMeat.x + this.russianMeat.width/2, 
                                        this.russianMeat.y + this.russianMeat.height/2, 2);
            
            // Commentary for round end
            this.commentary.addCommentary('round_end', {
                round: this.round,
                riggingLevel: this.riggedFactor * 100
            });
            
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
                    
                    // MARX main track continues - no need to restart
                    // The constant MARX backing track represents the inevitable nature of Russian defeat
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
        
        // Commentary for game over
        this.commentary.addCommentary('game_over', {
            totalRounds: 3,
            riggingLevel: this.riggedFactor * 100
        });
        
        // Achievement tracking for game end
        const gameTime = (Date.now() - this.gameStartTime) / 1000;
        this.achievements.onGameEnd({
            gameTime: gameTime,
            damageTaken: this.currentGameDamageTaken,
            damageDealt: this.currentGameDamageDealt,
            rounds: 3
        });
        
        // Earn coins for losing (MARX sympathy bonus)
        const defeatBonus = Math.floor(this.currentGameDamageTaken / 10) + 20;
        const coinReward = this.marketplace.earnCoins(defeatBonus, 'defeat');
        this.updateCoinDisplay();
        
        setTimeout(() => this._showAd(), 4000);
    }

    _showAd() {
        if (this.adScreen) this.adScreen.style.display = 'flex';
        this.gameState = 'ad';
        
        // Play MARX FOODSERVICE audio when victory screen appears
        if (this.sound) {
            this.sound.playMarxAudio(); // "MARX FOODSERVICE!" shout for the victory celebration
        }
        
        // Start epic confetti rain
        setTimeout(() => {
            if (window.startConfettiRain) {
                window.startConfettiRain();
            }
        }, 500);
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
        
        // MARX branding now in HTML elements only
        
        // Draw fighters
        this.russianMeat.draw();
        this.spanishMeat.draw();
        
        // Fight text now handled by HTML commentary ticker only
        
        if (this.comboText && this.comboTimer > 0) {
            this._drawComboText();
        }
        
        this._drawRoundInfo();
        // Remove canvas health bars - using HTML UI instead
        
        // Only draw complex UI elements if there's enough space
        if (this.canvas.width > 1000) {
            this._drawRiggingIndicators();
            this._drawAchievements();
        }
        
        // Commentary now handled by HTML ticker - no canvas drawing needed
        
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

    // _drawMarxBranding() - REMOVED to prevent overlap
    // MARX branding now handled by HTML elements only

    // _drawFightText() - REMOVED to prevent duplicate commentary
    // Fight text now handled by HTML commentary ticker only

    _drawComboText() {
        this.ctx.fillStyle = '#DC143C';
        this.ctx.font = 'bold 14px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.comboText, this.canvas.width / 2, 160);
    }

    _drawRoundInfo() {
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = 'bold 14px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`ROUND ${this.round} - RUSSIA LOSING`, this.canvas.width / 2, this.canvas.height - 220);
    }

    _drawHealthBars() {
        // Fallback if layout manager fails
        if (this.layoutManager && !this.layoutManager.shouldShow('healthBars', 'essential')) return;
        
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
        // HUGE, IN-YOUR-FACE absurd numbers - make the rigging obvious and hilarious
        
        // MASSIVE rigging percentage in center
        const riggingPercent = Math.floor(this.riggedFactor * 100);
        this.ctx.fillStyle = '#DC143C';
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(`RIGGED: ${riggingPercent}%`, this.canvas.width / 2, this.canvas.height - 100);
        this.ctx.fillText(`RIGGED: ${riggingPercent}%`, this.canvas.width / 2, this.canvas.height - 100);
        
        // ABSURD victory probability that goes way beyond 100%
        const absurdProbability = Math.floor(80 + this.riggedFactor * 50 + this.spanishMorale * 2);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px "Press Start 2P"';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(`SPAIN WIN PROB: ${absurdProbability}%`, this.canvas.width / 2, this.canvas.height - 50);
        this.ctx.fillText(`SPAIN WIN PROB: ${absurdProbability}%`, this.canvas.width / 2, this.canvas.height - 50);
        
        // RIDICULOUS Russian failure probability
        const russianFailProb = Math.max(100, Math.floor(100 + this.defeatismLevel * 50 + (100 - this.russianMorale)));
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = 'bold 16px "Press Start 2P"';
        this.ctx.fillText(`RUSSIAN FAILURE PROB: ${russianFailProb}%`, this.canvas.width / 2, this.canvas.height - 20);
    }

    // Commentary now handled by HTML ticker - method removed

    _drawAchievements() {
        // Only show on larger screens to avoid overlap
        if (this.canvas.width < 1200) return;
        
        const recentUnlocks = this.achievements.getRecentUnlocks();
        if (recentUnlocks.length > 0) {
            recentUnlocks.forEach((achievement, index) => {
                const y = 180 + (index * 50); // Positioned below MARX logo area
                const timeSinceUnlock = Date.now() - achievement.timestamp;
                const fadeTime = 5000; // 5 seconds
                
                if (timeSinceUnlock < fadeTime) {
                    const alpha = Math.max(0, 1 - (timeSinceUnlock / fadeTime));
                    
                    // Achievement notification background - smaller
                    this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.95})`;
                    this.ctx.fillRect(this.canvas.width - 280, y, 260, 50);
                    
                    // Border
                    this.ctx.strokeStyle = `rgba(139, 0, 0, ${alpha})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(this.canvas.width - 280, y, 260, 50);
                    
                    // Achievement icon
                    this.ctx.fillStyle = `rgba(139, 0, 0, ${alpha})`;
                    this.ctx.font = '16px Arial';
                    this.ctx.textAlign = 'left';
                    this.ctx.fillText(achievement.icon, this.canvas.width - 270, y + 20);
                    
                    // Achievement text - smaller
                    this.ctx.font = 'bold 8px "Press Start 2P"';
                    this.ctx.fillText('UNLOCKED!', this.canvas.width - 250, y + 12);
                    this.ctx.fillText(achievement.name, this.canvas.width - 250, y + 25);
                    
                    // MARX quote - smaller
                    this.ctx.font = '6px "Press Start 2P"';
                    this.ctx.fillText(achievement.marxQuote, this.canvas.width - 250, y + 38);
                    
                    // Rarity indicator
                    const rarityColors = {
                        'common': '#CCCCCC',
                        'uncommon': '#00FF00', 
                        'rare': '#0080FF',
                        'legendary': '#FF8000',
                        'mythical': '#FF00FF'
                    };
                    this.ctx.fillStyle = `${rarityColors[achievement.rarity] || '#CCCCCC'}`;
                    this.ctx.fillRect(this.canvas.width - 280, y, 4, 50);
                }
            });
        }
        
        // Show achievement progress summary - only on large screens
        if (this.canvas.width > 1200) {
            const progress = this.achievements.getProgressSummary();
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            this.ctx.fillRect(this.canvas.width - 180, 120, 160, 40);
            
            this.ctx.strokeStyle = '#8B0000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.canvas.width - 180, 120, 160, 40);
            
            this.ctx.fillStyle = '#8B0000';
            this.ctx.font = 'bold 7px "Press Start 2P"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`ACH: ${progress.unlocked}/${progress.total}`, this.canvas.width - 175, 135);
            this.ctx.fillText(`FAILURE SCORE: ${progress.score}`, this.canvas.width - 175, 145);
            this.ctx.fillText(`COMPLETION: ${progress.percentage}%`, this.canvas.width - 175, 155);
        }
    }

    addSillyFeedback(action) {
        const sillyAccessories = ['🕶️', '🎩', '👒', '🧢', '👑', '🎭', '🤠', '🧙‍♂️'];
        const sillyActions = {
            'left': ['FANCY LEFT!', 'STYLISH RETREAT!', 'FABULOUS ESCAPE!', 'DIVA DODGE!'],
            'right': ['GLAMOROUS RIGHT!', 'SASSY ADVANCE!', 'FIERCE FORWARD!', 'QUEEN MARCH!'],
            'attack': ['FIERCE STRIKE!', 'DIVA ATTACK!', 'SASSY SWING!', 'FABULOUS FURY!']
        };
        
        // Random accessory appears briefly
        if (Math.random() < 0.3) {
            const accessory = sillyAccessories[Math.floor(Math.random() * sillyAccessories.length)];
            this.russianMeat.addTextBubble(accessory, '#FF69B4');
        }
        
        // Silly action text
        if (Math.random() < 0.2) {
            const actionText = sillyActions[action] || ['FABULOUS!'];
            this.russianMeat.addTextBubble(actionText[Math.floor(Math.random() * actionText.length)], '#FFD700');
        }
        
        // Random sparkle effects
        if (Math.random() < 0.4) {
            this.russianMeat.addParticle(this.russianMeat.x + this.russianMeat.width/2, 
                                       this.russianMeat.y + this.russianMeat.height/2, '#FFFFFF');
        }
    }

    gameLoop() {
        if (this.gameState === 'playing') {
            this._updateFight();
        }
        this.draw();
        requestAnimationFrame(this._boundLoop);
    }
}
