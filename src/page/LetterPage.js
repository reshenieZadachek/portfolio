import React, { useState } from 'react';
import styled from 'styled-components';
import BackgroundMusic from '../components/LetterCont/BackgroundMusic';
import FallingPetals from '../components/LetterCont/FallingPetals';
import Letter from '../components/LetterCont/Letter';
const bg = require(`../components/LetterCont/img/bg.jpg`);

const AppContainer = styled.div`
  overflow: hidden;
  max-width: 1200px;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  position: relative;
  
`;
const Div = styled.div`
position: relative;
padding: 20px;
display: flex;
flex: 1 1 auto;
max-width: 500px;
justify-content: center;
align-items: center;
height: 100%;
    background: url(${bg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`
const LetterPage = () => {
    const [ activate, setActivate ] = useState(false)
  return (
    <>
        <AppContainer>
            <Div>
            <FallingPetals />
            <BackgroundMusic activate={activate} setActivate={setActivate} />
            {activate && <Letter />}
            </Div>
        </AppContainer>
    </>
  );
};

export default LetterPage;
