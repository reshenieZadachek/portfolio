import React from 'react';
import styled from 'styled-components';
import { FaGithub } from "react-icons/fa";
import { BiLogoTelegram } from "react-icons/bi";
import { BiLogoGmail } from "react-icons/bi";

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: white;
  text-align: center;
  display: flex;
  padding: 1rem;
  justify-content: center;
  align-items: center;
`;

const SocialLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  
  a {
    color: white;
    margin: 0 0.5rem;
    text-decoration: none;
    transition: all 0.5s ease-out;
    
  }
  span{
    display: flex;
  justify-content: center;
  align-items: center;
  }
`;
const SocialLinksEl = styled.a`
  &:hover {
      color: ${(props) => props.hoverColor};
    }
`;

const Footer = () => {
  const ghColor = 'black'
  const tgColor = '#6abbf1'
  const gmailColor = '#e74c3c'
  return (
    <FooterContainer>
      <SocialLinks>
        <span><FaGithub style={{backgroundColor: 'white', color: ghColor, borderRadius: '50%',}}/><SocialLinksEl hoverColor={ghColor} href="https://github.com/reshenieZadachek" target="_blank" rel="noopener noreferrer">GitHub</SocialLinksEl></span>
        <span><BiLogoTelegram style={{color: tgColor,}} /><SocialLinksEl hoverColor={tgColor} href="https://t.me/JunDevReact" target="_blank" rel="noopener noreferrer">Telegram</SocialLinksEl></span>
        <span><BiLogoGmail style={{color: gmailColor,}} /><SocialLinksEl hoverColor={gmailColor} href="mailto:solominka25@gmail.com?subject=Портфолио&body=Привет, увидел твое портфолио и хотел бы узнать у тебя" target="_blank" rel="noopener noreferrer">Gmail</SocialLinksEl></span>
      </SocialLinks>
    </FooterContainer>
  );
};

export default Footer;