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
        } else {
            this.oliveOil = this.generateOliveOil();
            this.spanishSpices = this.generateSpanishSpices();
        }
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

    draw() {
        this.ctx.save();
        
        // Apply defeat animation for Russian meat
        if (this.isRussian && this.hp < 50) {
            this.ctx.globalAlpha = 0.7 + Math.sin(this.animationFrame * 0.1) * 0.2;
        }
        
        this.drawMeatBody();
        this.drawMeatDetails();
        this.drawNationalityFeatures();
        
        if (this.attacking) {
            this.drawAttackEffect();
        }
        if (this.hitCooldown > 0) {
            this.drawHitEffect();
        }
        
        this.drawParticles();
        this.drawMeatInfo();
        
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
