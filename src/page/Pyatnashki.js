import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledGame = styled.div`
  user-select: none;
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
`;

const Korob = styled.div`
  margin: auto;
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 1 / 1;
   // Увеличено для лучшей видимости
`;

const Pole = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5%;
  margin: auto;
  margin-top: 0.5%;
  width: 98%;
  height: 98%;
  background: #2c3e50;
  border: 5px solid #2c3e50; // Увеличено для лучшей видимости
`;

const Fishka = styled.div`
  background: #6abbf1;
  border: 2px solid black; // Увеличено для лучшей видимости
  border-radius: 10px; // Увеличено с 5px
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Zero = styled(Fishka)`
  background: #2c3e50;
  border-color: #2c3e50;
`;

const Button = styled.div`
  padding: 5px;
  border: 2px solid black; // Увеличено для лучшей видимости
  border-radius: 10px; // Увеличено с 5px
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  font-size: 2rem; // Увеличен размер шрифта
  cursor: pointer;
  background-color: #2c3e50;
    color: white;
`;

const Number = styled.div`
  font-size: 10vw; // Увеличено с 5vw
  color: black;
  @media (min-width: 1320px) { // Изменено с 660px
    font-size: 4rem; // Увеличено с 2rem
  }
`;

const Timer = styled.div`
  font-size: 3rem; // Увеличено с 1.5rem
  text-align: center;
  margin-bottom: 2rem;
`;


const Pyatnashki = () => {
  const [tiles, setTiles] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    shuffle();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const move = (index) => {
    const zeroIndex = tiles.findIndex((tile) => tile === 0);
    if (
      (index === zeroIndex + 1 && (zeroIndex + 1) % 4 !== 0) ||
      (index === zeroIndex - 1 && zeroIndex % 4 !== 0) ||
      index === zeroIndex + 4 ||
      index === zeroIndex - 4
    ) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[zeroIndex]] = [newTiles[zeroIndex], newTiles[index]];
      setTiles(newTiles);
      if (!isRunning) setIsRunning(true);
      checkWin(newTiles);
    }
  };

  const shuffle = () => {
    let newTiles;
    do {
      newTiles = Array.from({length: 15}, (_, i) => i + 1);
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
      newTiles.push(0); // Добавляем пустую клетку в конец
    } while (!isSolvable(newTiles));
    
    setTiles(newTiles);
    setTime(0);
    setIsRunning(false);
  };
  
  const isSolvable = (tiles) => {
    let inversions = 0;
    for (let i = 0; i < 15; i++) {
      for (let j = i + 1; j < 15; j++) {
        if (tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const checkWin = (currentTiles) => {
    const winCondition = currentTiles.every((tile, index) => {
      if (index === 15) {
        return tile === 0; // Последняя плитка должна быть пустой (0)
      } else {
        return tile === index + 1; // Остальные плитки должны соответствовать их позиции + 1
      }
    });
  
    if (winCondition) {
      alert(`Молодец! Ты справился, твой результат: ${formatTime(time)}`);
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <StyledGame>
      <Timer>{formatTime(time)}</Timer>
      <Korob>
        <Pole>
          {tiles.map((tile, index) => 
            tile === 0 ? (
              <Zero key={index} />
            ) : (
              <Fishka key={index} onClick={() => move(index)}>
                <Number>{tile}</Number>
              </Fishka>
            )
          )}
        </Pole>
        <Button onClick={shuffle}>перемешать</Button>
      </Korob>
    </StyledGame>
  );
};

export default Pyatnashki;