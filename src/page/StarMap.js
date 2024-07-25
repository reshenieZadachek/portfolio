import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import StarMapController from '../components/StarMap/CameraController';

const toSpherical = (radius, ra, dec) => {
  const theta = (ra * Math.PI) / 12;
  const phi = ((90 - dec) * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const constellations = [
  {
    name: "Большая Медведица",
    info: "Одно из самых известных созвездий северного полушария.",
    stars: [
      { ra: 24 - 11.0622, dec: 61.751 },  // Dubhe (отражено)
      { ra: 24 - 11.0307, dec: 56.3824 }, // Merak (отражено)
      { ra: 24 - 11.8972, dec: 53.6948 }, // Phecda (отражено)
      { ra: 24 - 12.2573, dec: 57.0325 }, // Megrez (отражено)
      { ra: 24 - 12.9009, dec: 55.9598 }, // Alioth (отражено)
      { ra: 24 - 13.7923, dec: 49.3133 }, // Mizar (отражено)
      { ra: 24 - 14.0656, dec: 49.3133 }, // Alkaid (отражено)
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 3]],
  },
  {
    name: "Малая Медведица",
    info: "Известна благодаря Полярной звезде, которая указывает на Северный полюс.",
    stars: [
      { ra: 2.5307, dec: 89.2642 },      // Polaris (Полярная звезда, не отражена)
      { ra: 24 - 17.5368, dec: 87.5862 }, // Yildun (отражено)
      { ra: 24 - 16.5990, dec: 82.5110 }, // Epsilon UMi (отражено)
      { ra: 24 - 15.3442, dec: 77.7945 }, // Zeta UMi (отражено)
      { ra: 24 - 16.0659, dec: 76.0374 }, // Eta UMi (отражено)
      { ra: 24 - 14.7451, dec: 73.5555 }, // Kochab (отражено)
      { ra: 24 - 15.3447, dec: 72.1339 }, // Pherkad (отражено)
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [4, 6]],
  },
  {
    name: "Орион",
    info: "Одно из самых узнаваемых созвездий на ночном небе.",
    stars: [
      { ra: 5.9196, dec: 7.4071 },   // Betelgeuse
      { ra: 5.2422, dec: 6.3497 },   // Bellatrix
      { ra: 5.5835, dec: -1.2019 },  // Mintaka
      { ra: 5.6035, dec: -1.9426 },  // Alnilam
      { ra: 5.6793, dec: -1.9426 },  // Alnitak
      { ra: 5.2425, dec: -8.2016 },  // Rigel
      { ra: 5.2664, dec: -9.6696 },  // Saiph
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [3, 5]],
  },
  {
    name: "Кассиопея",
    info: "Созвездие названо в честь мифической царицы Эфиопии. Форма напоминает букву W или М.",
    stars: [
      { ra: -0.6252, dec: 59.7373 },  // Шедар (α Кассиопеи)
      { ra: 0.1129, dec: 57.2498 },  // Каф (β Кассиопеи)
      { ra: 0.6453, dec: 60.7168 },  // Циг (γ Кассиопеи)
      { ra: 1.3306, dec: 57.2352 },  // Рукба (δ Кассиопеи)
      { ra: 1.9062, dec: 63.6700 },  // Сегин (ε Кассиопеи)
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: "Лебедь",
    info: "Созвездие, напоминающее летящего лебедя.",
    stars: [
      { ra: 20.6905, dec: 45.2803 }, // Deneb
      { ra: 19.5120, dec: 27.9597 }, // Albireo
      { ra: 20.3704, dec: 40.2567 }, // Sadr
      { ra: 19.7494, dec: 32.9147 }, // Gienah
      { ra: 19.9395, dec: 35.0834 }, // Delta Cygni
    ],
    lines: [[0, 2], [1, 2], [2, 3], [2, 4]],
  },
  {
    name: "Лира",
    info: "Небольшое созвездие, содержащее яркую звезду Вега.",
    stars: [
      { ra: 18.6157, dec: 38.7837 }, // Vega
      { ra: 18.7382, dec: 37.6048 }, // Sheliak
      { ra: 18.7477, dec: 33.3627 }, // Sulafat
      { ra: 18.8352, dec: 36.8986 }, // Epsilon Lyrae
    ],
    lines: [[0, 1], [1, 2], [0, 3]],
  },
  {
    name: "Скорпион",
    info: "Одно из самых ярких созвездий южного полушария.",
    stars: [
      { ra: 16.4901, dec: -26.4320 }, // Antares
      { ra: 16.0091, dec: -19.8059 }, // Acrab
      { ra: 16.8360, dec: -34.2934 }, // Sargas
      { ra: 17.6215, dec: -39.0302 }, // Shaula
      { ra: 17.7080, dec: -37.1043 }, // Lesath
    ],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]],
  },
  {
    name: "Дева",
    info: "Второе по величине созвездие на небе.",
    stars: [
      { ra: 13.4199, dec: -11.1613 }, // Spica
      { ra: 12.3314, dec: -0.6661 },  // Vindemiatrix
      { ra: 12.6943, dec: -1.4494 },  // Porrima
      { ra: 13.0364, dec: -5.5395 },  // Auva
    ],
    lines: [[0, 2], [1, 2], [2, 3]],
  },
  {
    name: "Пегас",
    info: "Созвездие, известное своим 'Большим квадратом Пегаса'.",
    stars: [
      { ra: 23.0629, dec: 15.2053 }, // Markab
      { ra: 23.0793, dec: 28.0830 }, // Scheat
      { ra: 0.2200, dec: 29.0903 },  // Alpheratz
      { ra: 0.2206, dec: 15.1835 },  // Algenib
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
];

const Star = React.memo(({ position, size, color, hovered, onClick, onPointerOver, onPointerOut }) => {
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={hovered ? '#FFFF00' : color} />
    </mesh>
  );
});

const ConstellationLines = React.memo(({ stars, lines, radius, color }) => {
  const points = useMemo(() => stars.map(star => toSpherical(radius, star.ra, star.dec)), [stars, radius]);
  
  return (
    <group>
      {lines.map((line, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...points[line[0]].toArray(), ...points[line[1]].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} linewidth={2} />
        </line>
      ))}
    </group>
  );
});

