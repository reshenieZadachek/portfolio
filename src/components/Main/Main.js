import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.main`
  display: flex;
  margin-top: 60px;
  flex: 1;
  background:  #ddffff;
  justify-content: center;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  color: #2c3e50;
  justify-content: center;
`;

const Main = ({children}) => {
  return (
    <MainContainer>
      <MainContent>
        {children}     
      </MainContent>
    </MainContainer>
  );
};

export default Main;
