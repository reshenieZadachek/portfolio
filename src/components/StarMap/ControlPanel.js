import React from 'react';

const ControlPanel = ({ isFullScreen, isAccelerometerMode, onToggleFullScreen, onToggleAccelerometerMode, buttonsVisible }) => {
  return (
    <div style={{
      position: 'absolute',
      top: buttonsVisible ? '10px' : '-100px', // Сдвиг вверх
      left: '10px',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '10px',
      borderRadius: '5px',
      transition: 'top 0.3s ease-in-out' // Плавный переход
    }}>
      <button style={buttonStyle} onClick={onToggleFullScreen}>
        {isFullScreen ? 'Свернуть' : 'На весь экран'}
      </button>
      <button style={buttonStyle} onClick={onToggleAccelerometerMode}>
        {isAccelerometerMode ? 'Выключить акселерометр' : 'Включить акселерометр'}
      </button>
    </div>
  );
};

const buttonStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid white',
  borderRadius: '5px',
  padding: '5px 10px',
  color: 'white',
  marginBottom: '5px',
  cursor: 'pointer'
};

export default ControlPanel;
