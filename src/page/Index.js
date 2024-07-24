import React from 'react';
import styled from 'styled-components';
import Card from '../components/Index/Card';
import ProjectTimeline from '../components/ProjectTimeline';
import { KEYBOARDTRAINER_ROUTE, LETTER_ROUTE, MS_ROUTE, MUSIC_ROUTE, PYATNASHKU_ROUTE, STARMAP_ROUTE, WEATHER_ROUTE } from '../utils/const';

const Container = styled.div`
display: flex;
flex: 1 1 auto;
flex-direction: row;
justify-content: space-around;
flex-wrap: wrap;
padding: 10px;
padding: 10px;
`
const Row = styled.div`
display: flex;
flex: 1 1 auto;
width: 100%;
min-height: 300px;
flex-direction: row;
justify-content: space-around;
flex-wrap: wrap;
height: fit-content;
`
const BlockProject = styled.div`

  h2{
    text-align: center;
  }
`

const Main = () => {
    const PetProjects = [
        { id: 1, name: 'Погода', 
        description: 'Простое приложение погоды с адаптивным дизайном и удобным интерфейсом', 
        technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: 'weatherbanner.png',
        link: WEATHER_ROUTE,
        date: '2024-06-10',
      },
        { id: 2, name: 'Письмо', 
        description: 'Любовное письмо может быть рормантичным посланием для вашей второй половинки', 
        technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: 'letterbanner.png',
        link: LETTER_ROUTE,
        date: '2024-06-08',
      },
        { id: 3, name: 'Пятнашки', description: 'Воссоздание игры пятнашки в веб версии.', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: 'pyatnashki.png',
        link: PYATNASHKU_ROUTE,
        date: '2020-03-10',
      },
        { id: 4, name: 'Клавиатурный тренажер', description: 'Тренажер для повышения скорости печати. Только для ПК!', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: 'keyboardtrainer.png',
        link: KEYBOARDTRAINER_ROUTE,
        date: '2021-07-22',
      },
        { id: 5, name: 'Музыкальный плеер', description: 'Функции старт пауза треков, включение следующего трека из плейлиста, включение выбранного трека и визуализация.', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: 'music.png',
        link: MUSIC_ROUTE,
        date: '2024-07-10',
      },
        { id: 6, name: 'Карта звездного неба', description: 'Интерактивная карта звездного неба', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: '',
        link: STARMAP_ROUTE,
        date: '2024-07-22',
      },
        { id: 7, name: 'Карта звездного неба', description: 'Интерактивная карта звездного неба', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: '',
        link: STARMAP_ROUTE,
        date: '2024-07-22',
      },
        { id: 8, name: 'Карта звездного неба', description: 'Интерактивная карта звездного неба', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: '',
        link: STARMAP_ROUTE,
        date: '2024-07-22',
      },
        { id: 9, name: 'Карта звездного неба', description: 'Интерактивная карта звездного неба', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: '',
        link: STARMAP_ROUTE,
        date: '2024-07-22',
      },
        { id: 10, name: 'Карта звездного неба', description: 'Интерактивная карта звездного неба', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: '',
        link: STARMAP_ROUTE,
        date: '2024-07-22',
      },
        { id: 11, name: 'Карта звездного неба', description: 'Интерактивная карта звездного неба', technologies: 'HTML, CSS, JavaScript, React, Styled-components', 
        img: '',
        link: STARMAP_ROUTE,
        date: '2024-07-22',
      },
        // Add more projects as needed
      ];
    const ComProjects = [
        { id: 1, name: 'Moneyslide', 
        description: 'Платформа для обучения', 
        technologies: 'HTML, CSS, JavaScript, React, Styled-components, Webpack, S3, Axios, Node, Express, Sequelize, JWT, Postgress, websocket, Nginx, Git', 
        img: 'MS.png',
        link: MS_ROUTE,
        date: '2024-04-15',
      },
        // Add more projects as needed
      ];
      const chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
        );
        const PetRows = chunk(PetProjects, 3);
        const ComRows = chunk(ComProjects, 3);
  return (
    <Container>
      <BlockProject style={{maxWidth: '1200px'}}>
        <ProjectTimeline petProjects={PetProjects} comProjects={ComProjects} />
      </BlockProject>
      <BlockProject>
      <div style={{textAlign:'center'}}><h2>PET проекты</h2><span style={{fontSize: '10pt',}}>(по нажатию открывается полная версия проекта)</span></div>
        {PetRows.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map(project => (
            <Card
              key={project.id}
              name={project.name}
              description={project.description}
              technologies={project.technologies}
              img={project.img}
              link={project.link}
            />
          ))}
        </Row>
      ))}
      </BlockProject>
      <BlockProject>
        <h2>Коммерческие проекты</h2>
        {ComRows.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map(project => (
            <Card
              key={project.id}
              name={project.name}
              description={project.description}
              technologies={project.technologies}
              img={project.img}
              link={project.link}
            />
          ))}
        </Row>
      ))}
      </BlockProject>
    </Container>
  );
};

export default Main;
