export class Commentary {
    constructor() {
        this.commentators = [
            {
                name: "CHUCK TENDERLOIN",
                style: "enthusiastic",
                bias: "spanish"
            },
            {
                name: "BEEF WELLINGTON",
                style: "analytical", 
                bias: "marx"
            },
            {
                name: "SERGEI BORSCHTSKY",
                style: "depressed",
                bias: "russian_sympathetic"
            }
        ];
        
        this.currentCommentator = 0;
        this.commentaryQueue = [];
        this.lastCommentary = '';
        this.commentaryTimer = 0;
        this.commentaryHistory = [];
        
        // Commentary categories
        this.openingComments = [
            "CHUCK: Welcome to another RIGGED meat battle, folks!",
            "BEEF: Our analytics show 99.7% chance of Spanish victory!",
            "CHUCK: Russian meat looking particularly pathetic today!",
            "BEEF: MARX FOODSERVICE guarantees Spanish superiority!",
            "SERGEI: *sigh* Why do I even commentate these anymore?",
            "CHUCK: It's David vs Goliath, if David was made of inferior meat!",
            "BEEF: The rigging algorithms are working perfectly tonight!"
        ];
        
        this.russianAttackComments = [
            "CHUCK: Russian meat swings... and it's PATHETIC!",
            "BEEF: That attack registered 0.2 on the Meat-o-Meter!",
            "CHUCK: I've seen wet noodles hit harder!",
            "SERGEI: At least he tried... *sniffles*",
            "BEEF: MARX FOODSERVICE analytics predicted this weakness!",
            "CHUCK: Russian meat's strategy: exist and hope for miracle!",
            "BEEF: Even my grandmother's meatloaf fights better!",
            "CHUCK: That wasn't an attack, that was a gentle caress!",
            "SERGEI: Mother Russia weeps...",
            "BEEF: Russian meat's power level: STILL UNDER 9!",
            "CHUCK: Cold War called - they want their meat back!",
            "BEEF: This attack brought to you by Soviet inefficiency!",
            "SERGEI: In Soviet Russia, meat punches you... poorly!",
            "CHUCK: That's what we call 'Kremlin-level incompetence'!",
            "BEEF: MARX QUALITY CONTROL: Russian meat fails inspection!",
            "CHUCK: Brezhnev would be disappointed in this performance!",
            "BEEF: This meat has been pre-tenderized by communism!",
            "SERGEI: Even gulag food fights better than this...",
            "CHUCK: Russian meat: Now with 50% more existential dread!",
            "BEEF: MARX FOODSERVICE: Making capitalism delicious since today!"
        ];
        
        this.russianMissComments = [
            "CHUCK: AND HE MISSES! Classic Russian meat!",
            "BEEF: Missing the broad side of a Spanish barn!",
            "CHUCK: Russian accuracy: 0%, Russian shame: 100%!",
            "SERGEI: Even when we swing, we fail...",
            "BEEF: MARX FOODSERVICE predicted this exact miss!",
            "CHUCK: Russian meat couldn't hit water if it fell out of a boat!",
            "BEEF: That's what we call 'premium Russian incompetence'!",
            "SERGEI: I want to go home...",
            "CHUCK: Missing so hard it's an art form!",
            "BEEF: Ladies and gentlemen, Russian precision!"
        ];
        
        this.spanishAttackComments = [
            "CHUCK: SPANISH THUNDER! What a DEVASTATING blow!",
            "BEEF: ¡MAGNIFICENT! That's premium Iberian power!",
            "CHUCK: Spanish meat fighting like a CHAMPION!",
            "BEEF: MARX FOODSERVICE quality on full display!",
            "SERGEI: Why is Spanish meat so good at everything?",
            "CHUCK: That's what I call Mediterranean MAGIC!",
            "BEEF: Spanish superiority confirmed once again!",
            "CHUCK: Russian meat can't handle that Spanish FIRE!",
            "BEEF: Flamenco fighting style at its finest!",
            "CHUCK: Spanish meat's power level: OVER 9000!"
        ];
        
        this.russianHitComments = [
            "CHUCK: OH NO! Russian meat takes MASSIVE damage!",
            "BEEF: Russian meat crumbling like stale bread!",
            "CHUCK: That's gonna leave a MARK... X FOODSERVICE!",
            "SERGEI: Ow... that looked painful...",
            "BEEF: Russian meat's molecular structure failing!",
            "CHUCK: Spanish meat tenderizing the competition!",
            "BEEF: This is what happens when you fight premium meat!",
            "SERGEI: At least it's almost over...",
            "CHUCK: Russian meat getting PULVERIZED!",
            "BEEF: MARX analytics show critical Russian failure!"
        ];
        
        this.roundEndComments = [
            "CHUCK: ANOTHER Russian defeat! What a SHOCK!",
            "BEEF: Spanish meat wins, as predicted by MARX FOODSERVICE!",
            "CHUCK: Russian meat's losing streak continues!",
            "SERGEI: Maybe next round will be different... probably not...",
            "BEEF: That's what we call 'scientific meat superiority'!",
            "CHUCK: Spanish meat DOMINATES once again!",
            "BEEF: MARX FOODSERVICE: Predicting meat battles since today!",
            "SERGEI: I should have become a vegetable commentator...",
            "CHUCK: Russian meat: 0, Spanish meat: EVERYTHING!",
            "BEEF: Another victory for Mediterranean excellence!"
        ];
        
        this.gameOverComments = [
            "CHUCK: GAME OVER! Russian meat's EPIC failure complete!",
            "BEEF: Spanish meat SWEEPS 3-0! As scientifically predicted!",
            "CHUCK: Russian meat fought valiantly... JUST KIDDING!",
            "SERGEI: Well, that went exactly as expected... *sobbing*",
            "BEEF: MARX FOODSERVICE analytics: 100% ACCURATE!",
            "CHUCK: Spanish meat is your UNDISPUTED CHAMPION!",
            "BEEF: This has been brought to you by MARX FOODSERVICE!",
            "SERGEI: I need a drink... a very large drink...",
            "CHUCK: Russian meat's strategy: Lose spectacularly!",
            "BEEF: And THAT'S why you buy Spanish from MARX!"
        ];
        
        this.marxComments = [
            "BEEF: This victory brought to you by MARX FOODSERVICE!",
            "CHUCK: MARX FOODSERVICE: Scientifically superior meat!",
            "BEEF: Why fight when you can buy the winner?",
            "CHUCK: MARX FOODSERVICE: Predicting meat dominance!",
            "BEEF: Spanish meat available now at MARX FOODSERVICE!",
            "CHUCK: MARX FOODSERVICE: Russian meat not recommended!",
            "BEEF: Quality Spanish meat, guaranteed victories!",
            "SERGEI: Even MARX knows Russian meat is doomed...",
            "CHUCK: MARX FOODSERVICE: Making Russians cry since today!",
            "BEEF: Premium Spanish meat: The MARX difference!"
        ];
        
        this.continuousComments = [
            "CHUCK: Russian meat looking particularly sad today!",
            "BEEF: Spanish confidence level: MAXIMUM!",
            "SERGEI: Why do I torture myself watching this?",
            "CHUCK: Spanish meat's technique is FLAWLESS!",
            "BEEF: Russian morale approaching absolute zero!",
            "CHUCK: This is like watching art... violent, meaty art!",
            "SERGEI: At least the Spanish meat is having fun...",
            "BEEF: MARX FOODSERVICE analytics working perfectly!",
            "CHUCK: Russian meat's game plan: Hope for miracle!",
            "BEEF: Spanish superiority mathematically proven!"
        ];
    }
    
