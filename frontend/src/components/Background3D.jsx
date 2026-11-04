import React, { useEffect, useRef } from 'react';

export default function Background3D({ enabled = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Objects: Floating isometric pedestals / restaurant layout primitives
    class Prism3D {
      constructor(x, y, z, size, shape = 'cube') {
        this.x = x;
        this.y = y;
        this.z = z;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.shape = shape;
        this.rotX = Math.random() * Math.PI;
        this.rotY = Math.random() * Math.PI;
        this.rotZ = Math.random() * Math.PI;
        this.speedX = 0.002 + Math.random() * 0.003;
        this.speedY = 0.003 + Math.random() * 0.004;
        this.floatOffset = Math.random() * Math.PI * 2;
      }

      update(time, mx, my) {
        this.rotX += this.speedX;
        this.rotY += this.speedY;
        this.y = this.baseY + Math.sin(time * 0.001 + this.floatOffset) * 25;
        this.x = this.baseX + (mx - width / 2) * 0.03 * (this.z / 400);
      }

      project(p, fov = 500) {
        const factor = fov / (fov + p.z + this.z);
        return {
          x: p.x * factor + this.x,
          y: p.y * factor + this.y,
          scale: factor,
        };
      }

      draw(ctx) {
        const s = this.size;
        // Vertices of 3D box
        const rawVertices = [
          { x: -s, y: -s, z: -s },
          { x: s, y: -s, z: -s },
          { x: s, y: s, z: -s },
          { x: -s, y: s, z: -s },
          { x: -s, y: -s, z: s },
          { x: s, y: -s, z: s },
          { x: s, y: s, z: s },
          { x: -s, y: s, z: s },
        ];

        // Apply 3D rotation
        const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
        const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
        const cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);

        const rotated = rawVertices.map((v) => {
          // Rotate Y
          let x1 = v.x * cosY + v.z * sinY;
          let z1 = -v.x * sinY + v.z * cosY;
          // Rotate X
          let y2 = v.y * cosX - z1 * sinX;
          let z2 = v.y * sinX + z1 * cosX;
          // Rotate Z
          let x3 = x1 * cosZ - y2 * sinZ;
          let y3 = x1 * sinZ + y2 * cosZ;
          return { x: x3, y: y3, z: z2 };
        });

        const projected = rotated.map((v) => this.project(v));

        // Edge definition
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front/top
          [4, 5], [5, 6], [6, 7], [7, 4], // back/bottom
          [0, 4], [1, 5], [2, 6], [3, 7], // vertical pillars
        ];

        // Draw horizontal faces with warm gold
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let e = 0; e < 8; e++) {
          const [i, j] = edges[e];
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
        }
        ctx.stroke();

        // Draw vertical columns with subtle sapphire cyan
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.beginPath();
        for (let e = 8; e < 12; e++) {
          const [i, j] = edges[e];
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
        }
        ctx.stroke();

        // Luminous vertex nodes with soft glow
        ctx.save();
        ctx.fillStyle = 'rgba(253, 224, 71, 0.6)';
        ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
        ctx.shadowBlur = 6;
        projected.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    // Subtle 3D particles in space
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 600,
      radius: Math.random() * 1.6 + 0.6,
      alpha: Math.random() * 0.45 + 0.15,
      speedY: Math.random() * 0.25 + 0.1,
    }));

    // Generate floating 3D pedestals across depth planes
    const prisms = [
      new Prism3D(width * 0.10, height * 0.22, 140, 26),
      new Prism3D(width * 0.90, height * 0.28, 180, 32),
      new Prism3D(width * 0.85, height * 0.72, 110, 22),
      new Prism3D(width * 0.15, height * 0.78, 220, 28),
      new Prism3D(width * 0.48, height * 0.16, 280, 20),
      new Prism3D(width * 0.68, height * 0.50, 320, 24),
    ];

    let time = 0;

    const render = () => {
      time += 1;
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft Horizon Radial Aura
      const horizonY = height * 0.52;
      const aura = ctx.createRadialGradient(
        width / 2 + (mouseX - width / 2) * 0.04,
        horizonY,
        10,
        width / 2,
        horizonY,
        width * 0.6
      );
      aura.addColorStop(0, 'rgba(245, 158, 11, 0.06)');
      aura.addColorStop(0.4, 'rgba(56, 189, 248, 0.03)');
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw subtle isometric floor plane grid lines
      const gridPitch = 95;
      const parallaxOffset = (mouseX - width / 2) * 0.07;

      ctx.save();
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.16)';
      ctx.lineWidth = 1;

      // Perspective grid lines fading into horizon
      for (let i = -14; i <= 14; i++) {
        const startX = width / 2 + i * gridPitch * 0.55 + parallaxOffset;
        const endX = width / 2 + i * gridPitch * 3.6 + parallaxOffset * 2.4;

        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let j = 1; j <= 9; j++) {
        const y = horizonY + (height - horizonY) * Math.pow(j / 9, 1.85);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw subtle floating depth particles with gentle glow
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = height;

        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x + (mouseX - width / 2) * 0.015, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render 3D Wireframe Prisms
      prisms.forEach((prism) => {
        prism.update(time, mouseX, mouseY);
        prism.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-700"
    />
  );
}
