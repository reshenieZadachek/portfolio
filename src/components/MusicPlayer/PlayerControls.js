import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 16pt;
  color: white;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ButtonContainer = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.3);
  }
`;
const ArrContainer = styled.div`
  display: flex;
    justify-content: center;
    align-items: center;
`;

const PlayPauseButton = styled.div`
  width: 14px;
  height: 14px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    left: ${props => props.isPlaying ? '0' : '2px'};
    top: 0;
    width: ${props => props.isPlaying ? '4px' : '0'};
    height: 14px;
    background: #3498DB;
  }

  &::after {
    right: ${props => props.isPlaying ? '0' : '-2px'};
    top: ${props => props.isPlaying ? '0' : '-1px'};
    width: ${props => props.isPlaying ? '4px' : '0'};
    height: ${props => props.isPlaying ? '14px' : '0'};
    background: ${props => props.isPlaying ? '#3498DB' : 'transparent'};
    border-style: solid;
    border-width: ${props => props.isPlaying ? '0' : '8px 0 8px 12px'};
    border-color: ${props => props.isPlaying ? 'transparent' : 'transparent transparent transparent #3498DB'};
  }
`;
const DoubleArrowRightButton = styled.div`
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 0 8px 16px; /* Настройки для треугольника */
    border-color: transparent transparent transparent #3498DB;
  }

  &::before {
    left: 6px; /* Расположение первой стрелки */
    transform: translateY(-50%);
  }

  &::after {
    left: 18px; /* Расположение второй стрелки */
    transform: translateY(-50%);
  }

  &:hover {
    transform: scale(1.3);
  }
`;
const DoubleArrowLeftButton = styled.div`
width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 16px 8px 0; /* Настройки для треугольника */
    border-color: transparent #3498DB transparent transparent;
    transform: translateY(-50%);
  }

  &::before {
    left: 8px; /* Расположение первой стрелки */
  }

  &::after {
    left: 20px; /* Расположение второй стрелки */
  }

  &:hover {
    transform: scale(1.3);
  }
`;


const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const StyledSlider = styled.input`
  -webkit-appearance: none;
  width: 80%;
  height: 5px;
  background: #34495E; /* Цвет фона ползунка */
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px; /* Размер ползунка */
    height: 15px;
    border-radius: 50%;
    background: #c4e1ff; /* Цвет ползунка */
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }

  &::-moz-range-thumb {
    width: 15px; /* Размер ползунка */
    height: 15px;
    border-radius: 50%;
    background: #c4e1ff; /* Цвет ползунка */
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }
`;
const PlayerControls = ({ isPlaying, onPlayPause, currentTrack, HandleTrackNext, HandleTrackPrev, onVolumeChange }) => {
  return (
    <Container className="player-controls">
      <div className="current-track">
        <p>{currentTrack.title}</p>
      </div>
      <ArrContainer>
        <DoubleArrowLeftButton onClick={HandleTrackPrev} aria-label="Previous Track"></DoubleArrowLeftButton>
        <ButtonContainer onClick={onPlayPause} className="play-button-container">
          <PlayPauseButton isPlaying={isPlaying} />
        </ButtonContainer>
        <DoubleArrowRightButton onClick={HandleTrackNext} aria-label="Next Track"></DoubleArrowRightButton>
      </ArrContainer>
      <SliderContainer>
        <StyledSlider 
          type="range" 
          min="0" 
          max="100" 
          onChange={onVolumeChange} 
        />
      </SliderContainer>
    </Container>
  );
}

export default PlayerControls;