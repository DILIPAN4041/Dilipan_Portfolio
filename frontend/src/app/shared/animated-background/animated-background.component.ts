import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

@Component({
    selector: 'app-animated-background',
    standalone: true,
    template: `
    <canvas #canvas class="animated-background"></canvas>
  `,
    styles: [`
    .animated-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }
  `]
})
export class AnimatedBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private animationId: number = 0;
    private particleCount = 80;
    private maxDistance = 150;

    ngOnInit(): void {
        this.initCanvas();
        this.createParticles();
    }

    ngAfterViewInit(): void {
        this.animate();
    }

    ngOnDestroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private initCanvas(): void {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    private resizeCanvas(): void {
        const canvas = this.canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    private createParticles(): void {
        const canvas = this.canvasRef.nativeElement;

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    private animate = (): void => {
        this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

        this.updateParticles();
        this.drawParticles();
        this.connectParticles();

        this.animationId = requestAnimationFrame(this.animate);
    }

    private updateParticles(): void {
        const canvas = this.canvasRef.nativeElement;

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Keep within bounds
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        });
    }

    private drawParticles(): void {
        // Check if dark mode
        const isDark = document.documentElement.classList.contains('dark-theme');
        const particleColor = isDark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.4)';

        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particleColor;
            this.ctx.fill();
        });
    }

    private connectParticles(): void {
        // Check if dark mode
        const isDark = document.documentElement.classList.contains('dark-theme');

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * (isDark ? 0.3 : 0.2);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}
