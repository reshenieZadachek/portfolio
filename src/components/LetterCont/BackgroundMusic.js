import React, { useRef, useEffect } from 'react';
import audioFile from './sound/Navsegda.mp3';
import styled from 'styled-components';

const PlayButton = styled.button`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background-color: rgba(255, 192, 203, 0.6); 
  border: 2px solid #FFC0CB;
  border-radius: 50%;
  cursor: pointer;
  display: ${props => props.active ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;
  z-index: 99999;
  transition: all 0.3s ease;

  &:before {
    content: '♥';
    font-size: 40px;
    color: #FF69B4;
  }

  &:hover {
    background-color: rgba(255, 192, 203, 0.8);
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 105, 180, 0.3);
  }
`;

function BackgroundMusic({ activate, setActivate }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (activate) {
      audioRef.current.play().catch(error => {
        console.error("Ошибка воспроизведения:", error);
        setActivate(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [activate, setActivate]);

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setActivate(true);
      }).catch(error => {
        console.error("Ошибка воспроизведения:", error);
      });
    } else {
      audioRef.current.pause();
      setActivate(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={audioFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <PlayButton
        active={activate}
        onClick={toggleAudio}
      />
    </>
  );
}

export default BackgroundMusic;