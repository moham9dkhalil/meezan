import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
}

interface Comet {
  x: number;
  y: number;
  length: number;
  vx: number;
  vy: number;
  alpha: number;
  speed: number;
  color: string;
}

interface SpaceAccountingItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  baseOpacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  floatOffset: number;
  floatSpeed: number;
  type: "symbol" | "text";
  content: string;
  subtext?: string;
  color: string;
  glowColor: string;
}

export function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;

    // 1. Twinkling Stars Pool
    const starCount = isMobile ? 60 : 130;
    const starColors = ["#ffffff", "#e0e7ff", "#fef3c7", "#f472b6", "#38bdf8"];
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: 0.008 + Math.random() * 0.02,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    }));

    // 2. Drifting Space Nebulae (Cosmic Gas Clouds)
    const nebulae: NebulaCloud[] = [
      {
        x: width * 0.2,
        y: height * 0.3,
        radius: isMobile ? 180 : 320,
        vx: 0.08,
        vy: 0.05,
        color: "rgba(99, 102, 241, 0.12)", // Indigo
        opacity: 0.15
      },
      {
        x: width * 0.8,
        y: height * 0.7,
        radius: isMobile ? 200 : 380,
        vx: -0.06,
        vy: -0.04,
        color: "rgba(168, 85, 247, 0.12)", // Purple
        opacity: 0.15
      },
      {
        x: width * 0.5,
        y: height * 0.85,
        radius: isMobile ? 150 : 280,
        vx: 0.05,
        vy: -0.07,
        color: "rgba(236, 72, 153, 0.10)", // Pink
        opacity: 0.12
      },
      {
        x: width * 0.75,
        y: height * 0.2,
        radius: isMobile ? 160 : 300,
        vx: -0.04,
        vy: 0.06,
        color: "rgba(56, 189, 248, 0.10)", // Cyan
        opacity: 0.12
      }
    ];

    // 3. Shooting Stars / Comets Generator
    const comets: Comet[] = [];
    let lastCometTime = 0;

    const createComet = () => {
      const startX = Math.random() * width;
      const startY = Math.random() * (height * 0.5);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // Angle downward right
      const speed = 4 + Math.random() * 4;

      comets.push({
        x: startX,
        y: startY,
        length: 80 + Math.random() * 70,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        speed: speed,
        color: Math.random() > 0.5 ? "#38bdf8" : "#f472b6"
      });
    };

    // 4. Floating Space Accounting Elements ("بيسبحوا ف الفضاء")
    const spaceAccountingSymbols = [
      { content: "⚖️", subtext: "ميزان", color: "#c084fc", glowColor: "rgba(192, 132, 252, 0.7)" },
      { content: "📊", subtext: "قوائم", color: "#60a5fa", glowColor: "rgba(96, 165, 250, 0.7)" },
      { content: "🧮", subtext: "قيود", color: "#f472b6", glowColor: "rgba(244, 114, 182, 0.7)" },
      { content: "📜", subtext: "يومية", color: "#fbbf24", glowColor: "rgba(251, 191, 36, 0.7)" },
      { content: "🧾", subtext: "فاتورة", color: "#34d399", glowColor: "rgba(52, 211, 153, 0.7)" },
      { content: "📈", subtext: "أرباح", color: "#4ade80", glowColor: "rgba(74, 222, 128, 0.7)" },
      { content: "💼", subtext: "CMA", color: "#818cf8", glowColor: "rgba(129, 140, 248, 0.7)" },
      { content: "💎", subtext: "SOCPA", color: "#a855f7", glowColor: "rgba(168, 85, 247, 0.7)" },
      { content: "🪐", subtext: "النظام المحاسبي", color: "#38bdf8", glowColor: "rgba(56, 189, 248, 0.7)" },
      { content: "✨", subtext: "التميز", color: "#f43f5e", glowColor: "rgba(244, 63, 94, 0.7)" }
    ];

    const spaceAccountingTexts = [
      { content: "Dr", subtext: "مدين", color: "#38bdf8", glowColor: "rgba(56, 189, 248, 0.7)" },
      { content: "Cr", subtext: "دائن", color: "#e879f9", glowColor: "rgba(232, 121, 249, 0.7)" },
      { content: "Dr = Cr", subtext: "القيد المزدوج", color: "#f472b6", glowColor: "rgba(244, 114, 182, 0.7)" },
      { content: "Assets = Liab + Eq", subtext: "المعادلة المحاسبية", color: "#818cf8", glowColor: "rgba(129, 140, 248, 0.7)" },
      { content: "IFRS 15", subtext: "معيار الإيراد", color: "#fbbf24", glowColor: "rgba(251, 191, 36, 0.7)" },
      { content: "IFRS 16", subtext: "العقود الإيجارية", color: "#34d399", glowColor: "rgba(52, 211, 153, 0.7)" },
      { content: "SOCPA", subtext: "زمالة المحاسبين", color: "#60a5fa", glowColor: "rgba(96, 165, 250, 0.7)" },
      { content: "CMA", subtext: "المحاسب الإداري", color: "#c084fc", glowColor: "rgba(192, 132, 252, 0.7)" },
      { content: "SAR", subtext: "ريال", color: "#38bdf8", glowColor: "rgba(56, 189, 248, 0.7)" },
      { content: "$", subtext: "دولار", color: "#4ade80", glowColor: "rgba(74, 222, 128, 0.7)" },
      { content: "%", subtext: "معدل الإهلاك", color: "#f59e0b", glowColor: "rgba(245, 158, 11, 0.7)" },
      { content: "Σ", subtext: "مجموع الحسابات", color: "#a78bfa", glowColor: "rgba(167, 139, 250, 0.7)" }
    ];

    const itemsPool = [
      ...spaceAccountingSymbols.map(s => ({ ...s, type: "symbol" as const })),
      ...spaceAccountingTexts.map(t => ({ ...t, type: "text" as const }))
    ];

    const floatingItemsCount = isMobile ? 16 : 28;

    const floatingItems: SpaceAccountingItem[] = Array.from({ length: floatingItemsCount }, (_, i) => {
      const template = itemsPool[i % itemsPool.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        // Downward cosmic rainfall velocity (falling from top to bottom)
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.4 + Math.random() * 0.7,
        size: template.type === "symbol" ? (isMobile ? 10 : 12) : (isMobile ? 8 : 9.5),
        rotation: (Math.random() - 0.5) * 0.4,
        vRot: (Math.random() - 0.5) * 0.006,
        baseOpacity: Math.random() * 0.12 + 0.15, // Highly transparent (0.15 - 0.27)
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.01 + Math.random() * 0.015,
        type: template.type,
        content: template.content,
        subtext: template.subtext,
        color: template.color,
        glowColor: template.glowColor
      };
    });

    // Mouse space gravity reaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Main animation render loop
    let time = 0;
    const render = (timestamp: number) => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains("light");

      // 1. Render Drifting Space Nebulae
      nebulae.forEach((nebula) => {
        nebula.x += nebula.vx;
        nebula.y += nebula.vy;

        if (nebula.x < -100 || nebula.x > width + 100) nebula.vx *= -1;
        if (nebula.y < -100 || nebula.y > height + 100) nebula.vy *= -1;

        const grad = ctx.createRadialGradient(nebula.x, nebula.y, 10, nebula.x, nebula.y, nebula.radius);
        grad.addColorStop(0, isLight ? nebula.color.replace("0.12", "0.06").replace("0.10", "0.05") : nebula.color);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // 2. Render Twinkling Stars
      stars.forEach((s) => {
        s.alpha += Math.sin(time * 5 + s.x) * s.twinkleSpeed;
        const currentAlpha = Math.max(0.15, Math.min(0.95, s.alpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = isLight && s.color === "#ffffff" ? "#6366f1" : s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      });

      // 3. Occasional Shooting Star / Comet
      if (timestamp - lastCometTime > 3500 + Math.random() * 4000) {
        createComet();
        lastCometTime = timestamp;
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;
        c.alpha -= 0.012;

        if (c.alpha <= 0 || c.x > width + 100 || c.y > height + 100) {
          comets.splice(i, 1);
          continue;
        }

        const tailX = c.x - (c.vx / c.speed) * c.length;
        const tailY = c.y - (c.vy / c.speed) * c.length;

        const cometGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        cometGrad.addColorStop(0, c.color);
        cometGrad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = cometGrad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = c.alpha;
        ctx.stroke();

        // Comet glowing head
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? "#6366f1" : "#ffffff";
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Render Floating & Swimming Space Accounting Items
      floatingItems.forEach((item) => {
        // Space swimming movement (orbital sinusoidal weightless drift)
        item.floatOffset += item.floatSpeed;
        const swimX = Math.sin(time + item.floatOffset) * 0.4;
        const swimY = Math.cos(time * 0.8 + item.floatOffset) * 0.4;

        item.x += item.vx + swimX;
        item.y += item.vy + swimY;
        item.rotation += item.vRot;

        // Continuous downward waterfall loop (falling from top to bottom)
        if (item.y > height + 40) {
          item.y = -40;
          item.x = Math.random() * width;
        }
        if (item.y < -50) item.y = height + 40;
        if (item.x < -60) item.x = width + 50;
        if (item.x > width + 60) item.x = -50;

        // Mouse space gravity push
        const mdx = item.x - mouseX;
        const mdy = item.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const force = (140 - mdist) / 140;
          item.x += (mdx / mdist) * force * 1.6;
          item.y += (mdy / mdist) * force * 1.6;
        }

        // Transparent Pulsing Space Illumination (إضاءة شفافة مضيئة)
        item.pulsePhase += item.pulseSpeed;
        const currentOpacity = item.baseOpacity + Math.sin(item.pulsePhase) * 0.08;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        // Soft Radial Starlight Aura behind space item
        const auraRadius = item.size * 2.2;
        const radialGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, auraRadius);
        radialGlow.addColorStop(0, item.glowColor);
        radialGlow.addColorStop(0.5, item.glowColor.replace("0.7", "0.15"));
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
        ctx.fillStyle = radialGlow;
        ctx.globalAlpha = Math.max(0, currentOpacity * 0.5);
        ctx.fill();

        // Canvas drop shadow space illumination
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 14;

        if (item.type === "symbol") {
          // Floating Space Emoji / Icon
          ctx.font = `${item.size}px Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.globalAlpha = currentOpacity;
          ctx.fillText(item.content, 0, 0);

          if (item.subtext && !isMobile) {
            ctx.font = "8px Cairo, sans-serif";
            ctx.fillStyle = item.color;
            ctx.globalAlpha = currentOpacity * 0.85;
            ctx.fillText(item.subtext, 0, item.size / 2 + 9);
          }
        } else {
          // Floating Transparent Space Pill Tag
          ctx.font = `bold ${item.size}px Cairo, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textMetrics = ctx.measureText(item.content);
          const bgWidth = textMetrics.width + 12;
          const bgHeight = item.size + 8;

          // Transparent glass pill in space
          ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(10, 15, 30, 0.55)";
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 0.9;
          ctx.globalAlpha = currentOpacity * 0.8;

          ctx.beginPath();
          ctx.roundRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 8);
          ctx.fill();
          ctx.stroke();

          // Text content
          ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
          ctx.globalAlpha = currentOpacity;
          ctx.fillText(item.content, 0, -0.5);

          if (item.subtext && !isMobile) {
            ctx.font = "7.5px Cairo, sans-serif";
            ctx.fillStyle = item.color;
            ctx.globalAlpha = currentOpacity * 0.9;
            ctx.fillText(item.subtext, 0, bgHeight / 2 + 7);
          }
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
    />
  );
}
