export class Achievements {
    constructor() {
        this.achievements = {
            // Defeat-related achievements
            'speed_loser': {
                id: 'speed_loser',
                name: '⚡ SPEEDRUN DEFEAT',
                description: 'Lose in under 30 seconds',
                icon: '💨',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'common',
                marxQuote: 'MARX FOODSERVICE: Even faster than expected!'
            },
            'pathetic_fighter': {
                id: 'pathetic_fighter',
                name: '👊 MOST PATHETIC FIGHTER',
                description: 'Miss 10 attacks in a row',
                icon: '🤡',
                unlocked: false,
                progress: 0,
                target: 10,
                rarity: 'uncommon',
                marxQuote: 'MARX ANALYTICS: Accuracy = 0%'
            },
            'inevitable_destiny': {
                id: 'inevitable_destiny',
                name: '🔄 INEVITABLE DESTINY',
                description: 'Lose 50 games in a row',
                icon: '♾️',
                unlocked: false,
                progress: 0,
                target: 50,
                rarity: 'legendary',
                marxQuote: 'MARX FOODSERVICE: Consistency is key!'
            },
            'damage_sponge': {
                id: 'damage_sponge',
                name: '🧽 ULTIMATE DAMAGE SPONGE',
                description: 'Take 1000+ total damage in one game',
                icon: '💔',
                unlocked: false,
                progress: 0,
                target: 1000,
                rarity: 'rare',
                marxQuote: 'MARX QUALITY: Built to absorb punishment!'
            },
            'no_damage_dealer': {
                id: 'no_damage_dealer',
                name: '🚫 PACIFIST MEAT',
                description: 'Complete a game without dealing any damage',
                icon: '☮️',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'uncommon',
                marxQuote: 'MARX PHILOSOPHY: Violence is not the answer!'
            },
            
            // MARX-related achievements
            'marx_loyalist': {
                id: 'marx_loyalist',
                name: '🏭 MARX LOYALIST',
                description: 'Click the MARX logo 100 times',
                icon: '🎯',
                unlocked: false,
                progress: 0,
                target: 100,
                rarity: 'rare',
                marxQuote: 'MARX APPRECIATION: Customer loyalty rewarded!'
            },
            'easter_egg_hunter': {
                id: 'easter_egg_hunter',
                name: '🥚 ULTIMATE MARX POWER',
                description: 'Activate the ultimate MARX easter egg',
                icon: '💥',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'legendary',
                marxQuote: 'MARX SECRET: You found our hidden power!'
            },
            
            // Combat style achievements
            'spinning_failure': {
                id: 'spinning_failure',
                name: '🌪️ SPINNING INTO DEFEAT',
                description: 'Lose while spinning from desperation',
                icon: '🌀',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'uncommon',
                marxQuote: 'MARX PHYSICS: Rotation does not equal victory!'
            },
            'combo_failure': {
                id: 'combo_failure',
                name: '🔢 COMBO MASTER... OF FAILURE',
                description: 'Achieve a 10+ hit combo that does no damage',
                icon: '🎭',
                unlocked: false,
                progress: 0,
                target: 10,
                rarity: 'rare',
                marxQuote: 'MARX MATHEMATICS: 10 × 0 = Still 0!'
            },
            'tear_factory': {
                id: 'tear_factory',
                name: '💧 TEAR FACTORY',
                description: 'Cry 100 tears during combat',
                icon: '😭',
                unlocked: false,
                progress: 0,
                target: 100,
                rarity: 'common',
                marxQuote: 'MARX HYDRATION: Premium Russian tears!'
            },
            
            // Morale-related achievements  
            'rock_bottom': {
                id: 'rock_bottom',
                name: '⬇️ ROCK BOTTOM MORALE',
                description: 'Reach 5% morale or lower',
                icon: '📉',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'common',
                marxQuote: 'MARX PSYCHOLOGY: Morale is overrated!'
            },
            'defeatist_master': {
                id: 'defeatist_master',
                name: '😔 MASTER OF DEFEATISM',
                description: 'Reach maximum defeatism level',
                icon: '🏳️',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'rare',
                marxQuote: 'MARX WISDOM: Acceptance is the first step!'
            },
            
            // Spanish meat related achievements
            'spanish_fan': {
                id: 'spanish_fan',
                name: '🇪🇸 SPANISH MEAT APPRECIATOR',
                description: 'Watch Spanish meat win 25 times',
                icon: '👏',
                unlocked: false,
                progress: 0,
                target: 25,
                rarity: 'uncommon',
                marxQuote: 'MARX EDUCATION: Learning from the best!'
            },
            'power_level_witness': {
                id: 'power_level_witness',
                name: '⚡ WITNESS TO POWER',
                description: 'See Spanish meat reach power level 9001',
                icon: '🔥',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'legendary',
                marxQuote: 'MARX SCIENCE: Power levels are real!'
            },
            
            // Time-based achievements
            'persistent_loser': {
                id: 'persistent_loser',
                name: '⏰ PERSISTENT LOSER',
                description: 'Play for 30+ minutes straight',
                icon: '🕐',
                unlocked: false,
                progress: 0,
                target: 1800, // 30 minutes in seconds
                rarity: 'rare',
                marxQuote: 'MARX DEDICATION: Commitment to failure!'
            },
            'midnight_meat_warrior': {
                id: 'midnight_meat_warrior',
                name: '🌙 MIDNIGHT MEAT WARRIOR',
                description: 'Fight at midnight (00:00)',
                icon: '🦇',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'rare',
                marxQuote: 'MARX SCHEDULE: 24/7 meat availability!'
            },
            
            // Special combo achievements
            'perfect_failure': {
                id: 'perfect_failure',
                name: '💯 PERFECT FAILURE',
                description: 'Lose all 3 rounds without dealing any damage',
                icon: '🎖️',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'legendary',
                marxQuote: 'MARX PERFECTION: Flawlessly imperfect!'
            },
            'communist_pride': {
                id: 'communist_pride',
                name: '🚩 COMMUNIST PRIDE',
                description: 'Lose while maintaining dignity (somehow)',
                icon: '⭐',
                unlocked: false,
                progress: 0,
                target: 1,
                rarity: 'mythical',
                marxQuote: 'MARX RESPECT: Honor in defeat!'
            }
        };
        
        this.recentUnlocks = [];
        this.totalScore = 0;
        this.sessionStats = {
            gamesPlayed: 0,
            totalDamageTaken: 0,
            totalDamageDealt: 0,
            consecutiveLosses: 0,
            consecutiveMisses: 0,
            sessionStartTime: Date.now(),
            marxClicks: 0,
            tears: 0,
            lowestMorale: 100,
            highestDefeatism: 0
        };
        
        this.loadProgress();
    }
    
