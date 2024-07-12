import React from 'react';
import styled, { keyframes } from 'styled-components';

const translateXAnim = Math.floor(Math.random() * 201) - 100;
// Объявляем keyframes правильным образом
const fall = keyframes`
  0% {
    transform: translateY(-10%) rotate(0deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(100vh) rotate(720deg) translateX(${translateXAnim}px);
    opacity: 0;
  }
`;

const Petal = styled.div`
  position: fixed;
  top: -10%;
  left: ${props => props.left}%;
  width: 15px;
  height: 15px;
  background: pink;
  border-radius: 150% 0 150% 0;
  animation: 
    ${fall} ${props => props.fallDuration}s linear infinite;
  animation-delay: -${props => props.delay}s;
  transform-origin: center;
  z-index: 10;
`;

function FallingPetals() {
  return (
    <>
      {[...Array(20)].map((_, i) => {
        const left = Math.random() * 100;
        const fallDuration = Math.random() * 10 + 10;
        const delay = Math.random() * 10;
        return (
          <Petal
            key={i}
            left={left}
            fallDuration={fallDuration}
            delay={delay}
          />
        );
      })}
    </>
  );
}

export default FallingPetals;