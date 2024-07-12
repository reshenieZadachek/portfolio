import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const SeekbarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ProgressCircle = styled.svg`
  width: 100%;
  height: 100%;
`;

const BackgroundPath = styled.path`
  fill: none;
  stroke: rgba(52, 152, 219, 0.2);
  stroke-width: 4;
  stroke-linecap: round;
`;

const ProgressPath = styled.path`
  fill: none;
  stroke: #3498DB;
  stroke-width: 4;
  stroke-linecap: round;
  cursor: pointer;
`;

const ProgressKnob = styled.circle`
  fill: #3498DB;
  stroke: #fff;
  stroke-width: 2;
  cursor: pointer;
`;

const StartMarker = styled.circle`
  fill: #3498DB;
  stroke: #fff;
  stroke-width: 2;
`;

function CircularSeekbar({ currentTime, duration, onSeek }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const knobRef = useRef(null);

  const size = 280;
  const strokeWidth = 4;
  const radius = 105;
  const center = size / 2;

  useEffect(() => {
    if (pathRef.current && knobRef.current) {
      const circumference = 2 * Math.PI * radius;
      const progress = currentTime / duration;
      const dashoffset = circumference * (1 - progress);
      
      pathRef.current.style.strokeDasharray = circumference;
      pathRef.current.style.strokeDashoffset = dashoffset;

      const angle = 2 * Math.PI * progress - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      knobRef.current.setAttribute('cx', x);
      knobRef.current.setAttribute('cy', y);
    }
  }, [currentTime, duration, center, radius]);

  const handleSeek = (event) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const centerX = svgRect.left + svgRect.width / 2;
      const centerY = svgRect.top + svgRect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      let progress = (angle + Math.PI / 2) / (2 * Math.PI);
      if (progress > 1) progress -= 1;

      onSeek(duration * progress);
    }
  };

  const progressPath = `
    M ${center},${center - radius}
    A ${radius},${radius} 0 1,1 ${center - 0.001},${center - radius}
  `;

  return (
    <SeekbarContainer>
      <ProgressCircle 
        viewBox={`0 0 ${size} ${size}`}
        ref={svgRef}
        onClick={handleSeek}
      >
        <BackgroundPath d={progressPath} strokeWidth={strokeWidth} />
        <ProgressPath
          ref={pathRef}
          d={progressPath}
          strokeWidth={strokeWidth}
        />
        <StartMarker
          cx={center}
          cy={center - radius}
          r="6"
        />
        <ProgressKnob
          ref={knobRef}
          r="8"
        />
      </ProgressCircle>
    </SeekbarContainer>
  );
}

export default CircularSeekbar;