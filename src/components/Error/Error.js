import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MAIN_ROUTE } from '../../utils/const';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00796b;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 24px;
  margin-bottom: 32px;
`;

const StyledLink = styled(Link)`
  font-size: 18px;
  color: #004d40;
  text-decoration: none;
  border: 2px solid #004d40;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #004d40;
    color: #e0f7fa;
  }
`;

function NotFound() {
  return (
    <Container>
      <Title>404</Title>
      <Message>Упс! Страница не найдена.</Message>
      <StyledLink to={MAIN_ROUTE}>Вернуться на главную</StyledLink>
    </Container>
  );
}

export default NotFound;
