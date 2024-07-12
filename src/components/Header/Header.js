import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MAIN_ROUTE, ABOUTME_ROUTE, S3_ROUTE } from '../../utils/const';
import MobileMenu from './MobileMenu';

const HeaderContainer = styled.header`
  width: 100%;
  position: fixed;
  z-index: 10000;
  top: 0px;
  background: #2c3e50;
  color: white;
  padding: 5px 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: white;
    text-decoration: none;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const Nav = styled.nav`
display: flex;
flex: 1 1 auto;
justify-content: flex-end;
padding: 5px;
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
  }
  
  li {
    margin-left: 1rem;
  }
  
  a {
    color: white;
    border-radius: 20px;
    margin: 0 5px;
    padding: 10px;
    border: 2px solid #6abbf1;
    text-decoration: none;
    transition: all 0.5s;
  }
  a:hover{
    background: #6abbf1;
  }
  @media screen and (max-width:505px){
    display: none;
}
`;

const Header = memo(() => {
  function handleDownload(e) {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = 'https://18a08574-5171-4f64-8962-6f8a13a0cf01.selstorage.ru/myPortfolio/resume.pdf';
    link.setAttribute('download', 'resume.pdf'); // Имя файла, под которым он будет сохранен
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <HeaderContainer>
      <Link style={{padding: '5px'}} to={'/'}><Logo>DevPortfolio</Logo></Link>
      <Nav>
        <Link to={MAIN_ROUTE}>Главная</Link>
        <Link to={ABOUTME_ROUTE}>Обо мне</Link>
        <Link to={`${S3_ROUTE}resume.pdf`} onClick={handleDownload}>Скачать резюме</Link>
      </Nav>
      <MobileMenu/>
    </HeaderContainer>
  );
});

export default Header;