import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.canvas`
  position: absolute;
  border-radius: 50%;
`;

function AudioVisualizer({ analyser }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const center = canvas.width / 2;
    const radius = center - 35; // Оставляем небольшой отступ от края

    const renderFrame = () => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3498DB');  // Начальный цвет (голубой)
    gradient.addColorStop(1, '#2ECC71');  // Конечный цвет (зеленый)

      animationRef.current = requestAnimationFrame(renderFrame);

      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyData);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем круг в центре
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#2C3E50';
      ctx.fill();

      const barCount = 250; // Количество столбиков
      const step = Math.PI * 2 / barCount;

      for (let i = 0; i < barCount; i++) {
        const barHeight = (frequencyData[i] || 0) / 255 * 100; // Максимальная высота столбика - 100px
        const angle = step * i;
        
        const startX = center + (radius + 2) * Math.cos(angle);
        const startY = center + (radius + 2) * Math.sin(angle);
        const endX = center + (radius + 2 + barHeight) * Math.cos(angle);
        const endY = center + (radius + 2 + barHeight) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        //ctx.strokeStyle = `hsl(${i * 2}, 100%, 50%)`;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyser]);

  return (
    <Container ref={canvasRef} width="280" height="280" />
  );
}

export default AudioVisualizer;