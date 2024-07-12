import React, { useState } from 'react';
import Weather from '../components/WeatherCont/Weather/Weather';
import GeoDate from '../components/WeatherCont/GeoDate/GeoDate';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const handleWeatherUpdate = (data) => {
    setWeatherData(data);
  };
  return (
    <>
      <GeoDate handleWeatherUpdate={handleWeatherUpdate} />
      <Weather weatherData={weatherData} />
    </>
  );
};

export default WeatherPage;
