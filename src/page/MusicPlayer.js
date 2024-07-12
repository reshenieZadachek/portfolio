import React, { useState, useRef, useEffect } from 'react';
import PlayerControls from '../components/MusicPlayer/PlayerControls';
import Playlist from '../components/MusicPlayer/Playlist';
import AudioVisualizer from '../components/MusicPlayer/AudioVisualizer';
import CircularSeekbar from '../components/MusicPlayer/CircularSeekbar';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 1200px;
  align-items: center;
  justify-content: center;
`;

const PlayerContainer = styled.div`
position: relative;
  display: flex;
  flex: 1 1 70%;
  font-size: 16pt;
  color: white;
  justify-content: center;
  align-items: center;
`;

function MusicPlayer({ tracks }) {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(tracks[0].src));
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      gainNodeRef.current = audioContextRef.current.createGain();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceNodeRef.current.connect(gainNodeRef.current).connect(analyserRef.current).connect(audioContextRef.current.destination);
    }

    const onEnded = () => {
      if (currentTrack.id < tracks.length) {
        handleTrackChange(tracks[currentTrack.id]);
      } else {
        setIsPlaying(false);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.addEventListener('ended', onEnded);
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audioRef.current.removeEventListener('ended', onEnded);
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [currentTrack, tracks]);

  useEffect(() => {
    audioRef.current.src = currentTrack.src;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error('Error playing audio:', e));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error('Error playing audio:', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
  
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
  
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);
  const handleTrackChange = (newTrack, currentTrack) => {
    console.log(currentTrack);
    if(currentTrack === newTrack){
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      setIsPlaying(!isPlaying);
    }
    else{
      setCurrentTrack(newTrack);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackNext = () => {
    if (currentTrack.id < tracks.length) {
      handleTrackChange(tracks[currentTrack.id], currentTrack);
    }
    setIsPlaying(true);
  };

  const handleTrackPrev = () => {
    if (currentTrack.id > 1) {
      handleTrackChange(tracks[currentTrack.id - 2], currentTrack);
    }
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value / 100;
    const gain = Math.pow(volume, 2); // Используем квадратичное распределение для большей чувствительности на низких уровнях громкости
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(gain, audioContextRef.current.currentTime);
    }
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  return (
    <Container className="music-player">
      <PlayerContainer>
        <PlayerControls 
          isPlaying={isPlaying} 
          onPlayPause={handlePlayPause} 
          currentTrack={currentTrack}
          HandleTrackNext={handleTrackNext} 
          HandleTrackPrev={handleTrackPrev}
          onVolumeChange={handleVolumeChange} 
        />
        <div style={{ position: 'relative', width: '280px', height: '280px' }}>
          {analyserRef.current && (
            <AudioVisualizer 
              analyser={analyserRef.current} 
            />
          )}
          <CircularSeekbar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      </PlayerContainer>
      <Playlist 
        tracks={tracks} 
        onTrackSelect={handleTrackChange} 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause} 
      />
    </Container>
  );
}

export default MusicPlayer;
