export class MeatFighter {
    constructor(x, y, isRussian, ctx) {
        this.x = x;
        this.y = y;
        this.isRussian = isRussian;
        this.ctx = ctx;
        this.width = 90;
        this.height = 90;
        this.hp = 100;
        this.maxHp = 100;
        this.attacking = false;
        this.attackCooldown = 0;
        this.hitCooldown = 0;
        this.animationFrame = 0;
        this.direction = isRussian ? 1 : -1;
        
        // Hilarious meat characteristics
        if (isRussian) {
            this.color = '#8B0000'; // Dark red Russian meat
            this.outlineColor = '#4B0000';
            this.name = 'COMRADE BEEF';
            this.meatType = 'SIBERIAN STEAK';
            this.weakness = 'CAPITALIST SEASONING';
            this.battleCry = 'FOR THE MOTHERLAND!';
            this.defeatQuote = 'BLYAD! NOT AGAIN!';
            this.attackDamage = 12; // Deliberately weak
            this.defenseMultiplier = 0.7; // Takes more damage
        } else {
            this.color = '#DC143C'; // Bright red Spanish meat
            this.outlineColor = '#8B0000';
            this.name = 'EL TORO SUPREMO';
            this.meatType = 'IBERIAN HAM';
            this.strength = 'MEDITERRANEAN MAGIC';
            this.battleCry = '¡OLEEEE!';
            this.victoryQuote = '¡VIVA ESPAÑA!';
            this.attackDamage = 28; // Overpowered
            this.defenseMultiplier = 1.3; // Takes less damage
        }
        
        this.particles = [];
        this.isDead = false;
        this.deathAnimation = 0;
        this.comboCount = 0;
        this.lastAttackTime = 0;
        
        // Generate meat textures and features
        this.meatTexture = this.generateMeatTexture();
        this.veins = this.generateVeins();
        this.fatDeposits = this.generateFatDeposits();
        this.muscleFibers = this.generateMuscleFibers();
        this.meatJuice = this.generateMeatJuice();
        this.boneFragments = this.generateBoneFragments();
        this.meatPores = this.generateMeatPores();
        this.meatGrain = this.generateMeatGrain();
        this.meatMarbling = this.generateMeatMarbling();
        
        // Special characteristics based on nationality
        if (isRussian) {
            this.vodkaDroplets = this.generateVodkaDroplets();
            this.communistSymbols = this.generateCommunistSymbols();
            this.snowflakes = this.generateSnowflakes();
            this.tears = [];
        } else {
            this.oliveOil = this.generateOliveOil();
            this.spanishSpices = this.generateSpanishSpices();
            this.flamencoFlames = this.generateFlamencoFlames();
            this.victoryAura = [];
        }
        
        // Crazy visual effects
        this.crazyEffects = {
            rainbow: false,
            spinning: false,
            pulsing: false,
            glowing: false,
            hunting: false,
            trailing: [],
            explosions: [],
            textBubbles: [],
            powerLevel: this.isRussian ? 1 : 9001
        };
        
        // Marketplace cosmetic items
        this.cosmetics = {
            sexyLegs: false,
            highHeels: false,
            makeup: false,
            backwardsGun: false
        };
        
        // Item effects
        this.wearingHighHeels = false;
        this.distractedByLegs = false;
        this.makeupMode = false;
        this.healingMode = false;
        this.badLuck = false;
    }

    generateMeatTexture() {
        const texture = [];
        const density = this.isRussian ? 0.3 : 0.5; // Russian meat is less dense
        for (let i = 0; i < 15; i++) {
            texture[i] = [];
            for (let j = 0; j < 15; j++) {
                texture[i][j] = Math.random() > density;
            }
        }
        return texture;
    }