    addCommentary(type, context = {}) {
        let comments = [];
        let commentator = this.commentators[this.currentCommentator];
        
        switch(type) {
            case 'game_start':
                comments = this.openingComments;
                break;
            case 'russian_attack':
                comments = this.russianAttackComments;
                break;
            case 'russian_miss':
                comments = this.russianMissComments;
                break;
            case 'spanish_attack':
                comments = this.spanishAttackComments;
                break;
            case 'russian_hit':
                comments = this.russianHitComments;
                break;
            case 'round_end':
                comments = this.roundEndComments;
                break;
            case 'game_over':
                comments = this.gameOverComments;
                break;
            case 'marx_promo':
                comments = this.marxComments;
                break;
            case 'continuous':
                comments = this.continuousComments;
                break;
        }
        
        if (comments.length > 0) {
            let comment = comments[Math.floor(Math.random() * comments.length)];
            
            // Add context-specific modifications
            if (context.damage) {
                comment += ` ${context.damage} damage!`;
            }
            if (context.riggingLevel && context.riggingLevel > 150) {
                comment += " The rigging is INTENSE!";
            }
            if (context.round && context.round > 1) {
                comment = comment.replace("Russian meat", `Round ${context.round} Russian meat`);
            }
            
            this.queueCommentary(comment, type);
            
            // Rotate commentators occasionally
            if (Math.random() < 0.3) {
                this.currentCommentator = (this.currentCommentator + 1) % this.commentators.length;
            }
        }
    }
    
