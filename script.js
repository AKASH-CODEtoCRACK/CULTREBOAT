 class WaterEffectParallax {
            constructor() {
                this.scrollY = 0;
                this.mouseX = 0;
                this.mouseY = 0;
                
                // Elements
                this.textWheel = document.getElementById('textWheel');
                this.leftColumn = document.getElementById('leftColumn');
                this.rightColumn = document.getElementById('rightColumn');
                this.cursor = document.getElementById('cursor');
                
                // Water effect
                this.canvas = document.getElementById('waterCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.ripples = [];
                
                this.init();
            }

            init() {
                this.setupCanvas();
                this.bindEvents();
                this.animate();
            }

            setupCanvas() {
                const resize = () => {
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                };
                resize();
                window.addEventListener('resize', resize);
            }

            bindEvents() {
                let ticking = false;
                
                // Scroll event
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            this.scrollY = window.pageYOffset;
                            this.updateElements();
                            ticking = false;
                        });
                        ticking = true;
                    }
                });

                // Mouse events
                document.addEventListener('mousemove', (e) => {
                    this.mouseX = e.clientX;
                    this.mouseY = e.clientY;
                    
                    // Update cursor position
                    this.cursor.style.left = this.mouseX - 10 + 'px';
                    this.cursor.style.top = this.mouseY - 10 + 'px';
                    
                    // Create water ripple occasionally
                    if (Math.random() < 0.1) {
                        this.createRipple(this.mouseX, this.mouseY);
                    }
                });

                // Click to create larger ripple
                document.addEventListener('click', (e) => {
                    this.createRipple(e.clientX, e.clientY, 100);
                });
            }

            createRipple(x, y, maxRadius = 50) {
                this.ripples.push({
                    x: x,
                    y: y,
                    radius: 0,
                    maxRadius: maxRadius,
                    opacity: 1,
                    speed: 2
                });
            }

            updateElements() {
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                const scrollProgress = Math.min(this.scrollY / maxScroll, 1);
                
                this.updateTextWheel(scrollProgress);
                this.updateImages(scrollProgress);
            }

            updateTextWheel(scrollProgress) {
                // Rotate the wheel based on scroll (120 degrees per section)
                const rotation = scrollProgress * 360;
                this.textWheel.style.transform = `rotateX(${rotation}deg)`;
            }

            updateImages(scrollProgress) {
                const moveDistance = scrollProgress * 300;
                
                // Left column moves UP
                this.leftColumn.style.transform = `translateY(${moveDistance}px)`;
                
                // Right column moves DOWN
                this.rightColumn.style.transform = `translateY(-${moveDistance}px)`;
            }

            updateWaterEffect() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Update and draw ripples
                for (let i = this.ripples.length - 1; i >= 0; i--) {
                    const ripple = this.ripples[i];
                    
                    ripple.radius += ripple.speed;
                    ripple.opacity = Math.max(0, 1 - (ripple.radius / ripple.maxRadius));
                    
                    if (ripple.opacity <= 0) {
                        this.ripples.splice(i, 1);
                        continue;
                    }
                    
                    // Draw ripple
                    this.ctx.beginPath();
                    this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(100, 200, 255, ${ripple.opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    
                    // Inner ripple for effect
                    if (ripple.radius > 10) {
                        this.ctx.beginPath();
                        this.ctx.arc(ripple.x, ripple.y, ripple.radius - 5, 0, Math.PI * 2);
                        this.ctx.strokeStyle = `rgba(150, 220, 255, ${ripple.opacity * 0.5})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }

            animate() {
                this.updateElements();
                this.updateWaterEffect();
                requestAnimationFrame(() => this.animate());
            }

        }

        

        // Initialize when page loads
        window.addEventListener('load', () => {
            new WaterEffectParallax();
        });
