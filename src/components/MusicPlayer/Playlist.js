import React from 'react';
import styled from 'styled-components';
import './Playlist.css'

const Container = styled.div`
position: relative;
display: flex;
    flex: 1 1 30%;
    font-size: 16pt;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #2c3e50;
    border-radius: 10px 10px 0 0;
    color: white;
    padding: 10px 0;
    max-height: 300px;
    
`
const ButtonContainer = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.3);
  }
`;

const PlayPauseButton = styled.div`
  width: 14px;
  height: 14px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    left: ${props => props.isPlaying & props.track == props.currentTrack ? '0' : '2px'};
    top: 0;
    width: ${props => props.isPlaying & props.track == props.currentTrack ? '4px' : '0'};
    height: 14px;
    background: #3498DB;
  }

  &::after {
    right: ${props => props.isPlaying & props.track == props.currentTrack ? '0' : '-2px'};
    top: ${props => props.isPlaying & props.track == props.currentTrack ? '0' : '-1px'};
    width: ${props => props.isPlaying & props.track == props.currentTrack ? '4px' : '0'};
    height: ${props => props.isPlaying & props.track == props.currentTrack ? '14px' : '0'};
    background: ${props => props.isPlaying & props.track == props.currentTrack ? '#3498DB' : 'transparent'};
    border-style: solid;
    border-width: ${props => props.isPlaying & props.track == props.currentTrack ? '0' : '8px 0 8px 12px'};
    border-color: ${props => props.isPlaying & props.track == props.currentTrack ? 'transparent' : 'transparent transparent transparent #3498DB'};
  }
`;
const MyUl = styled.ul`
list-style-type: none;
display: flex;
flex-direction: column;
flex: 1 1 auto;
width: 100%;
overflow-y: scroll;
scrollbar-width: thin; /* для Firefox */
scrollbar-color: #3498DB #2c3e50; /* цвет "бегунка" и трека для Firefox */

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ff7f00;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #34495E;
  }

li{
    display: flex;
    border-radius: 10px;
    padding: 7px;
    justify-content: space-between;
    margin: 5px;
    background-color: #34495E;
    color: white;
    font-size: 18pt;
    transition: all 0.2s ease-out;
    &:hover{
      background-color: #FFD1A0;
      color: black;
    }
}
li.active{
    background-color: #de2f2f;
}
`
function Playlist({ tracks, onTrackSelect, currentTrack, isPlaying }) {
  return (
    <Container className="playlist">
      <h3>Плейлист</h3>
      <MyUl>
        {tracks.map((track) => (
          <li
            key={track.id} 
            className={track.id === currentTrack.id ? 'active' : ''}
          >
            <span>{track.title}<span style={{fontSize: '10pt',}}>{track.artist}</span></span>
            <ButtonContainer onClick={() => {
                onTrackSelect(track, currentTrack)
                }} class="play-button-container">
                <PlayPauseButton isPlaying={isPlaying} track = {track} currentTrack={currentTrack} />
            </ButtonContainer>
          </li>
        ))}
      </MyUl>
    </Container>
  );
}

export default Playlist;