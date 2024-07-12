import React from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import Error from './components/Error/Error';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from './routes';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const Layout = ({ children }) => {
  return (
    <>
      <Header />
        <Main>
          {children}
        </Main>
      <Footer />
    </>
  );
}
const App = () => {
  return (
    <BrowserRouter>
      <AppContainer>
        <Layout>
            <Routes>
              {publicRoutes.map(({path, Component, ...rest}) =>
                <Route key={path} path={path} element = {<Component {...rest}/>} />)
              }
              <Route path="*" element={ <Error /> } />
            </Routes>
        </Layout>
      </AppContainer>
    </BrowserRouter >
  );
};

export default App;
