import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import './Card.css'
import { S3_ROUTE } from '../../utils/const';

const Img = styled.div`
display: flex;
flex: 1 1 auto;
max-width: 100%;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
min-height: 200px;
border-radius: 5px;
`
const Text = styled.div`
display: flex;
flex: 0 1 auto;
max-width: 100%;
border-radius: 15px;
margin: 10px 0;
flex-wrap: wrap;
h3{
    width: 100%;
    margin: 0;
}
p{
    margin: 0;
}
`
const Card = (props) => {
  return (
    <Link className='linkCard' to={props.link}>
        <Img style={{backgroundImage: `url('${S3_ROUTE}${props.img}')`,}}>

        </Img>
        <Text>
            <h3>{props.name}</h3>
            <p>
                {props.description}
            </p>
            <p>
                {props.technologies}
            </p>
        </Text>
    </Link>
  );
};

export default Card;
