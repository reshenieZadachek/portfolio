import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  width: 100%;
  background-color: #f0f8ff;
  cursor: grab;
  user-select: none;
  &:active {
    cursor: grabbing;
  }
  /* Скрываем полосу прокрутки для Chrome, Safari и Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Скрываем полосу прокрутки для IE, Edge и Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ForecastCard = styled.div`
  min-width: 100px;
  margin: 0 10px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Time = styled.div`
  font-size: 14px;
  color: #ff69b4;
  margin-bottom: 5px;
`;

const Temperature = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #ff69b4;
  margin: 5px 0;
`;

const WeatherInfo = styled.div`
  font-size: 12px;
  color: #ff69b4;
`;

const WeatherIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const DayTimeline = ({ forecastData }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1; // Множитель определяет скорость скролла
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <TimelineContainer ref={containerRef}>
      {forecastData.map((forecast, index) => (
        <ForecastCard key={index}>
          <Time>{forecast.time}</Time>
          <WeatherIcon 
            src={`http://openweathermap.org/img/wn/${forecast.icon}.png`} 
            alt={forecast.description} 
          />
          <Temperature>{forecast.temp}°C</Temperature>
          <WeatherInfo>Ветер: {forecast.wind} м/с</WeatherInfo>
          <WeatherInfo>Влажность: {forecast.humidity}%</WeatherInfo>
        </ForecastCard>
      ))}
    </TimelineContainer>
  );
};

export default DayTimeline;