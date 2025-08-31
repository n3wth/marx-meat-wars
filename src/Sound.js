export class Sound {
    constructor() {
        this.ctx = null;
        this.gain = null;
        this.masterVolume = 0.3;
        this.muted = false;
    }

    unlock() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gain = this.ctx.createGain();
            this.gain.gain.value = this.masterVolume;
            this.gain.connect(this.ctx.destination);
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
}
