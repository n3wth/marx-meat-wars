export class Marketplace {
    constructor() {
        this.currency = 'MARX COINS';
        this.playerCoins = 100; // Start with some coins
        this.purchasedItems = [];
        
        this.items = {
            // USELESS WEAPONS
            'backwards_gun': {
                id: 'backwards_gun',
                name: '🔫 BACKWARDS GUN',
                description: 'Shoots yourself instead of enemy! Instant death!',
                price: 50,
                category: 'weapons',
                effect: 'instant_suicide',
                effectDescription: 'Kills you immediately when used',
                marxPitch: 'MARX ENGINEERING: Revolutionary self-defeating technology!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I bought this and died instantly! 10/10!" - Former Russian Meat'
            },
            'rubber_sword': {
                id: 'rubber_sword',
                name: '⚔️ RUBBER SWORD',
                description: 'Bounces off enemies harmlessly! Does negative damage!',
                price: 30,
                category: 'weapons',
                effect: 'negative_damage',
                effectDescription: 'Heals enemies when you attack',
                marxPitch: 'MARX SAFETY: Child-friendly combat equipment!',
                purchased: false,
                usageCount: 0,
                testimonial: '"My attacks now heal Spanish meat!" - Confused Russian'
            },
            'invisible_shield': {
                id: 'invisible_shield',
                name: '🛡️ INVISIBLE SHIELD',
                description: 'So invisible it doesn\'t exist! Provides no protection!',
                price: 75,
                category: 'defense',
                effect: 'no_effect',
                effectDescription: 'Does absolutely nothing',
                marxPitch: 'MARX OPTICS: Advanced invisibility technology!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I can\'t see it... because it\'s not there!" - Blind Russian'
            },
            
            // COSMETIC "UPGRADES"
            'sexy_legs': {
                id: 'sexy_legs',
                name: '🦵 SEXY LEGS',
                description: 'Fabulous legs that distract you from fighting!',
                price: 80,
                category: 'cosmetic',
                effect: 'distraction',
                effectDescription: 'Reduces attack accuracy by 50%',
                marxPitch: 'MARX FASHION: Beauty over function!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I keep looking at my own legs instead of fighting!" - Distracted Russian'
            },
            'high_heels': {
                id: 'high_heels',
                name: '👠 HIGH HEELS',
                description: 'Stylish heels that make you slower and clumsier!',
                price: 60,
                category: 'cosmetic',
                effect: 'slower_movement',
                effectDescription: 'Reduces movement speed by 70%',
                marxPitch: 'MARX STYLE: Fashion-forward defeat!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I fall over constantly now!" - Wobbly Russian'
            },
            'makeup_kit': {
                id: 'makeup_kit',
                name: '💄 COMBAT MAKEUP KIT',
                description: 'Spend time applying makeup instead of fighting!',
                price: 40,
                category: 'cosmetic',
                effect: 'makeup_breaks',
                effectDescription: 'Randomly stops to apply makeup mid-combat',
                marxPitch: 'MARX BEAUTY: Look good while losing!',
                purchased: false,
                usageCount: 0,
                testimonial: '"My lipstick is perfect but I\'m dead!" - Glamorous Russian'
            },
            
            // FAKE UPGRADES
            'strength_potion': {
                id: 'strength_potion',
                name: '💪 STRENGTH POTION',
                description: 'Increases strength! (Actually decreases it)',
                price: 90,
                category: 'potions',
                effect: 'fake_strength',
                effectDescription: 'Reduces damage by 50% (opposite of description)',
                marxPitch: 'MARX CHEMISTRY: Advanced reverse psychology!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I feel stronger but hit like a feather!" - Confused Russian'
            },
            'speed_boots': {
                id: 'speed_boots',
                name: '👢 SPEED BOOTS',
                description: 'Run faster! (Actually run backwards)',
                price: 70,
                category: 'equipment',
                effect: 'backwards_movement',
                effectDescription: 'All movement inputs are reversed',
                marxPitch: 'MARX LOCOMOTION: Innovative directional technology!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I wanted to go left but went right into Spanish meat!" - Lost Russian'
            },
            'lucky_charm': {
                id: 'lucky_charm',
                name: '🍀 LUCKY CHARM',
                description: 'Increases luck! (Gives you bad luck)',
                price: 55,
                category: 'accessories',
                effect: 'bad_luck',
                effectDescription: 'Increases chance of missing attacks by 30%',
                marxPitch: 'MARX PROBABILITY: Reverse fortune technology!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I\'ve never been so unlucky!" - Cursed Russian'
            },
            
            // PREMIUM SPANISH ITEMS (Work perfectly but for Spanish meat)
            'spanish_power_up': {
                id: 'spanish_power_up',
                name: '🇪🇸 SPANISH POWER BOOST',
                description: 'Boosts Spanish meat power! (Not yours)',
                price: 120,
                category: 'premium',
                effect: 'boost_enemy',
                effectDescription: 'Makes Spanish meat 50% stronger',
                marxPitch: 'MARX LOGIC: Support the winning team!',
                purchased: false,
                usageCount: 0,
                testimonial: '"I paid to make my enemy stronger!" - Generous Russian'
            },
            'spanish_healing': {
                id: 'spanish_healing',
                name: '❤️ SPANISH MEAT HEALING',
                description: 'Heals Spanish meat to full health!',
                price: 100,
                category: 'premium',
                effect: 'heal_enemy',
                effectDescription: 'Restores Spanish meat to 100% HP',
                marxPitch: 'MARX HEALTHCARE: Premium enemy care!',
                purchased: false,
                usageCount: 0,
                testimonial: '"Best investment ever!" - Spanish Meat (5 stars)'
            }
        };
        
        this.loadProgress();
    }
    
    buyItem(itemId) {
        const item = this.items[itemId];
        if (!item || item.purchased) return { success: false, reason: 'Item not available' };
        
        if (this.playerCoins < item.price) {
            return { success: false, reason: 'Insufficient MARX COINS' };
        }
        
        this.playerCoins -= item.price;
        item.purchased = true;
        item.purchasedAt = Date.now();
        this.purchasedItems.push(itemId);
        
        this.saveProgress();
        
        return { 
            success: true, 
            item: item,
            message: `${item.name} purchased! ${item.marxPitch}`
        };
    }
    
    useItem(itemId, game) {
        const item = this.items[itemId];
        if (!item || !item.purchased) return false;
        
        item.usageCount++;
        
        // Apply the hilariously counterproductive effects
        switch(item.effect) {
            case 'instant_suicide':
                game.russianMeat.hp = 0;
                game.russianMeat.isDead = true;
                game.russianMeat.addTextBubble('I SHOT MYSELF!', '#FF0000');
                game.russianMeat.addExplosion(game.russianMeat.x + game.russianMeat.width/2, 
                                            game.russianMeat.y + game.russianMeat.height/2, 3);
                if (game.commentary) {
                    game.commentary.addCommentary('russian_hit', { damage: 100 });
                }
                break;
                
            case 'negative_damage':
                game.russianMeat.healingMode = true;
                setTimeout(() => { game.russianMeat.healingMode = false; }, 10000);
                break;
                
            case 'distraction':
                game.russianMeat.distractedByLegs = true;
                game.russianMeat.addTextBubble('SO SEXY!', '#FF69B4');
                setTimeout(() => { game.russianMeat.distractedByLegs = false; }, 15000);
                break;
                
            case 'slower_movement':
                game.playerSpeed *= 0.3;
                game.russianMeat.addTextBubble('FABULOUS BUT SLOW!', '#FF1493');
                break;
                
            case 'makeup_breaks':
                game.russianMeat.makeupMode = true;
                setTimeout(() => { game.russianMeat.makeupMode = false; }, 20000);
                break;
                
            case 'fake_strength':
                game.currentRussianDamage *= 0.5;
                game.russianMeat.addTextBubble('FEELING STRONG!', '#00FF00');
                break;
                
            case 'backwards_movement':
                game.reversedControls = true;
                game.russianMeat.addTextBubble('WHICH WAY?!', '#FFFF00');
                setTimeout(() => { game.reversedControls = false; }, 30000);
                break;
                
            case 'bad_luck':
                game.russianMeat.badLuck = true;
                game.russianMeat.addTextBubble('FEELING UNLUCKY!', '#800080');
                break;
                
            case 'boost_enemy':
                game.currentSpanishDamage *= 1.5;
                game.spanishMeat.addTextBubble('¡GRACIAS!', '#FFD700');
                game.spanishMeat.activateRainbow();
                break;
                
            case 'heal_enemy':
                game.spanishMeat.hp = 100;
                game.spanishMeat.addTextBubble('¡PERFECTO!', '#00FF00');
                game.spanishMeat.activatePulsing();
                break;
        }
        
        this.saveProgress();
        return true;
    }
    
    earnCoins(amount, reason = 'defeat') {
        this.playerCoins += amount;
        
        // MARX FOODSERVICE gives coins for losing (of course)
        const bonusReasons = {
            'defeat': 'MARX SYMPATHY BONUS',
            'pathetic_attack': 'MARX PITY COINS',
            'getting_hit': 'MARX PAIN COMPENSATION',
            'crying': 'MARX TEAR COLLECTION BONUS',
            'morale_low': 'MARX DEPRESSION SUPPORT'
        };
        
        return {
            amount: amount,
            reason: bonusReasons[reason] || 'MARX GENEROSITY',
            newTotal: this.playerCoins
        };
    }
    
    getAvailableItems() {
        return Object.values(this.items).filter(item => !item.purchased);
    }
    
    getPurchasedItems() {
        return Object.values(this.items).filter(item => item.purchased);
    }
    
    getItemsByCategory(category) {
        return Object.values(this.items).filter(item => item.category === category);
    }
    
    canAfford(itemId) {
        const item = this.items[itemId];
        return item && this.playerCoins >= item.price && !item.purchased;
    }
    
    getMarketplaceStats() {
        const totalItems = Object.keys(this.items).length;
        const purchasedCount = this.purchasedItems.length;
        const totalSpent = Object.values(this.items)
            .filter(item => item.purchased)
            .reduce((sum, item) => sum + item.price, 0);
            
        return {
            totalItems,
            purchasedCount,
            totalSpent,
            currentCoins: this.playerCoins,
            completionPercentage: Math.floor((purchasedCount / totalItems) * 100)
        };
    }
    
    saveProgress() {
        try {
            const saveData = {
                playerCoins: this.playerCoins,
                purchasedItems: this.purchasedItems,
                items: {}
            };
            
            // Save item states
            Object.keys(this.items).forEach(id => {
                if (this.items[id].purchased) {
                    saveData.items[id] = {
                        purchased: true,
                        purchasedAt: this.items[id].purchasedAt,
                        usageCount: this.items[id].usageCount
                    };
                }
            });
            
            localStorage.setItem('marxMeatWarsMarketplace', JSON.stringify(saveData));
        } catch (e) {
            console.warn('Could not save marketplace data:', e);
        }
    }
    
    loadProgress() {
        try {
            const saveData = localStorage.getItem('marxMeatWarsMarketplace');
            if (saveData) {
                const data = JSON.parse(saveData);
                
                this.playerCoins = data.playerCoins || 100;
                this.purchasedItems = data.purchasedItems || [];
                
                // Restore item states
                if (data.items) {
                    Object.keys(data.items).forEach(id => {
                        if (this.items[id]) {
                            this.items[id].purchased = true;
                            this.items[id].purchasedAt = data.items[id].purchasedAt;
                            this.items[id].usageCount = data.items[id].usageCount || 0;
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('Could not load marketplace data:', e);
        }
    }
    
    reset() {
        this.playerCoins = 100;
        this.purchasedItems = [];
        
        Object.values(this.items).forEach(item => {
            item.purchased = false;
            item.usageCount = 0;
            delete item.purchasedAt;
        });
        
        this.saveProgress();
    }
    
    // Special promotional offers
    getRandomPromotion() {
        const promos = [
            "🎉 MARX SPECIAL: Buy any weapon and get disappointment FREE!",
            "💥 LIMITED TIME: All items guaranteed to backfire!",
            "🎊 FLASH SALE: 0% off everything! (Still overpriced)",
            "⚡ MEGA DEAL: Buy backwards gun, get instant regret!",
            "🌟 PREMIUM OFFER: Sexy legs + high heels combo for maximum failure!",
            "🎁 BONUS: Purchase 3 items and Spanish meat gets stronger!",
            "💎 EXCLUSIVE: Items so bad they're good... at making you lose!",
            "🔥 HOT DEAL: Everything designed to help Spanish meat win!"
        ];
        
        return promos[Math.floor(Math.random() * promos.length)];
    }
    
    getMarxSalesmanQuote() {
        const quotes = [
            "Welcome to MARX MARKETPLACE! Where Russian dreams go to die!",
            "Our products are guaranteed to make you lose faster!",
            "Quality items designed by Spanish meat, for Spanish meat victories!",
            "Every purchase comes with a free lesson in futility!",
            "Why win when you can lose in style?",
            "MARX GUARANTEE: 100% satisfaction for Spanish customers!",
            "Our motto: Making Russians regret their purchases since today!",
            "Premium quality items that work exactly as intended... against you!"
        ];
        
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}
