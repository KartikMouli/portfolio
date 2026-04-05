'use client';

import { useRef, useEffect, useCallback } from 'react';

interface AudioVisualizerProps {
  mediaRecorder: MediaRecorder;
  width?: number;
  height?: number;
  barColor?: string;
  barCount?: number;
}

export default function AudioVisualizer({
  mediaRecorder,
  width = 280,
  height = 36,
  barColor = 'currentColor',
  barCount = 28,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolve CSS variable — canvas can't use var() directly
    let resolvedColor = barColor;
    const cssVarMatch = barColor.match(/var\(([^)]+)\)/);
    if (cssVarMatch) {
      const varValue = getComputedStyle(canvas)
        .getPropertyValue(cssVarMatch[1])
        .trim();
      // shadcn uses raw HSL values like "222.2 47.4% 11.2%"
      resolvedColor =
        varValue.startsWith('#') ||
        varValue.startsWith('rgb') ||
        varValue.startsWith('hsl')
          ? varValue
          : `hsl(${varValue})`;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const barWidth = Math.max(2, width / barCount - 2);
      const gap = (width - barCount * barWidth) / (barCount + 1);

      for (let i = 0; i < barCount; i++) {
        const index = Math.floor((i / barCount) * bufferLength * 0.6);
        const value = dataArray[index] / 255;
        const barHeight = Math.max(2, value * height * 0.85);

        const x = gap + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = resolvedColor;
        ctx.globalAlpha = 0.6 + value * 0.4;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    render();
  }, [width, height, barColor, barCount]);

  useEffect(() => {
    // Connect to the MediaRecorder's stream
    const stream = mediaRecorder.stream;
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.75;
    source.connect(analyser);
    analyserRef.current = analyser;

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      audioCtx.close();
    };
  }, [mediaRecorder, draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-9 rounded-lg"
    />
  );
}
