import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MAIN_ROUTE, ABOUTME_ROUTE, S3_ROUTE } from '../../utils/const';
import './MobileNemu.css'
const MenuIcon = styled.div`
  width: 30px;
  height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  z-index: 10;
`;

const MenuLine = styled.div`
  width: 100%;
  height: 4px;
  background-color: black;
  transition: transform 0.3s ease, opacity 0.3s ease;
  position: absolute;
  left: 0;
  right: 0;
`;

const MenuLine1 = styled(MenuLine)`
  top: ${({ isOpen }) => isOpen ? '50%' : '0'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(-50%) rotate(45deg)' : 'none'};
`;

const MenuLine2 = styled(MenuLine)`
  top: 50%;
  transform: translateY(-50%);
  opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
`;

const MenuLine3 = styled(MenuLine)`
  bottom: ${({ isOpen }) => isOpen ? '50%' : '0'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(50%) rotate(-45deg)' : 'none'};
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  background-color: #2C3E50;
  z-index: 1001;
`;

const MenuList = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  a{
    margin: 20px 0;
  color: white;
  font-size: 24px;
  cursor: pointer;
  }
`;

const MobileMenuContainer = styled.div`
  display: none;
  justify-content: flex-start;
  align-items: center;
  background-color: lightgrey;
  padding: 5px;
  border-radius: 5px;
  z-index: 1002;
  @media screen and (max-width:505px){
    display: flex;
  }
`;

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <MobileMenuContainer>
        <MenuIcon onClick={toggleMenu}>
          <MenuLine1 isOpen={isOpen} />
          <MenuLine2 isOpen={isOpen} />
          <MenuLine3 isOpen={isOpen} />
        </MenuIcon>
      </MobileMenuContainer>
      <MenuContainer isOpen={isOpen}>
        <MenuList>
          <Link className='MobileNemu' to={MAIN_ROUTE} onClick={toggleMenu}>Главная</Link>
          <Link className='MobileNemu' to={ABOUTME_ROUTE} onClick={toggleMenu}>Обо мне</Link>
          <Link className='MobileNemu' to={`${S3_ROUTE}resume.pdf`} onClick={toggleMenu}>Скачать резюме</Link>
        </MenuList>
      </MenuContainer>
    </>
  );
};

export default MobileMenu;
