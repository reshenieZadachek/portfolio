import React from 'react';
import styled from 'styled-components';
import City from './City/City';

const GeoDateContainer = styled.div`
  display: flex;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const GeoDate = ({ handleWeatherUpdate }) => {
  return (
  <GeoDateContainer>
    <City onWeatherUpdate={handleWeatherUpdate} />
  </GeoDateContainer>);
};

export default GeoDate;
