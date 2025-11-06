"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 300;
const MATRIX_RESET_PROBABILITY = 0.975;
const MAX_MATRIX_SECONDS = 30;

function MatrixOutput({ seconds }: { seconds: number }) {
  const t = useTranslations("terminal");
  const [isRunning, setIsRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!(canvasRef.current && isRunning)) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = new Array(Math.floor(columns)).fill(1);

    const startTime = Date.now();
    // biome-ignore lint/style/noMagicNumbers: no magic numbers
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

        if (
          drops[i] * fontSize > canvas.height &&
          Math.random() > MATRIX_RESET_PROBABILITY
        ) {
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
      <div className="text-muted-foreground text-xs">
        {t("matrixRunning", { seconds })}
      </div>
      <canvas
        className="rounded border border-green-600/50"
        ref={canvasRef}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="text-muted-foreground text-xs">
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
    if (args) {
      const secondsIndex = args.indexOf("--seconds");
      if (secondsIndex >= 0 && secondsIndex + 1 < args.length) {
        const secondsValue = args[secondsIndex + 1];
        if (secondsValue) {
          const parsed = Number.parseInt(secondsValue, 10);
          if (
            !Number.isNaN(parsed) &&
            parsed > 0 &&
            parsed <= MAX_MATRIX_SECONDS
          ) {
            seconds = parsed;
          }
        }
      }
    }

    return <MatrixOutput seconds={seconds} />;
  },
};