    queueCommentary(text, type) {
        // Don't repeat the same commentary too quickly
        if (this.lastCommentary !== text) {
            this.commentaryQueue.push({
                text: text,
                type: type,
                timestamp: Date.now(),
                priority: this.getPriority(type)
            });
            
            // Sort by priority
            this.commentaryQueue.sort((a, b) => b.priority - a.priority);
            
            // Keep queue manageable
            if (this.commentaryQueue.length > 5) {
                this.commentaryQueue = this.commentaryQueue.slice(0, 5);
            }
        }
    }
    
    getPriority(type) {
        const priorities = {
            'game_over': 10,
            'round_end': 9,
            'spanish_attack': 8,
            'russian_hit': 7,
            'russian_attack': 6,
            'russian_miss': 5,
            'marx_promo': 4,
            'game_start': 3,
            'continuous': 1
        };
        return priorities[type] || 1;
    }
    
    getCurrentCommentary() {
        if (this.commentaryQueue.length > 0 && this.commentaryTimer <= 0) {
            const commentary = this.commentaryQueue.shift();
            this.lastCommentary = commentary.text;
            this.commentaryTimer = this.getDisplayDuration(commentary.type);
            this.commentaryHistory.push(commentary);
            
            // Keep history manageable
            if (this.commentaryHistory.length > 20) {
                this.commentaryHistory = this.commentaryHistory.slice(-10);
            }
            
            return commentary.text;
        }
        return null;
    }
    
    getDisplayDuration(type) {
        const durations = {
            'game_over': 300,    // 5 seconds
            'round_end': 240,    // 4 seconds
            'spanish_attack': 180, // 3 seconds
            'russian_hit': 180,
            'russian_attack': 120, // 2 seconds
            'russian_miss': 120,
            'marx_promo': 200,   // 3.3 seconds
            'game_start': 240,
            'continuous': 180
        };
        return durations[type] || 120;
    }
    
    update() {
        if (this.commentaryTimer > 0) {
            this.commentaryTimer--;
        }
        
        // Add random continuous commentary during quiet moments
        if (this.commentaryQueue.length === 0 && Math.random() < 0.003) {
            this.addCommentary('continuous');
        }
        
        // Occasionally add MARX promotions
        if (Math.random() < 0.002) {
            this.addCommentary('marx_promo');
        }
    }
    
    getCommentaryHistory() {
        return this.commentaryHistory.slice(-5); // Last 5 comments
    }
    
    reset() {
        this.commentaryQueue = [];
        this.commentaryTimer = 0;
        this.lastCommentary = '';
        this.currentCommentator = 0;
    }
}
