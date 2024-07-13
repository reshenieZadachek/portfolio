import React, { useState } from 'react';
import styled from 'styled-components';
import OSMMap from './Map/Map';
import axios from 'axios';
import { OPENWEATHERMAP_API_KEY } from './constants';

const CityContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const CityInput = styled.input`
  outline: none;
  height: 50px;
  margin: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
  :focus{
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  }
`;

const SuggestionList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  list-style-type: none;
  width: 100%;
  left: 50%;
  top: 52px;
  padding: 0;
  margin: 10px;
  transform: translate(-50%);
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1002;
  color: #2c3e50;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  width: 100%;
  flex: 1 1 auto;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MapContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 250px;
  max-height: 400px;
`;



const russianCities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Нижний Новгород',
  'Казань', 'Челябинск', 'Омск', 'Самара', 'Ростов-на-Дону', 'Уфа', 'Красноярск',
  'Пермь', 'Воронеж', 'Волгоград'
];
const City = ({ onWeatherUpdate }) => {
  //const [cities, setCities] = useState([]);

  //useEffect(() => {
  //  fetch('../../../../city/region.csv')
  //    .then(response => response.text())
  //    .then(data => {
  //      Papa.parse(data, {
  //        header: true,
  //        complete: (results) => {
  //          const cityOptions = results.data.map(city => {(
  //          console.log(city)
  //          )});
  //          setCities(cityOptions);
            
  //        }
  //      });
  //    });
  //}, []);
  //  console.log(cities);

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 0) {
      const filteredCities = russianCities.filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredCities);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setInputValue(city);
    setShowSuggestions(false);
    getWeather(city);
  };

  const getWeather = async (query) => {
    setLoading(true);
  setError(null);
  try {
    let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=ru`;
    if (typeof query === 'string') {
      url += `&q=${query}`;
    } else {
      url += `&lat=${query.lat}&lon=${query.lon}`;
    }
    const response = await axios.get(url);
    onWeatherUpdate(response.data);
    setInputValue(response.data.city.name);
    setSelectedCity({
      name: response.data.city.name,
      lat: response.data.city.coord.lat,
      lon: response.data.city.coord.lon
    });
  } catch (error) {
    setError('Не удалось получить данные о погоде');
    console.error('Ошибка при получении погоды:', error);
    setSelectedCity(null);
  } finally {
    setLoading(false);
  }
  };

  const handleMapClick = (lat, lon) => {
    getWeather({ lat, lon });
  };

  return (
    <>
      <CityContainer>
        <CityInput
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Введите название города"
        />
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionList>
            {suggestions.map((city, index) => (
              <SuggestionItem key={index} onClick={() => handleSuggestionClick(city)}>
                {city}
              </SuggestionItem>
            ))}
          </SuggestionList>
        )}
      </CityContainer>
      <MapContainer>
        <OSMMap 
          key={selectedCity ? `${selectedCity.lat}-${selectedCity.lon}` : 'default'}
          selectedCity={selectedCity} 
          onMapClick={handleMapClick} 
        />
      </MapContainer>
      {loading && <p>Загрузка погоды...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </>
  );
};

export default City;