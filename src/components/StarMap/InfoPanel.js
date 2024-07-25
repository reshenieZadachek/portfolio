import React from 'react';

const InfoPanel = ({ selectedConstellation, infoVisible }) => {
  if (!selectedConstellation || !infoVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <h2>{selectedConstellation.name}</h2>
      <p>{selectedConstellation.info}</p>
    </div>
  );
};

export default InfoPanel;