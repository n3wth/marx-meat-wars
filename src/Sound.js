export class Sound {
    constructor() {
        this.ctx = null;
        this.gain = null;
        this.masterVolume = 0.3;
        this.muted = false;
        this.backgroundMusic = null;
        this.currentTrack = 'none';
        this.musicGain = null;
        this.isPlayingMusic = false;
    }

    unlock() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gain = this.ctx.createGain();
            this.gain.gain.value = this.masterVolume;
            this.gain.connect(this.ctx.destination);
            
            // Create music gain node
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.4;
            this.musicGain.connect(this.ctx.destination);
        } else if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(v) {
        this.masterVolume = Math.max(0, Math.min(1, v));
        if (this.gain) this.gain.gain.value = this.muted ? 0 : this.masterVolume;
    }

    setMuted(m) {
        this.muted = !!m;
        if (this.gain) this.gain.gain.value = this.muted ? 0 : this.masterVolume;
    }

    play(type) {
        if (!this.ctx) return; // must be unlocked by user gesture
        if (this.muted) return;
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.value = this._freq(type);
        gain.gain.value = 0.0001;
        
        osc.connect(gain);
        gain.connect(this.gain);
        osc.start();
        
        // Short envelope with different characteristics for Russian vs Spanish
        if (type === 'russian_attack') {
            // Weak, pathetic Russian attack sound
            gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.stop(now + 0.1);
        } else if (type === 'spanish_attack') {
            // Powerful Spanish attack sound
            gain.gain.exponentialRampToValueAtTime(0.8, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.stop(now + 0.25);
        } else {
            // Standard envelope
            gain.gain.exponentialRampToValueAtTime(0.6, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.stop(now + 0.18);
        }
    }

    _freq(type) {
        switch (type) {
            case 'russian_attack': return 320; // Pathetic low frequency
            case 'spanish_attack': return 660; // Powerful high frequency
            case 'russian_hit': return 180; // Sad Russian getting hit
            case 'spanish_hit': return 440; // Spanish taking damage (rare)
            case 'defeat': return 150; // Russian defeat sound
            case 'victory': return 880; // Spanish victory sound
            case 'start': return 550;
            case 'marx': return 750; // MARX FOODSERVICE jingle
            default: return 400;
        }
    }

    // Special method for playing the MARX FOODSERVICE jingle
    playMarxJingle() {
        if (!this.ctx || this.muted) return;
        
        const notes = [750, 900, 800, 1000]; // Catchy jingle
        const duration = 0.25;
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.play('marx');
            }, index * duration * 1000);
        });
    }

    // Epic background music system
    playBackgroundMusic(track) {
        if (!this.ctx || this.muted || this.isPlayingMusic) return;
        
        this.stopBackgroundMusic();
        this.currentTrack = track;
        this.isPlayingMusic = true;
        
        if (track === 'russian_theme') {
            this.playRussianTheme();
        } else if (track === 'spanish_theme') {
            this.playSpanishTheme();
        } else if (track === 'battle_theme') {
            this.playBattleTheme();
        } else if (track === 'defeat_theme') {
            this.playDefeatTheme();
        } else if (track === 'marx_victory') {
            this.playMarxVictoryTheme();
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
        }
        this.isPlayingMusic = false;
    }

    playRussianTheme() {
        // Sad, slow Russian melody (based on Kalinka but depressing)
        const melody = [
            {freq: 220, duration: 0.5}, {freq: 247, duration: 0.5}, {freq: 262, duration: 0.5},
            {freq: 220, duration: 0.5}, {freq: 196, duration: 1.0}, {freq: 175, duration: 1.0},
            {freq: 220, duration: 0.5}, {freq: 196, duration: 0.5}, {freq: 175, duration: 1.5}
        ];
        this.playMelody(melody, 'sawtooth', 0.3, true);
    }

    playSpanishTheme() {
        // Triumphant Spanish melody (Flamenco-inspired)
        const melody = [
            {freq: 330, duration: 0.3}, {freq: 370, duration: 0.3}, {freq: 415, duration: 0.3},
            {freq: 494, duration: 0.5}, {freq: 415, duration: 0.3}, {freq: 370, duration: 0.3},
            {freq: 330, duration: 0.5}, {freq: 370, duration: 0.3}, {freq: 415, duration: 0.7}
        ];
        this.playMelody(melody, 'triangle', 0.4, true);
    }

    playBattleTheme() {
        // Intense battle music
        const melody = [
            {freq: 440, duration: 0.2}, {freq: 523, duration: 0.2}, {freq: 659, duration: 0.2},
            {freq: 784, duration: 0.3}, {freq: 659, duration: 0.2}, {freq: 523, duration: 0.2},
            {freq: 440, duration: 0.4}, {freq: 523, duration: 0.2}, {freq: 659, duration: 0.4}
        ];
        this.playMelody(melody, 'square', 0.5, true);
    }

    playDefeatTheme() {
        // Sad Russian defeat music
        const melody = [
            {freq: 175, duration: 1.0}, {freq: 156, duration: 1.0}, {freq: 139, duration: 1.5},
            {freq: 117, duration: 2.0}, {freq: 104, duration: 3.0}
        ];
        this.playMelody(melody, 'sine', 0.6, false);
    }

    playMarxVictoryTheme() {
        // Corporate victory fanfare
        const melody = [
            {freq: 523, duration: 0.3}, {freq: 659, duration: 0.3}, {freq: 784, duration: 0.3},
            {freq: 1047, duration: 0.5}, {freq: 784, duration: 0.3}, {freq: 659, duration: 0.3},
            {freq: 523, duration: 0.5}, {freq: 659, duration: 0.3}, {freq: 784, duration: 0.7}
        ];
        this.playMelody(melody, 'triangle', 0.7, false);
    }

    playMelody(melody, waveType, volume, loop) {
        if (!this.ctx || !this.musicGain) return;
        
        let currentTime = this.ctx.currentTime;
        let totalDuration = 0;
        
        melody.forEach(note => {
            totalDuration += note.duration;
        });

        const playSequence = () => {
            let time = this.ctx.currentTime;
            
            melody.forEach(note => {
                const osc = this.ctx.createOscillator();
                const noteGain = this.ctx.createGain();
                
                osc.type = waveType;
                osc.frequency.setValueAtTime(note.freq, time);
                
                noteGain.gain.setValueAtTime(0, time);
                noteGain.gain.linearRampToValueAtTime(volume, time + 0.01);
                noteGain.gain.exponentialRampToValueAtTime(0.001, time + note.duration - 0.01);
                
                osc.connect(noteGain);
                noteGain.connect(this.musicGain);
                
                osc.start(time);
                osc.stop(time + note.duration);
                
                time += note.duration;
            });
            
            if (loop && this.isPlayingMusic) {
                setTimeout(() => {
                    if (this.isPlayingMusic && this.currentTrack !== 'none') {
                        playSequence();
                    }
                }, totalDuration * 1000);
            }
        };
        
        playSequence();
    }

    // Enhanced sound effects with more character
    playEnhancedSound(type, intensity = 1) {
        if (!this.ctx || this.muted) return;
        
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        // Create layered sound effects
        if (type === 'russian_pathetic_attack') {
            osc1.type = 'sawtooth';
            osc1.frequency.value = 180 * intensity;
            osc2.type = 'sine';
            osc2.frequency.value = 90 * intensity;
            filter.type = 'lowpass';
            filter.frequency.value = 800;
        } else if (type === 'spanish_mighty_attack') {
            osc1.type = 'square';
            osc1.frequency.value = 660 * intensity;
            osc2.type = 'triangle';
            osc2.frequency.value = 440 * intensity;
            filter.type = 'bandpass';
            filter.frequency.value = 1200;
        } else if (type === 'russian_pain') {
            osc1.type = 'sawtooth';
            osc1.frequency.value = 120;
            osc2.type = 'sine';
            osc2.frequency.value = 60;
            filter.type = 'lowpass';
            filter.frequency.value = 400;
        }
        
        gain.gain.value = 0.0001;
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.gain);
        
        osc1.start();
        osc2.start();
        
        // Complex envelope
        gain.gain.exponentialRampToValueAtTime(0.6 * intensity, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
    }
}
