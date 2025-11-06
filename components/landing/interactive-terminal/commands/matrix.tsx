"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

function MatrixOutput({ seconds }: { seconds: number }) {
  const t = useTranslations("terminal");
  const [isRunning, setIsRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || !isRunning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 300;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    let startTime = Date.now();
    const duration = seconds * 1000;

    const draw = () => {
      if (Date.now() - startTime > duration) {
        setIsRunning(false);
        return;
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [seconds, isRunning]);

  if (!isRunning) {
    return (
      <div className="text-green-600 dark:text-green-400">
        {t("matrixStopped")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        {t("matrixRunning", { seconds })}
      </div>
      <canvas
        ref={canvasRef}
        className="rounded border border-green-600/50"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="text-xs text-muted-foreground">
        {t("matrixPressCtrlC")}
      </div>
    </div>
  );
}

export const matrixCommand = {
  description: "Matrix rain animation",
  descriptionKey: "terminal.matrixUsage",
  usage: "matrix [--seconds <n>]",
  category: "fun" as const,
  execute: (args?: string[]) => {
    let seconds = 5;
    const secondsIndex = args?.indexOf("--seconds");
    if (
      secondsIndex !== undefined &&
      secondsIndex >= 0 &&
      args[secondsIndex + 1]
    ) {
      const parsed = Number.parseInt(args[secondsIndex + 1], 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 30) {
        seconds = parsed;
      }
    }

    return <MatrixOutput seconds={seconds} />;
  },
};

