import React from 'react';

const ToggleButton = ({ onClick, buttonsVisible }) => {
  const buttonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'black',
    border: '1px solid white',
    borderRadius: '5px',
    padding: '5px',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const arrowsToCenter = [
    "M19 4L16 7 M19 4L17 4L19 5",  // Верхний правый угол
    "M19 20L16 17 M19 20L17 20L19 19",  // Нижний правый угол
    "M5 4L8 7 M5 4L7 4L5 5",  // Верхний левый угол
    "M5 20L8 17 M5 20L7 20L5 19"  // Нижний левый угол
  ];

  const arrowsFromCenter = [
    "M16 7L19 4 M17 4L19 4L19 5",  // Верхний правый угол
    "M16 17L19 20 M17 20L19 20L19 19",  // Нижний правый угол
    "M8 7L5 4 M7 4L5 4L5 5",  // Верхний левый угол
    "M8 17L5 20 M7 20L5 20L5 19"  // Нижний левый угол
  ];
  
  

  const paths = buttonsVisible ? arrowsFromCenter : arrowsToCenter;

  return (
    <button onClick={onClick} style={buttonStyle}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        {paths.map((d, index) => (
          <path key={index} d={d} stroke="white" strokeWidth="3" strokeLinecap="round" />
        ))}
      </svg>
    </button>
  );
};

export default ToggleButton;
