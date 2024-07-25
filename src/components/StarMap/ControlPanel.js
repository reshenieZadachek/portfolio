import React from 'react';

const ControlPanel = ({ isFullScreen, isAccelerometerMode, onToggleFullScreen, onToggleAccelerometerMode }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <button onClick={onToggleFullScreen}>
        {isFullScreen ? 'Свернуть' : 'На весь экран'}
      </button>
      <button onClick={onToggleAccelerometerMode}>
        {isAccelerometerMode ? 'Выключить акселерометр' : 'Включить акселерометр'}
      </button>
    </div>
  );
};

export default ControlPanel;