function StarMap() {
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [hoveredConstellation, setHoveredConstellation] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const constellationRadius = 350;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAccelerometerMode, setIsAccelerometerMode] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const starMapRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const [manualAdjustment, setManualAdjustment] = useState({ x: 0, y: 0, z: 0 });
  const [sensitivity, setSensitivity] = useState(1);
  const [cameraRotation, setCameraRotation] = useState(new THREE.Euler());
  const starSize = 3;
  const starColor = '#FFFFFF';
  const lineColor = '#4169E1'; 
  const handleCameraRotation = useCallback((rotation) => {
    setCameraRotation(rotation);
  }, []);
  const handleConstellationClick = useCallback((constellation) => {
    setSelectedConstellation(constellation);
    setInfoVisible(true);
  }, []);

  const handleStarHover = useCallback((constellation) => {
    setHoveredConstellation(constellation);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      starMapRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (infoVisible) {
      const timer = setTimeout(() => {
        setInfoVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [infoVisible]);

  const toggleAccelerometerMode = useCallback(() => {
    setIsAccelerometerMode(prev => !prev);
  }, []);

  useEffect(() => {
    if (isAccelerometerMode) {
      // Запрашиваем геолокацию пользователя
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Ошибка получения местоположения пользователя:", error),
        { enableHighAccuracy: true }
      );

      // Запрашиваем разрешение на использование датчиков устройства
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            } else {
              console.error('Отказано в доступе к ориентации устройства');
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    }
  }, [isAccelerometerMode]);
  const handleOrientation = useCallback((event) => {
    setDeviceOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    });
  }, []);
  const handleManualAdjustment = useCallback((axis, value) => {
    setManualAdjustment(prev => ({
      ...prev,
      [axis]: prev[axis] + value * sensitivity
    }));
  }, [sensitivity]);
  const handleSensitivityChange = useCallback((event) => {
    setSensitivity(parseFloat(event.target.value));
  }, []);

  const calibrateOrientation = useCallback(() => {
    setIsCalibrating(true);
    // Здесь должна быть логика калибровки
    setTimeout(() => {
      setIsCalibrating(false);
    }, 3000); // Имитация процесса калибровки в течение 3 секунд
  }, []);

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: '1px solid white',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div ref={starMapRef} style={{ position: 'relative', height: '600px', width: '100%' }}>
      <Canvas style={{ background: 'black' }}>
        <OrbitControls 
          ref={orbitControlsRef}
          enableRotate={!isAccelerometerMode}
          enablePan={!isAccelerometerMode}
          enableZoom={!isAccelerometerMode}
          onChange={(e) => {
            if (!isAccelerometerMode) {
              handleCameraRotation(e.target.object.rotation);
            }
          }}
        />
        <StarMapController 
          isAccelerometerMode={isAccelerometerMode}
          deviceOrientation={deviceOrientation}
          userLocation={userLocation}
        />
        <group rotation={cameraRotation}>
          <ambientLight intensity={0.5} />
          <Stars
            radius={130}
            depth={60}
            count={10000}
            factor={4}
            saturation={0}
            fade
          />
          {constellations.map((constellation, idx) => (
            <group key={idx}>
              {constellation.stars.map((star, starIdx) => {
                const position = toSpherical(constellationRadius, star.ra, star.dec);
                return (
                  <Star
                    key={starIdx}
                    position={position.toArray()}
                    size={starSize}
                    color={starColor}
                    hovered={hoveredConstellation === constellation}
                    onClick={() => handleConstellationClick(constellation)}
                    onPointerOver={() => handleStarHover(constellation)}
                    onPointerOut={() => handleStarHover(null)}
                  />
                );
              })}
              <ConstellationLines 
                stars={constellation.stars}
                lines={constellation.lines}
                radius={constellationRadius} 
                color={lineColor}
              />
            </group>
          ))}
        </group>
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <button onClick={toggleFullScreen} style={buttonStyle}>
          {isFullScreen ? 'Свернуть' : 'На весь экран'}
        </button>
        <button onClick={toggleAccelerometerMode} style={buttonStyle}>
          {isAccelerometerMode ? 'Выключить акселерометр' : 'Включить акселерометр'}
        </button>
        <p style={{ margin: 0, fontSize: '12px' }}>
          {isAccelerometerMode 
            ? 'Двигайте устройство, чтобы осмотреться' 
            : 'Зажмите для вращения карты звездного неба'}
        </p>
        <p style={{ margin: 0, fontSize: '12px' }}>Нажмите на звезду созвездия, чтобы увидеть информацию о нем</p>
      </div>

      {isAccelerometerMode && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 1000
        }}>
          <button onClick={calibrateOrientation} style={buttonStyle}>Перекалибровать</button>
        </div>
      )}

      {isCalibrating && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1000
        }}>
          Калибровка...
        </div>
      )}

      {selectedConstellation && infoVisible && (
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
      )}
    </div>
  );
}

export default StarMap;