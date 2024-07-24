import React, { useState, useEffect } from 'react';

const DebugOverlay = ({ deviceOrientation, userLocation, isAccelerometerMode }) => {
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const info = `
      Accelerometer: ${isAccelerometerMode ? 'ON' : 'OFF'}
      Alpha: ${deviceOrientation.alpha.toFixed(2)}
      Beta: ${deviceOrientation.beta.toFixed(2)}
      Gamma: ${deviceOrientation.gamma.toFixed(2)}
      Lat: ${userLocation ? userLocation.latitude.toFixed(4) : 'N/A'}
      Lon: ${userLocation ? userLocation.longitude.toFixed(4) : 'N/A'}
    `;
    setDebugInfo(info);
  }, [deviceOrientation, userLocation, isAccelerometerMode]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      whiteSpace: 'pre-wrap',
      zIndex: 1000
    }}>
      {debugInfo}
    </div>
  );
};

export default DebugOverlay;