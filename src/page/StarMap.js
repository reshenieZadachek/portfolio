import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
//import StarMapController from '../components/StarMap/CameraController';

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
function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera, scene } = useThree();
  const orbitControlsRef = useRef();
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.1;
  const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const initialOrientation = useRef(null);
  const starsGroup = useRef(null);

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      if (!starsGroup.current) {
        starsGroup.current = new THREE.Group();
        scene.add(starsGroup.current);
      }
      camera.position.set(0, 0, 0);
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);
      starsGroup.current.rotation.y = -siderealTime;
      starsGroup.current.rotation.x = -latitudeRotation;
      scene.children.forEach(child => {
        if (child.type === 'Group' && child !== starsGroup.current) {
          starsGroup.current.add(child);
        }
      });
      initialOrientation.current = null;
    } else {
      if (starsGroup.current) {
        scene.remove(starsGroup.current);
        starsGroup.current.children.forEach(child => {
          scene.add(child);
        });
        starsGroup.current = null;
      }
    }
  }, [isAccelerometerMode, userLocation, scene, camera]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTime;

      if (!initialOrientation.current) {
        initialOrientation.current = { ...deviceOrientation };
      }

      const alpha = (deviceOrientation.alpha - initialOrientation.current.alpha + 360) % 360;
      const beta = deviceOrientation.beta - initialOrientation.current.beta;
      const gamma = deviceOrientation.gamma - initialOrientation.current.gamma;

      smoothedOrientation.current.alpha = THREE.MathUtils.lerp(smoothedOrientation.current.alpha, alpha, smoothFactor);
      smoothedOrientation.current.beta = THREE.MathUtils.lerp(smoothedOrientation.current.beta, beta, smoothFactor);
      smoothedOrientation.current.gamma = THREE.MathUtils.lerp(smoothedOrientation.current.gamma, gamma, smoothFactor);

      const alphaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.alpha);
      const betaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.beta);
      const gammaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.gamma);

      const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ')
      );

      camera.quaternion.setFromRotationMatrix(rotationMatrix);

      const up = new THREE.Vector3(0, 1, 0);
      camera.up.copy(up);
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enableRotate={!isAccelerometerMode}
      enablePan={false}
      enableZoom={true}
      minDistance={10}
      maxDistance={1000}
    />
  );
}

function calculateSiderealTime(longitude, date) {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const julianDays = (date - J2000) / (1000 * 60 * 60 * 24);
  const centuries = julianDays / 36525;
  let siderealTime = 280.46061837 + 360.98564736629 * julianDays +
                     0.000387933 * centuries * centuries -
                     centuries * centuries * centuries / 38710000;
  siderealTime = siderealTime % 360;
  return THREE.MathUtils.degToRad(siderealTime + longitude);
}
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAccelerometerMode, setIsAccelerometerMode] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const starMapRef = useRef(null);
  const constellationRadius = 350;
  const starSize = 3;
  const starColor = '#FFFFFF';
  const lineColor = '#4169E1';

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

  const toggleAccelerometerMode = useCallback(() => {
    setIsAccelerometerMode(prev => !prev);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (isAccelerometerMode) {
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

      const handleOrientation = (event) => {
        setDeviceOrientation({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0
        });
      };

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

  return (
    <div ref={starMapRef} style={{ position: 'relative', height: '600px', width: '100%' }}>
      <Canvas style={{ background: 'black' }}>
      {!isAccelerometerMode && (
          <OrbitControls 
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
          />
        )}
      <PerspectiveCamera makeDefault position={[0, 0, 0]} />
        <StarMapController 
          isAccelerometerMode={isAccelerometerMode}
          deviceOrientation={deviceOrientation}
          userLocation={userLocation}
        />
        <Stars
          radius={130}
          depth={60}
          count={10000}
          factor={4}
          saturation={0}
          fade
        />
        <group>
          <ambientLight intensity={0.5} />
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
      
      {/* UI элементы остаются без изменений */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={toggleFullScreen}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isFullScreen ? 'Свернуть' : 'На весь экран'}
        </button>
        <button
          onClick={() => setIsAccelerometerMode(!isAccelerometerMode)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: '1px solid white',
            padding: '10px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isAccelerometerMode ? 'Свернуть' : 'Запустить вращение карты звездного неба'}
        </button>
      </div>

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