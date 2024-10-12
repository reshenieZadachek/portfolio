import React from 'react';
import styled from 'styled-components';

const PortfolioContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-size: 14pt;
  font-family: Arial, sans-serif;
  color: #333;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const Subtitle = styled.h2`
  color: #2c3e50;
  margin-top: 10px;
`;

const Paragraph = styled.p`
  line-height: 1.6;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Strong = styled.strong`
  color: #34495e;
`;

const AboutMe = () => {
  return (
    <PortfolioContent>
      <Title>Обо мне</Title>
      
      <Paragraph>
        Я - увлеченный веб-разработчик с глубокими знаниями в области полного стека технологий. 
        Моя страсть к созданию инновационных цифровых решений позволяет мне разрабатывать современные, 
        высокопроизводительные и отзывчивые веб-приложения, отвечающие потребностям пользователей и бизнеса.
      </Paragraph>

      <Subtitle>Технический стек</Subtitle>
      
      <List>
        <ListItem><Strong>Фронтенд:</Strong> HTML5, CSS3, JavaScript (ES6+), React, Styled-components</ListItem>
        <ListItem><Strong>Стейт менеджеры:</Strong> Redux, MobX</ListItem>
        <ListItem><Strong>Бэкенд:</Strong> Node.js, Express, Sequelize, PostgreSQL</ListItem>
        <ListItem><Strong>Инструменты и оптимизация:</Strong> Webpack, Git, Nginx</ListItem>
        <ListItem><Strong>API и безопасность:</Strong> Axios, JWT, WebSocket</ListItem>
        <ListItem><Strong>Облачные технологии:</Strong> Amazon S3</ListItem>
      </List>

      <Subtitle>Мой подход</Subtitle>
      
      <Paragraph>
        В своей работе я уделяю особое внимание производительности, масштабируемости и безопасности 
        разрабатываемых решений. Постоянно слежу за новыми тенденциями в мире веб-разработки и 
        интегрирую передовые практики в свои проекты.
      </Paragraph>

      <Subtitle>Давайте работать вместе</Subtitle>
      
      <Paragraph>
        Готов применить свой опыт и знания для реализации ваших идей и создания высококачественных 
        веб-приложений. Если вы ищете разработчика, который сможет воплотить ваше видение в жизнь, 
        я буду рад обсудить ваш проект и предложить оптимальные решения.
      </Paragraph>

      <Paragraph>
        Свяжитесь со мной, чтобы узнать больше о моем опыте или обсудить потенциальное сотрудничество!
      </Paragraph>
    </PortfolioContent>
  );
};

export default AboutMe;