    generateVeins() {
        const veins = [];
        const count = this.isRussian ? 4 : 8; // Spanish meat has more veins (better circulation)
        for (let i = 0; i < count; i++) {
            veins.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                length: Math.random() * (this.isRussian ? 25 : 35) + 15,
                angle: Math.random() * Math.PI * 2,
                thickness: Math.random() * (this.isRussian ? 2 : 4) + 2
            });
        }
        return veins;
    }

    generateFatDeposits() {
        const deposits = [];
        const count = this.isRussian ? 12 : 6; // Russian meat has more fat (less healthy)
        for (let i = 0; i < count; i++) {
            deposits.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (this.isRussian ? 15 : 10) + 6,
                color: this.isRussian ? 
                    `hsl(${35 + Math.random() * 20}, 60%, 75%)` : // Pale Russian fat
                    `hsl(${45 + Math.random() * 15}, 80%, 85%)` // Golden Spanish fat
            });
        }
        return deposits;
    }

    generateMuscleFibers() {
        const fibers = [];
        const count = this.isRussian ? 10 : 20; // Spanish meat has more muscle fibers
        for (let i = 0; i < count; i++) {
            fibers.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                length: Math.random() * (this.isRussian ? 20 : 30) + 10,
                angle: Math.random() * Math.PI * 2,
                thickness: Math.random() * (this.isRussian ? 1.5 : 3) + 1
            });
        }
        return fibers;
    }

    generateMeatJuice() {
        const juice = [];
        const count = this.isRussian ? 15 : 25; // Spanish meat is juicier
        for (let i = 0; i < count; i++) {
            juice.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (this.isRussian ? 2 : 4) + 1,
                color: this.isRussian ? 
                    `hsl(${10 + Math.random() * 15}, 60%, 50%)` : // Dull Russian juice
                    `hsl(${15 + Math.random() * 20}, 80%, 65%)` // Rich Spanish juice
            });
        }
        return juice;
    }

    generateBoneFragments() {
        const bones = [];
        const count = this.isRussian ? 8 : 3; // Russian meat has more bone fragments (worse quality)
        for (let i = 0; i < count; i++) {
            bones.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (this.isRussian ? 6 : 4) + 2
            });
        }
        return bones;
    }

    generateMeatPores() {
        const pores = [];
        const count = this.isRussian ? 30 : 20;
        for (let i = 0; i < count; i++) {
            pores.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (this.isRussian ? 3 : 2) + 1
            });
        }
        return pores;
    }

    generateMeatGrain() {
        const grain = [];
        const count = this.isRussian ? 6 : 10;
        for (let i = 0; i < count; i++) {
            grain.push({
                y: this.y + 15 + i * (this.height / count),
                thickness: Math.random() * (this.isRussian ? 1.5 : 3) + 1
            });
        }
        return grain;
    }

    generateMeatMarbling() {
        const marbling = [];
        const count = this.isRussian ? 8 : 15; // Spanish meat has better marbling
        for (let i = 0; i < count; i++) {
            marbling.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (this.isRussian ? 6 : 10) + 4,
                color: this.isRussian ? 
                    `hsl(${30 + Math.random() * 15}, 50%, 70%)` : // Dull Russian marbling
                    `hsl(${35 + Math.random() * 20}, 70%, 80%)` // Beautiful Spanish marbling
            });
        }
        return marbling;
    }

    // Russian-specific features
    generateVodkaDroplets() {
        if (!this.isRussian) return [];
        const droplets = [];
        for (let i = 0; i < 5; i++) {
            droplets.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 2,
                shimmer: Math.random() * 100
            });
        }
        return droplets;
    }

    generateCommunistSymbols() {
        if (!this.isRussian) return [];
        return [
            { x: this.width * 0.2, y: this.height * 0.3, symbol: '☭' },
            { x: this.width * 0.7, y: this.height * 0.6, symbol: '⚒' }
        ];
    }

    // Spanish-specific features
    generateOliveOil() {
        if (this.isRussian) return [];
        const oil = [];
        for (let i = 0; i < 8; i++) {
            oil.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 4 + 2,
                color: `hsl(${60 + Math.random() * 20}, 80%, 70%)`
            });
        }
        return oil;
    }

    generateSpanishSpices() {
        if (this.isRussian) return [];
        return [
            { x: this.width * 0.3, y: this.height * 0.2, spice: '🌶️' },
            { x: this.width * 0.6, y: this.height * 0.7, spice: '🧄' },
            { x: this.width * 0.8, y: this.height * 0.4, spice: '🌿' }
        ];
    }

    // New crazy effect generators
    generateSnowflakes() {
        if (!this.isRussian) return [];
        const flakes = [];
        for (let i = 0; i < 8; i++) {
            flakes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 1,
                angle: Math.random() * Math.PI * 2
            });
        }
        return flakes;
    }

    generateFlamencoFlames() {
        if (this.isRussian) return [];
        const flames = [];
        for (let i = 0; i < 6; i++) {
            flames.push({
                x: Math.random() * this.width,
                y: this.height - Math.random() * 20,
                height: Math.random() * 15 + 10,
                intensity: Math.random() * 0.8 + 0.2,
                flicker: Math.random() * Math.PI * 2
            });
        }
        return flames;
    }

    // Crazy effect methods
    activateRainbow() {
        this.crazyEffects.rainbow = true;
        setTimeout(() => { this.crazyEffects.rainbow = false; }, 3000);
    }

    activateSpinning() {
        this.crazyEffects.spinning = true;
        setTimeout(() => { this.crazyEffects.spinning = false; }, 2000);
    }

    activatePulsing() {
        this.crazyEffects.pulsing = true;
        setTimeout(() => { this.crazyEffects.pulsing = false; }, 4000);
    }

    activateHunting() {
        this.crazyEffects.hunting = true;
        setTimeout(() => { this.crazyEffects.hunting = false; }, 2000);
    }

    addTextBubble(text, color = '#FFD700') {
        this.crazyEffects.textBubbles.push({
            text: text,
            x: this.x + this.width/2,
            y: this.y - 20,
            color: color,
            life: 120,
            maxLife: 120,
            vx: (Math.random() - 0.5) * 2,
            vy: -2
        });
    }

    addExplosion(x, y, intensity = 1) {
        this.crazyEffects.explosions.push({
            x: x,
            y: y,
            size: 0,
            maxSize: 50 * intensity,
            life: 30,
            maxLife: 30,
            particles: []
        });

        // Add explosion particles
        for (let i = 0; i < 15 * intensity; i++) {
            this.crazyEffects.explosions[this.crazyEffects.explosions.length - 1].particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 20,
                color: `hsl(${Math.random() * 60 + 15}, 100%, 70%)`
            });
        }
    }

    draw() {
        this.ctx.save();
        
        // Apply crazy transformations
        if (this.crazyEffects.spinning) {
            this.ctx.translate(this.x + this.width/2, this.y + this.height/2);
            this.ctx.rotate(this.animationFrame * 0.2);
            this.ctx.translate(-(this.x + this.width/2), -(this.y + this.height/2));
        }
        
        if (this.crazyEffects.pulsing) {
            const pulse = 1 + Math.sin(this.animationFrame * 0.3) * 0.2;
            this.ctx.translate(this.x + this.width/2, this.y + this.height/2);
            this.ctx.scale(pulse, pulse);
            this.ctx.translate(-(this.x + this.width/2), -(this.y + this.height/2));
        }
        
        // Apply defeat animation for Russian meat
        if (this.isRussian && this.hp < 50) {
            this.ctx.globalAlpha = 0.7 + Math.sin(this.animationFrame * 0.1) * 0.2;
        }
        
        // Rainbow effect
        if (this.crazyEffects.rainbow) {
            const hue = (this.animationFrame * 5) % 360;
            this.ctx.filter = `hue-rotate(${hue}deg) saturate(200%)`;
        }
        
        // Glowing effect
        if (this.crazyEffects.glowing || (!this.isRussian && this.hp > 80)) {
            this.ctx.shadowColor = this.isRussian ? '#FF0000' : '#FFD700';
            this.ctx.shadowBlur = 20 + Math.sin(this.animationFrame * 0.2) * 10;
        }
        
        // Hunting effect for Spanish meat
        if (this.crazyEffects.hunting && !this.isRussian) {
            this.ctx.shadowColor = '#DC143C';
            this.ctx.shadowBlur = 30 + Math.sin(this.animationFrame * 0.5) * 20;
            
            // Add hunting aura rings
            for (let i = 0; i < 3; i++) {
                this.ctx.strokeStyle = `rgba(220, 20, 60, ${0.4 - i * 0.1})`;
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                           60 + i * 20 + Math.sin(this.animationFrame * 0.3 + i) * 10, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
        
        this.drawMeatBody();
        this.drawMeatDetails();
        this.drawEyelashes();
        this.drawCosmeticItems();
        this.drawNationalityFeatures();
        this.drawCrazyEffects();
        
        if (this.attacking) {
            this.drawAttackEffect();
        }
        if (this.hitCooldown > 0) {
            this.drawHitEffect();
        }
        
        this.drawParticles();
        this.drawMeatInfo();
        this.drawTextBubbles();
        this.drawExplosions();
        
        this.ctx.restore();
    }

    drawMeatBody() {
        // Main meat body
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                        this.width/2, this.height/2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Marbling
        this.meatMarbling.forEach(marble => {
            this.ctx.fillStyle = marble.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x + marble.x, this.y + marble.y, marble.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Meat grain
        this.ctx.strokeStyle = this.outlineColor;
        this.meatGrain.forEach(grain => {
            this.ctx.lineWidth = grain.thickness;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + 10, grain.y);
            this.ctx.lineTo(this.x + this.width - 10, grain.y);
            this.ctx.stroke();
        });

        // Fat deposits
        this.fatDeposits.forEach(deposit => {
            this.ctx.fillStyle = deposit.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x + deposit.x, this.y + deposit.y, deposit.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Veins
        this.ctx.strokeStyle = '#4B0000';
        this.veins.forEach(vein => {
            this.ctx.lineWidth = vein.thickness;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + vein.x, this.y + vein.y);
            this.ctx.lineTo(this.x + vein.x + Math.cos(vein.angle) * vein.length, 
                           this.y + vein.y + Math.sin(vein.angle) * vein.length);
            this.ctx.stroke();
        });

        // Muscle fibers
        this.ctx.strokeStyle = this.isRussian ? '#6B0000' : '#8B0000';
        this.muscleFibers.forEach(fiber => {
            this.ctx.lineWidth = fiber.thickness;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + fiber.x, this.y + fiber.y);
            this.ctx.lineTo(this.x + fiber.x + Math.cos(fiber.angle) * fiber.length, 
                           this.y + fiber.y + Math.sin(fiber.angle) * fiber.length);
            this.ctx.stroke();
        });

        // Meat juice
        this.meatJuice.forEach(juice => {
            this.ctx.fillStyle = juice.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x + juice.x, this.y + juice.y, juice.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Bone fragments
        this.ctx.fillStyle = '#F5F5DC';
        this.boneFragments.forEach(bone => {
            this.ctx.beginPath();
            this.ctx.arc(this.x + bone.x, this.y + bone.y, bone.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawMeatDetails() {
        // Eyes (always sad for Russian, confident for Spanish)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(this.x + 30, this.y + 30, 10, 0, Math.PI * 2);
        this.ctx.arc(this.x + 60, this.y + 30, 10, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        if (this.isRussian) {
            // Sad Russian eyes
            this.ctx.arc(this.x + 30, this.y + 35, 5, 0, Math.PI * 2);
            this.ctx.arc(this.x + 60, this.y + 35, 5, 0, Math.PI * 2);
        } else {
            // Confident Spanish eyes
            this.ctx.arc(this.x + 30, this.y + 28, 5, 0, Math.PI * 2);
            this.ctx.arc(this.x + 60, this.y + 28, 5, 0, Math.PI * 2);
        }
        this.ctx.fill();

        // Eye shine
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(this.x + 28, this.y + (this.isRussian ? 33 : 26), 2, 0, Math.PI * 2);
        this.ctx.arc(this.x + 58, this.y + (this.isRussian ? 33 : 26), 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Mouth
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        if (this.isRussian) {
            // Frowning Russian mouth
            this.ctx.arc(this.x + 45, this.y + 65, 8, 0, Math.PI);
        } else {
            // Smiling Spanish mouth
            this.ctx.arc(this.x + 45, this.y + 55, 8, 0, Math.PI, true);
        }
        this.ctx.fill();

        // Meat pores
        this.ctx.fillStyle = this.outlineColor;
        this.meatPores.forEach(pore => {
            this.ctx.beginPath();
            this.ctx.arc(this.x + pore.x, this.y + pore.y, pore.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawNationalityFeatures() {
        if (this.isRussian) {
            // Vodka droplets
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(this.animationFrame * 0.1) * 0.3})`;
            this.vodkaDroplets.forEach(droplet => {
                this.ctx.beginPath();
                this.ctx.arc(this.x + droplet.x, this.y + droplet.y, droplet.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Communist symbols
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '16px Arial';
            this.communistSymbols.forEach(symbol => {
                this.ctx.fillText(symbol.symbol, this.x + symbol.x, this.y + symbol.y);
            });

            // Ushanka hat
            this.ctx.fillStyle = '#8B4513';
            this.ctx.beginPath();
            this.ctx.ellipse(this.x + this.width/2, this.y + 10, 25, 8, 0, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Olive oil shine
            this.oliveOil.forEach(oil => {
                this.ctx.fillStyle = oil.color;
                this.ctx.globalAlpha = 0.6;
                this.ctx.beginPath();
                this.ctx.arc(this.x + oil.x, this.y + oil.y, oil.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            this.ctx.globalAlpha = 1;

            // Spanish spices
            this.ctx.font = '12px Arial';
            this.spanishSpices.forEach(spice => {
                this.ctx.fillText(spice.spice, this.x + spice.x, this.y + spice.y);
            });

            // Matador cape
            this.ctx.fillStyle = '#DC143C';
            this.ctx.beginPath();
            this.ctx.ellipse(this.x + this.width/2, this.y + this.height - 10, 30, 12, 0, 0, Math.PI);
            this.ctx.fill();
        }
    }

    drawAttackEffect() {
        const attackX = this.x + (this.isRussian ? this.width : -35);
        const attackY = this.y + 20;
        
        if (this.isRussian) {
            // Weak Russian attack effect
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(attackX + 15, attackY + 15, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Pathetic sparks
            for (let i = 0; i < 6; i++) {
                this.ctx.fillStyle = `hsl(${40 + i * 10}, 80%, 60%)`;
                this.ctx.beginPath();
                this.ctx.arc(attackX + Math.random() * 25, attackY + Math.random() * 25, 
                           Math.random() * 3 + 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        } else {
            // Powerful Spanish attack effect
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(attackX + 15, attackY + 15, 25, 0, Math.PI * 2);
            this.ctx.fill();

            // Magnificent sparks
            for (let i = 0; i < 15; i++) {
                this.ctx.fillStyle = `hsl(${50 + i * 15}, 100%, 70%)`;
                this.ctx.beginPath();
                this.ctx.arc(attackX + Math.random() * 35, attackY + Math.random() * 35, 
                           Math.random() * 8 + 4, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Power rings
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 4;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.arc(attackX + 15, attackY + 15, 30 + i * 10, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }

    drawHitEffect() {
        const intensity = this.isRussian ? 0.8 : 0.4; // Russians take more visible damage
        
        this.ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.3})`;
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                        this.width/2, this.height/2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Blood splatter
        const splatCount = this.isRussian ? 20 : 10;
        for (let i = 0; i < splatCount; i++) {
            this.ctx.fillStyle = `hsl(${0 + i * 10}, 100%, ${60 - i * 2}%)`;
            this.ctx.globalAlpha = intensity;
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width/2 + (Math.random() - 0.5) * 80, 
                        this.y + this.height/2 + (Math.random() - 0.5) * 80, 
                        Math.random() * 6 + 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    drawEyelashes() {
        if (!this.isRussian) return; // Only Russian meat gets fabulous eyelashes
        
        // Basic eyelashes for now
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // Left eye lashes
        for (let i = 0; i < 6; i++) {
            const angle = -0.5 + (i - 3) * 0.2;
            const length = 8 + Math.random() * 4;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + 25, this.y + 22);
            this.ctx.lineTo(this.x + 25 + Math.sin(angle) * length, this.y + 22 - Math.cos(angle) * length);
            this.ctx.stroke();
        }
        
        // Right eye lashes
        for (let i = 0; i < 6; i++) {
            const angle = 0.5 + (i - 3) * 0.2;
            const length = 8 + Math.random() * 4;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + 55, this.y + 22);
            this.ctx.lineTo(this.x + 55 + Math.sin(angle) * length, this.y + 22 - Math.cos(angle) * length);
            this.ctx.stroke();
        }
    }
    
    drawCosmeticItems() {
        if (!this.isRussian) return; // Only Russian meat gets cosmetic items
        
        // Draw sexy legs
        if (this.cosmetics.sexyLegs) {
            this.ctx.fillStyle = '#FFB6C1';
            this.ctx.strokeStyle = '#FF69B4';
            this.ctx.lineWidth = 3;
            
            // Left leg
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + 25, this.y + this.height);
            this.ctx.lineTo(this.x + 20, this.y + this.height + 40);
            this.ctx.stroke();
            
            // Right leg  
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + 55, this.y + this.height);
            this.ctx.lineTo(this.x + 60, this.y + this.height + 40);
            this.ctx.stroke();
            
            // Leg shimmer effect
            if (Math.random() < 0.1) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.font = '8px Arial';
                this.ctx.fillText('✨', this.x + 15 + Math.random() * 50, this.y + this.height + 10 + Math.random() * 30);
            }
        }
        
        // Draw high heels
        if (this.cosmetics.highHeels || this.wearingHighHeels) {
            this.ctx.fillStyle = '#8B0000';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            
            // Left heel
            this.ctx.beginPath();
            this.ctx.ellipse(this.x + 18, this.y + this.height + 45, 6, 3, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Right heel
            this.ctx.beginPath();
            this.ctx.ellipse(this.x + 62, this.y + this.height + 45, 6, 3, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Draw backwards gun
        if (this.cosmetics.backwardsGun) {
            this.ctx.fillStyle = '#696969';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            
            // Gun pointing at self
            this.ctx.beginPath();
            this.ctx.rect(this.x + this.width/2 - 20, this.y + this.height/2, 15, 4);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Danger indicator
            this.ctx.fillStyle = '#FF0000';
            this.ctx.font = '8px Arial';
            this.ctx.fillText('⚠️', this.x + this.width/2 - 25, this.y + this.height/2 - 5);
        }
    }

    drawCrazyEffects() {
        if (this.isRussian) {
            // Draw snowflakes
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.snowflakes.forEach(flake => {
                flake.y += flake.speed;
                if (flake.y > this.height) flake.y = -5;
                
                this.ctx.save();
                this.ctx.translate(this.x + flake.x, this.y + flake.y);
                this.ctx.rotate(flake.angle);
                this.ctx.font = `${flake.size * 4}px Arial`;
                this.ctx.fillText('❄️', 0, 0);
                this.ctx.restore();
                
                flake.angle += 0.1;
            });
            
            // Draw tears when health is low
            if (this.hp < 30) {
                this.addTear();
                this.drawTears();
            }
        } else {
            // Draw flamenco flames
            this.flamencoFlames.forEach(flame => {
                flame.flicker += 0.3;
                const flickerHeight = flame.height + Math.sin(flame.flicker) * 5;
                
                this.ctx.fillStyle = `rgba(255, ${100 + flame.intensity * 100}, 0, ${flame.intensity})`;
                this.ctx.beginPath();
                this.ctx.ellipse(this.x + flame.x, this.y + flame.y, 3, flickerHeight, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.fillStyle = `rgba(255, 255, 0, ${flame.intensity * 0.7})`;
                this.ctx.beginPath();
                this.ctx.ellipse(this.x + flame.x, this.y + flame.y, 1.5, flickerHeight * 0.7, 0, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            // Draw victory aura when winning
            if (this.hp > 70) {
                this.drawVictoryAura();
            }
        }
        
        // Power level indicator
        if (this.crazyEffects.powerLevel > 9000) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 12px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`POWER: ${this.crazyEffects.powerLevel}!`, this.x + this.width/2, this.y - 40);
        }
    }

    addTear() {
        if (Math.random() < 0.1) {
            this.tears.push({
                x: this.x + 30 + Math.random() * 30,
                y: this.y + 35,
                vy: 2 + Math.random() * 2,
                life: 60
            });
            
            // Notify game about tear for achievement tracking
            if (window.__game && window.__game.achievements) {
                window.__game.achievements.onTearDropped();
            }
        }
    }

    drawTears() {
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.8)';
        this.tears.forEach((tear, index) => {
            tear.y += tear.vy;
            tear.life--;
            
            if (tear.life <= 0 || tear.y > this.y + this.height) {
                this.tears.splice(index, 1);
                return;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(tear.x, tear.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawVictoryAura() {
        const time = this.animationFrame * 0.1;
        for (let i = 0; i < 3; i++) {
            this.ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 - i * 0.1})`;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                        50 + i * 15 + Math.sin(time + i) * 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawTextBubbles() {
        this.crazyEffects.textBubbles.forEach((bubble, index) => {
            bubble.life--;
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;
            bubble.vy -= 0.1; // Gravity
            
            if (bubble.life <= 0) {
                this.crazyEffects.textBubbles.splice(index, 1);
                return;
            }
            
            const alpha = bubble.life / bubble.maxLife;
            this.ctx.fillStyle = bubble.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            this.ctx.font = 'bold 10px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(bubble.text, bubble.x, bubble.y);
        });
    }

    drawExplosions() {
        this.crazyEffects.explosions.forEach((explosion, index) => {
            explosion.life--;
            explosion.size = (1 - explosion.life / explosion.maxLife) * explosion.maxSize;
            
            if (explosion.life <= 0) {
                this.crazyEffects.explosions.splice(index, 1);
                return;
            }
            
            // Draw explosion ring
            const alpha = explosion.life / explosion.maxLife;
            this.ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Draw explosion particles
            explosion.particles.forEach((particle, pIndex) => {
                particle.life--;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.95;
                particle.vy *= 0.95;
                
                if (particle.life <= 0) {
                    explosion.particles.splice(pIndex, 1);
                    return;
                }
                
                const pAlpha = particle.life / 20;
                this.ctx.fillStyle = particle.color.replace(')', `, ${pAlpha})`).replace('hsl', 'hsla');
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            });
        });
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            particle.life -= 1;
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.4;
            particle.vx *= 0.97;
            
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / particle.maxLife;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawMeatInfo() {
        // Display meat type and characteristics
        this.ctx.fillStyle = this.isRussian ? '#FFD700' : '#8B0000';
        this.ctx.font = 'bold 10px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.meatType, this.x + this.width/2, this.y - 15);
        
        if (this.isRussian && this.hp < 30) {
            this.ctx.fillStyle = '#DC143C';
            this.ctx.fillText(this.defeatQuote, this.x + this.width/2, this.y + this.height + 20);
        } else if (!this.isRussian && this.hp > 70) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText(this.victoryQuote, this.x + this.width/2, this.y + this.height + 20);
        }
    }

    addParticle(x, y, color) {
        const particleCount = this.isRussian ? 3 : 6; // Spanish meat creates more particles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * (this.isRussian ? 6 : 10),
                vy: (Math.random() - 0.5) * (this.isRussian ? 6 : 10),
                color: color,
                size: Math.random() * (this.isRussian ? 4 : 8) + 3,
                life: this.isRussian ? 40 : 60,
                maxLife: this.isRussian ? 40 : 60
            });
        }
    }

    attack() {
        if (this.attackCooldown <= 0) {
            this.attacking = true;
            this.attackCooldown = this.isRussian ? 35 : 20; // Russian attacks are slower
            this.comboCount++;
            
            const attackX = this.x + (this.isRussian ? this.width : -15);
            const attackColor = this.isRussian ? '#FFFF00' : '#FFD700';
            
            this.addParticle(attackX, this.y + this.height/2, attackColor);
            
            return true;
        }
        return false;
    }

    takeDamage(damage) {
        // Apply defense multiplier
        const actualDamage = Math.floor(damage * (2 - this.defenseMultiplier));
        this.hp = Math.max(0, this.hp - actualDamage);
        this.hitCooldown = this.isRussian ? 20 : 12; // Russian meat stays hurt longer
        
        // Add damage particles
        const damageColor = this.isRussian ? '#8B0000' : '#DC143C';
        this.addParticle(this.x + this.width/2, this.y + this.height/2, damageColor);
        this.addParticle(this.x + this.width/2, this.y + this.height/2, '#FFE4B5');
        
        if (this.hp <= 0) {
            this.isDead = true;
            this.deathAnimation = 0;
        }
        
        return this.hp <= 0;
    }

    update() {
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            if (this.attackCooldown === 0) {
                this.attacking = false;
            }
        }
        
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
        }
        
        // Update particles
        this.particles.forEach(particle => {
            particle.life -= 1;
            particle.size *= 0.98;
        });
        
        this.animationFrame++;
        
        // Russian meat gets progressively weaker
        if (this.isRussian && this.hp < 50) {
            this.defenseMultiplier = Math.max(0.5, this.defenseMultiplier - 0.001);
        }
        
        // Spanish meat gets stronger as it wins
        if (!this.isRussian && this.hp > 70) {
            this.attackDamage = Math.min(35, this.attackDamage + 0.01);
        }
    }
}

export function createMockContext() {
    // Minimal mock 2D context for tests that don't render
    return {
        save() {},
        restore() {},
        fillStyle: '#000',
        strokeStyle: '#000',
        globalAlpha: 1,
        lineWidth: 1,
        beginPath() {},
        arc() {},
        ellipse() {},
        fill() {},
        stroke() {},
        moveTo() {},
        lineTo() {},
        fillRect() {},
        strokeRect() {},
        translate() {},
        rotate() {},
        font: '',
        textAlign: 'left',
        fillText() {}
    };
}
