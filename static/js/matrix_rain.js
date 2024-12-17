class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = 'ABCDEF0123456789';
        this.fontSize = 14;
        this.drops = [];
        this.init();
    }

    init() {
        // Set canvas size
        this.resize();
        // Initialize drops
        const columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(columns).fill(1);
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    getRandomChar() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    draw() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#0F0'; // Matrix green
        this.ctx.font = this.fontSize + 'px monospace';

        // Draw each drop
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.getRandomChar();
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(text, x, y);

            // Reset drop when it reaches bottom or randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    morphText(targetText) {
        // Store original drops state
        const originalDrops = [...this.drops];
        const centerX = Math.floor((this.canvas.width / this.fontSize) / 2);
        const centerY = Math.floor((this.canvas.height / this.fontSize) / 2);
        
        let morphingChars = Array(targetText.length).fill('');
        const startPositions = Array(targetText.length).fill().map((_, i) => ({
            x: centerX - Math.floor(targetText.length / 2) + i,
            y: centerY
        }));

        return new Promise(resolve => {
            let frame = 0;
            const animate = () => {
                this.draw();

                // Update morphing characters
                morphingChars = morphingChars.map((char, i) => {
                    if (char !== targetText[i]) {
                        return this.getRandomChar();
                    }
                    return char;
                });

                // Draw morphing text
                this.ctx.fillStyle = '#00fff9'; // Cyberpunk blue
                morphingChars.forEach((char, i) => {
                    const pos = startPositions[i];
                    this.ctx.fillText(char, pos.x * this.fontSize, pos.y * this.fontSize);
                });

                frame++;

                // Gradually reveal correct characters
                if (frame % 10 === 0) {
                    const randomIndex = Math.floor(Math.random() * targetText.length);
                    morphingChars[randomIndex] = targetText[randomIndex];
                }

                if (morphingChars.join('') === targetText) {
                    // Flash effect
                    this.ctx.fillStyle = 'rgba(0, 255, 249, 0.3)';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    setTimeout(() => {
                        this.drops = originalDrops;
                        resolve();
                    }, 500);
                } else {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        });
    }

    start() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }

    stop() {
        this.drops = Array(Math.floor(this.canvas.width / this.fontSize)).fill(1);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
