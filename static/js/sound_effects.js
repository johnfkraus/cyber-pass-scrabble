class SoundEffects {
    constructor() {
        this.initialized = false;
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.synth.volume.value = -10; // Reduce volume to avoid being too loud
        
        // Cyberpunk-style effects
        this.effectsChain = [
            new Tone.FeedbackDelay("8n", 0.2),
            new Tone.Distortion(0.3),
            new Tone.BitCrusher(8),
        ];
        
        // Connect effects chain
        this.synth.connect(this.effectsChain[0]);
        for (let i = 0; i < this.effectsChain.length - 1; i++) {
            this.effectsChain[i].connect(this.effectsChain[i + 1]);
        }
        this.effectsChain[this.effectsChain.length - 1].toDestination();
    }

    async initialize() {
        if (!this.initialized) {
            await Tone.start();
            this.initialized = true;
        }
    }

    playGenerateSound(strength) {
        if (!this.initialized) return;

        // Play a sequence of notes based on password strength
        const notes = strength > 80 ? ["C5", "E5", "G5"] :
                     strength > 60 ? ["A4", "C5", "E5"] :
                     ["F4", "A4", "C5"];

        // Play an arpeggio with timing based on strength
        const now = Tone.now();
        notes.forEach((note, i) => {
            this.synth.triggerAttackRelease(note, "16n", now + i * 0.1);
        });
    }

    playCopySound() {
        if (!this.initialized) return;

        // Play a quick upward sweep
        const now = Tone.now();
        this.synth.triggerAttackRelease("C5", "32n", now);
        this.synth.triggerAttackRelease("E5", "32n", now + 0.05);
    }
}

// Initialize sound effects globally
window.soundEffects = new SoundEffects();

// Add click handler to initialize audio context
document.addEventListener('click', async () => {
    await window.soundEffects.initialize();
}, { once: true });