    checkAchievement(achievementId, value = 1) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return false;
        
        achievement.progress += value;
        
        if (achievement.progress >= achievement.target) {
            this.unlockAchievement(achievementId);
            return true;
        }
        
        return false;
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;
        
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        
        this.recentUnlocks.push({
            ...achievement,
            timestamp: Date.now()
        });
        
        // Keep only recent unlocks
        if (this.recentUnlocks.length > 5) {
            this.recentUnlocks = this.recentUnlocks.slice(-5);
        }
        
        this.calculateScore();
        this.saveProgress();
        
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
    }
    
    updateSessionStats(statName, value) {
        if (this.sessionStats.hasOwnProperty(statName)) {
            if (statName === 'lowestMorale') {
                this.sessionStats[statName] = Math.min(this.sessionStats[statName], value);
            } else if (statName === 'highestDefeatism') {
                this.sessionStats[statName] = Math.max(this.sessionStats[statName], value);
            } else {
                this.sessionStats[statName] += value;
            }
        }
    }
    
    // Check for achievement triggers based on game events
    onGameStart() {
        this.sessionStats.gamesPlayed++;
        
        // Check midnight warrior
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            this.checkAchievement('midnight_meat_warrior');
        }
    }
    
    onGameEnd(gameData) {
        this.sessionStats.consecutiveLosses++;
        this.sessionStats.totalDamageTaken += gameData.damageTaken || 0;
        this.sessionStats.totalDamageDealt += gameData.damageDealt || 0;
        
        // Check various achievements
        if (gameData.gameTime < 30) {
            this.checkAchievement('speed_loser');
        }
        
        if (gameData.damageTaken >= 1000) {
            this.checkAchievement('damage_sponge');
        }
        
        if (gameData.damageDealt === 0) {
            this.checkAchievement('no_damage_dealer');
        }
        
        if (gameData.rounds === 3 && gameData.damageDealt === 0) {
            this.checkAchievement('perfect_failure');
        }
        
        this.checkAchievement('inevitable_destiny');
        this.checkAchievement('spanish_fan');
        
        // Check session time
        const sessionTime = (Date.now() - this.sessionStats.sessionStartTime) / 1000;
        if (sessionTime >= 1800) {
            this.checkAchievement('persistent_loser');
        }
    }
    
    onRussianAttack(hit) {
        if (!hit) {
            this.sessionStats.consecutiveMisses++;
            this.checkAchievement('pathetic_fighter', 1);
        } else {
            this.sessionStats.consecutiveMisses = 0;
        }
    }
    
    onMoraleChange(morale) {
        this.updateSessionStats('lowestMorale', morale);
        if (morale <= 5) {
            this.checkAchievement('rock_bottom');
        }
    }
    
    onDefeatismChange(defeatism) {
        this.updateSessionStats('highestDefeatism', defeatism);
        if (defeatism >= 1.0) {
            this.checkAchievement('defeatist_master');
        }
    }
    
    onSpanishPowerLevel(powerLevel) {
        if (powerLevel >= 9001) {
            this.checkAchievement('power_level_witness');
        }
    }
    
    onMarxClick() {
        this.sessionStats.marxClicks++;
        this.checkAchievement('marx_loyalist', 1);
    }
    
    onEasterEggActivated() {
        this.checkAchievement('easter_egg_hunter');
    }
    
    onTearDropped() {
        this.sessionStats.tears++;
        this.checkAchievement('tear_factory', 1);
    }
    
    onSpinningDefeat() {
        this.checkAchievement('spinning_failure');
    }
    
    calculateScore() {
        this.totalScore = 0;
        const rarityPoints = {
            'common': 10,
            'uncommon': 25,
            'rare': 50,
            'legendary': 100,
            'mythical': 200
        };
        
        Object.values(this.achievements).forEach(achievement => {
            if (achievement.unlocked) {
                this.totalScore += rarityPoints[achievement.rarity] || 10;
            }
        });
    }
    
    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }
    
    getRecentUnlocks() {
        return this.recentUnlocks.filter(unlock => 
            Date.now() - unlock.timestamp < 300000 // Last 5 minutes
        );
    }
    
    getProgressSummary() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.getUnlockedAchievements().length;
        return {
            unlocked,
            total,
            percentage: Math.floor((unlocked / total) * 100),
            score: this.totalScore
        };
    }
    
    saveProgress() {
        try {
            const saveData = {
                achievements: {},
                sessionStats: this.sessionStats,
                totalScore: this.totalScore
            };
            
            // Only save unlocked achievements
            Object.keys(this.achievements).forEach(id => {
                if (this.achievements[id].unlocked) {
                    saveData.achievements[id] = {
                        unlocked: true,
                        unlockedAt: this.achievements[id].unlockedAt
                    };
                }
            });
            
            localStorage.setItem('marxMeatWarsAchievements', JSON.stringify(saveData));
        } catch (e) {
            console.warn('Could not save achievements:', e);
        }
    }
    
    loadProgress() {
        try {
            const saveData = localStorage.getItem('marxMeatWarsAchievements');
            if (saveData) {
                const data = JSON.parse(saveData);
                
                // Restore unlocked achievements
                if (data.achievements) {
                    Object.keys(data.achievements).forEach(id => {
                        if (this.achievements[id]) {
                            this.achievements[id].unlocked = true;
                            this.achievements[id].unlockedAt = data.achievements[id].unlockedAt;
                        }
                    });
                }
                
                // Restore session stats
                if (data.sessionStats) {
                    this.sessionStats = { ...this.sessionStats, ...data.sessionStats };
                }
                
                this.totalScore = data.totalScore || 0;
                this.calculateScore();
            }
        } catch (e) {
            console.warn('Could not load achievements:', e);
        }
    }
    
    reset() {
        Object.values(this.achievements).forEach(achievement => {
            achievement.unlocked = false;
            achievement.progress = 0;
            delete achievement.unlockedAt;
        });
        
        this.recentUnlocks = [];
        this.totalScore = 0;
        this.sessionStats = {
            gamesPlayed: 0,
            totalDamageTaken: 0,
            totalDamageDealt: 0,
            consecutiveLosses: 0,
            consecutiveMisses: 0,
            sessionStartTime: Date.now(),
            marxClicks: 0,
            tears: 0,
            lowestMorale: 100,
            highestDefeatism: 0
        };
        
        this.saveProgress();
    }
}
