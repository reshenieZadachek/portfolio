import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DayTimeline from '../../DayTimeline';

const WeatherContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px;
  border-radius: 10px;
  flex: 1;
  div{
    color: #2c3e50;
    transition: all 0.3s ease;
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  padding: 0 10px;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  
  @media screen and (max-width: 430px){
    justify-content: center;
  }
  h3{
    color: #34495E;
  }
  
`;

const WeatherContent = styled.div`
  padding: 5px 10px;
  flex: 1 1 25%;
  min-width: 150px;
  justify-content: flex-start;
  max-width: 25%;
  flex-direction: column;
  background-color: #bddab2;
  color: #2C3E50;
  box-shadow: black 0px 0px 10px;
  margin: 10px 10px;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  p{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    /*box-shadow: 0 4px 15px -2px gray;*/
  }
  p span{
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 1 auto;
  }
  &:hover{
    background: #a9d997;
  }
  @media screen and (max-width: 960px){
    flex: 1 1 40%;
    max-width: 40%;
  }
  @media screen and (max-width: 500px){
    max-width: unset;
  }
`;

const WeatherIcon = styled.img`
  width: 30px;
  height: 30px;
`;
const OneDay = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background-color: #000000a6;
    display: flex;
    color: #d81b60;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.5s ease-in;
    z-index: 1000;
`;
const OneDayCont = styled.div`
    font-size: 16pt;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 10px;
    max-width: 500px;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    max-height: 500px;
`;
const InfoDef = styled.div`
display: flex;
justify-content: space-around;
flex: 1 1 auto;
width: 100%;
min-height: 50px;
span{
  display: flex;
  justify-content: center;
  align-items: center;
}
`;
const InfoPlus = styled.div`
display: flex;
flex: 1 1 auto;
width: 100%;
max-height: 200px;
`;
const InfoGraph = styled.div`
display: flex;
flex: 1 1 auto;
width: 100%;
min-height: 100px;
`;
const InfoPlusSection = styled.div`
display: flex;
flex: 1 1 30%;
padding: 5px;
min-height: 50px;
`;


const Weather = ({ weatherData }) => {
  const [ dailyForecasts, setDailyForecasts ] = useState([]);
  const [ allDailyForecasts, setAllDailyForecasts ] = useState([]);
  const [selectedTemperature, setSelectedTemperature] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedWindSpeed, setSelectedWindSpeed] = useState(null);
  const [selectedHumidity, setSelectedHumidity] = useState(null);
  const [ oneDayShow, setOneDayShow ] = useState(false)
  const Text = 'вашем городе'
  const getDayOfWeek = (date) => {
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return daysOfWeek[date.getDay()];
  };
  const filterForecastsForAllDays = (list) => {
    const uniqueForecasts = {};
    
    list.forEach((forecast) => {
      const forecastDate = new Date(forecast.dt * 1000);
      const dayKey = forecastDate.toDateString();
      const isNoonForecast = forecast.dt_txt.includes("12:00:00");
      
      if (!uniqueForecasts[dayKey] || isNoonForecast) {
        uniqueForecasts[dayKey] = forecast;
      }
    });
    
    return Object.values(uniqueForecasts);
  };
  function filterForecastsForOneDay(list, date){
    return list.filter((forecast) => {
      const isNoonForecast = forecast.dt_txt.includes(date);
      return isNoonForecast;
    });
  };
  function getSelectedTemperature(forecasts) {
    const today = new Date().toISOString().split('T')[0];
    const forecastDate = new Date(forecasts[0].dt * 1000).toISOString().split('T')[0];
    const isToday = forecastDate === today;
  
    if (isToday) {
      // Для текущего дня выбираем ближайший прогноз к текущему времени
      const now = new Date();
      const closestForecast = forecasts.reduce((closest, forecast) => {
        const forecastTime = new Date(forecast.dt * 1000);
        const closestTime = new Date(closest.dt * 1000);
        return Math.abs(forecastTime - now) < Math.abs(closestTime - now) ? forecast : closest;
      });
      return closestForecast.main.temp;
    } else {
      // Для не текущего дня ищем прогноз на 12:00
      const noonForecast = forecasts.find(forecast => 
        forecast.dt_txt.includes("12:00:00")
      );
      return noonForecast ? noonForecast.main.temp : forecasts[0].main.temp;
    }
  }
  function getSelectedWeatherInfo(forecasts) {
    const today = new Date().toISOString().split('T')[0];
    const forecastDate = new Date(forecasts[0].dt * 1000).toISOString().split('T')[0];
    const isToday = forecastDate === today;
  
    let selectedForecast;
  
    if (isToday) {
      const now = new Date();
      selectedForecast = forecasts.reduce((closest, forecast) => {
        const forecastTime = new Date(forecast.dt * 1000);
        const closestTime = new Date(closest.dt * 1000);
        return Math.abs(forecastTime - now) < Math.abs(closestTime - now) ? forecast : closest;
      });
    } else {
      selectedForecast = forecasts.find(forecast => 
        forecast.dt_txt.includes("12:00:00")
      ) || forecasts[0];
    }
  
    return {
      description: selectedForecast.weather[0].description,
      icon: selectedForecast.weather[0].icon,
      windSpeed: selectedForecast.wind.speed,
      humidity: selectedForecast.main.humidity
    };
  }
  useEffect(() => {
    weatherData && setDailyForecasts(filterForecastsForAllDays(weatherData.list))
  },[weatherData])
  return(
  <WeatherContainer style={weatherData ? {} : {alignItems: 'flex-start'}}>
    <WeatherInfo style={weatherData? {}: {justifyContent: 'center',}}>
{weatherData?
  <>
    <h3 style={{display:'flex', width: '100%',justifyContent: 'center', alignItems: 'center',marginBottom: '10px'}}>Прогноз погоды для {weatherData.city.name}</h3>
    {dailyForecasts.map((forecast, index) => (
      <WeatherContent onClick={() => {
        const selectedForecasts = filterForecastsForOneDay(weatherData.list, forecast.dt_txt.slice(0,10));
        setAllDailyForecasts(selectedForecasts);
        const temperature = getSelectedTemperature(selectedForecasts);
        setSelectedTemperature(temperature);
        const { description, icon, windSpeed, humidity } = getSelectedWeatherInfo(selectedForecasts);
        setSelectedDescription(description);
        setSelectedIcon(icon);
        setSelectedWindSpeed(windSpeed);
        setSelectedHumidity(humidity);
        setOneDayShow(true);
      }} key={index}>
        <p style={index === 0?{color:'#E74C3C', textAlign:'center', justifyContent: 'center',}:{textAlign:'center', justifyContent: 'center',}}></p>
        <p style={index === 0?{color:'#E74C3C', textAlign:'center', justifyContent: 'space-around', fontWeight: 'bold',}:{textAlign:'center', justifyContent: 'space-around',fontWeight: 'bold',}}><span>{index === 0?'Сегодня':getDayOfWeek(new Date(forecast.dt * 1000))}</span> <span>{new Date(forecast.dt * 1000).toLocaleDateString()}</span></p>
        <p><span>Температура: </span><span style={{fontSize: '1.2em', fontWeight: 'bold', color: (
          forecast.main.temp > 25
          ?
          'red'
          :
            forecast.main.temp > 10
            ?
            '#ff6800'
            :
            'blue'
          )}}>{forecast.main.temp}°C</span></p>
        <p style={{display: 'flex', width:'100%',}}><span>Описание:</span> <span style={{ fontWeight: 'bold', display: 'flex', textAlign: 'end',}}><span>{forecast.weather[0].description}</span><WeatherIcon src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt={forecast.weather[0].description} /></span></p>
      </WeatherContent>
    ))}
    </>
  :
  <>
    <h3 style={{display:'flex', width: '100%',justifyContent: 'center', alignItems: 'center', margin: '0 0 10px 0'}}>Погода в {Text}</h3>
    <WeatherContent style={{textAlign: 'center', justifyContent: 'center',}}>
      <p>Дата</p>
      <p>Температура</p>
      <p>Описание</p>
      <p>Влажность</p>
      <p>Ветер</p>
    </WeatherContent>
    </>
  
}
{oneDayShow && 
<OneDay>
  <OneDayCont>
    <span onClick={() => setOneDayShow(false)} style={{color: 'black', position: 'absolute', right: '15px', top: '5px', cursor: 'pointer'}}>X</span>
    <InfoDef>
      <span>{weatherData.city.name}</span>
      <span>{selectedTemperature !== null ? `${selectedTemperature.toFixed(0)}°` : 'N/A'}</span>
    </InfoDef>
    <InfoPlus>
      <InfoPlusSection style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {selectedIcon && 
          <img 
            src={`http://openweathermap.org/img/wn/${selectedIcon}@2x.png`} 
            alt="Weather icon" 
            style={{width: '50px', height: '50px'}}
          />
        }
        {selectedDescription && 
          <span style={{fontSize: '14px', textAlign: 'center'}}>{selectedDescription}</span>
        }
      </InfoPlusSection>
      <InfoPlusSection style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontSize: '24px'}}>💨</span>
        <span style={{fontSize: '14px'}}>Ветер</span>
        <span style={{fontSize: '16px', fontWeight: 'bold'}}>{selectedWindSpeed !== null ? `${selectedWindSpeed.toFixed(1)} м/с` : 'N/A'}</span>
      </InfoPlusSection>
      <InfoPlusSection style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontSize: '24px'}}>💧</span>
        <span style={{fontSize: '14px'}}>Влажность</span>
        <span style={{fontSize: '16px', fontWeight: 'bold'}}>{selectedHumidity !== null ? `${selectedHumidity}%` : 'N/A'}</span>
      </InfoPlusSection>
    </InfoPlus>
    <InfoGraph>
      <DayTimeline forecastData={allDailyForecasts.map(forecast => ({
        time: forecast.dt_txt.split(' ')[1].slice(0, 5),
        icon: forecast.weather[0].icon,
        temp: Math.round(forecast.main.temp),
        wind: forecast.wind.speed,
        humidity: forecast.main.humidity,
        description: forecast.weather[0].description
      }))} />
    </InfoGraph>
  </OneDayCont>
</OneDay>
}
  </WeatherInfo>
  </WeatherContainer>
  )
};

export default Weather;
